import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export function useData(user) {
  const [profile, setProfile] = useState(null)
  const [programs, setPrograms] = useState([])
  const [sessionLog, setSessionLog] = useState([])
  const [workoutState, setWorkoutState] = useState({})
  const [loading, setLoading] = useState(true)

  // Local (not UTC) YYYY-MM-DD key — avoids the toDateString() locale/timezone edge cases
  const localDateKey = (ts) => {
    const d = new Date(ts)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  // Load all data when user logs in
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    loadAllData()
  }, [user])

  const loadAllData = async () => {
    setLoading(true)
    await Promise.all([loadProfile(), loadPrograms(), loadSessions(), loadWorkoutState()])
    setLoading(false)
  }

  const loadProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) setProfile(data)
  }

  const loadPrograms = async () => {
    const { data } = await supabase
      .from('programs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    if (data) setPrograms(data)
  }

  const loadSessions = async () => {
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: false })
      .limit(100)
    if (data)
      setSessionLog(
        data.map((s) => ({
          id: s.id,
          date: new Date(s.logged_at).getTime(),
          dayName: s.day_name,
          exercises: s.exercises,
          partial: s.partial,
        })),
      )
  }

  const loadWorkoutState = async () => {
    const { data } = await supabase.from('workout_state').select('*').eq('user_id', user.id)
    if (data) {
      const ws = {}
      data.forEach((row) => {
        ws[row.exercise_name] = row.sets
      })
      setWorkoutState(ws)
    }
  }

  // Save a program
  const saveProgram = async (program) => {
    const { data, error } = await supabase
      .from('programs')
      .insert({
        user_id: user.id,
        split_id: program.split.id,
        split_name: program.split.name,
        days: program.days,
        exercises: program.exs,
      })
      .select()
      .single()
    if (data) setPrograms((p) => [...p, data])
    return { error, data }
  }

  // Delete a single day from a program (only removes the whole program row if no days remain)
  const deleteProgram = async (dayName) => {
    const prog = programs.find((p) => p.days.includes(dayName))
    if (!prog) return { error: null }
    const newDays = prog.days.filter((d) => d !== dayName)
    const newExercises = { ...prog.exercises }
    delete newExercises[dayName]
    if (newDays.length === 0) {
      const { error } = await supabase.from('programs').delete().eq('id', prog.id)
      if (!error) setPrograms((p) => p.filter((pr) => pr.id !== prog.id))
      return { error }
    }
    const { error } = await supabase
      .from('programs')
      .update({ days: newDays, exercises: newExercises })
      .eq('id', prog.id)
    if (!error)
      setPrograms((p) =>
        p.map((pr) => (pr.id === prog.id ? { ...pr, days: newDays, exercises: newExercises } : pr)),
      )
    return { error }
  }

  // Update program exercises
  const updateProgramExercises = async (dayName, exercises) => {
    const prog = programs.find((p) => p.days.includes(dayName))
    if (!prog) return { error: new Error('Program not found') }
    const newExs = { ...prog.exercises, [dayName]: exercises }
    const { error } = await supabase
      .from('programs')
      .update({ exercises: newExs })
      .eq('id', prog.id)
    if (!error)
      setPrograms((p) => p.map((pr) => (pr.id === prog.id ? { ...pr, exercises: newExs } : pr)))
    return { error }
  }

  // Save a session — DB write happens first; caller should only update UI on success.
  // session.date lets the caller target a specific past day (backfilling); defaults to now.
  const saveSession = async (session) => {
    const dateMs = session.date ?? Date.now()
    const dateKey = localDateKey(dateMs)
    const existing = sessionLog.find(
      (s) => s.dayName === session.dayName && localDateKey(s.date) === dateKey,
    )
    if (existing) {
      const { error } = await supabase
        .from('sessions')
        .update({
          exercises: session.exercises,
          partial: session.partial,
        })
        .eq('id', existing.id)
      if (!error)
        setSessionLog((p) => p.map((s) => (s.id === existing.id ? { ...s, ...session } : s)))
      return { error }
    } else {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          day_name: session.dayName,
          exercises: session.exercises,
          partial: session.partial,
          logged_at: new Date(dateMs).toISOString(),
        })
        .select()
        .single()
      if (data)
        setSessionLog((p) =>
          [
            {
              id: data.id,
              date: new Date(data.logged_at).getTime(),
              dayName: data.day_name,
              exercises: data.exercises,
              partial: data.partial,
            },
            ...p,
          ].sort((a, b) => b.date - a.date),
        )
      return { error, data }
    }
  }

  // Delete a saved session (used by "Reset" when a session was already logged for the day).
  // .select() makes Postgres return the deleted row(s), so an RLS policy silently matching
  // zero rows (error: null, no rows affected) is distinguishable from a real success.
  const deleteSession = async (sessionId) => {
    const { data, error } = await supabase.from('sessions').delete().eq('id', sessionId).select()
    if (error) return { error }
    if (!data || data.length === 0) {
      return { error: new Error('Session was not deleted (check RLS policy)') }
    }
    setSessionLog((p) => p.filter((s) => s.id !== sessionId))
    return { error: null }
  }

  // Save workout state (last weights per exercise)
  const saveWorkoutState = async (exerciseName, sets) => {
    const { error } = await supabase.from('workout_state').upsert(
      {
        user_id: user.id,
        exercise_name: exerciseName,
        sets: sets,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,exercise_name' },
    )
    if (!error) setWorkoutState((p) => ({ ...p, [exerciseName]: sets }))
    return { error }
  }

  // Update profile
  const updateProfile = async (updates) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
    if (!error) setProfile((p) => ({ ...p, ...updates }))
    return { error }
  }

  // Delete all of the user's data and sign out.
  // NOTE: this removes their rows from every table (sessions, workout_state, programs, profiles)
  // and signs them out. It does NOT delete the underlying Supabase auth.users record itself —
  // that requires the service-role key and must be done from a server-side Edge Function, not
  // from the browser. Wire this up to a Supabase Edge Function if full account deletion (so the
  // email could be reused to sign up fresh) is required.
  const deleteAccount = async () => {
    try {
      await supabase.from('sessions').delete().eq('user_id', user.id)
      await supabase.from('workout_state').delete().eq('user_id', user.id)
      await supabase.from('programs').delete().eq('user_id', user.id)
      await supabase.from('profiles').delete().eq('id', user.id)
      await supabase.auth.signOut()
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return {
    profile,
    programs,
    sessionLog,
    workoutState,
    loading,
    saveProgram,
    deleteProgram,
    updateProgramExercises,
    saveSession,
    deleteSession,
    saveWorkoutState,
    updateProfile,
    deleteAccount,
    loadAllData,
  }
}
