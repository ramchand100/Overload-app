import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

export function useData(user) {
  const [profile, setProfile] = useState(null)
  const [programs, setPrograms] = useState([])
  const [sessionLog, setSessionLog] = useState([])
  const [workoutState, setWorkoutState] = useState({})
  const [loading, setLoading] = useState(true)

  // Load all data when user logs in
  useEffect(() => {
    if (!user) { setLoading(false); return }
    loadAllData()
  }, [user])

  const loadAllData = async () => {
    setLoading(true)
    await Promise.all([loadProfile(), loadPrograms(), loadSessions(), loadWorkoutState()])
    setLoading(false)
  }

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
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
    if (data) setSessionLog(data.map(s => ({
      id: s.id,
      date: new Date(s.logged_at).getTime(),
      dayName: s.day_name,
      exercises: s.exercises,
      partial: s.partial
    })))
  }

  const loadWorkoutState = async () => {
    const { data } = await supabase
      .from('workout_state')
      .select('*')
      .eq('user_id', user.id)
    if (data) {
      const ws = {}
      data.forEach(row => { ws[row.exercise_name] = row.sets })
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
        exercises: program.exs
      })
      .select()
      .single()
    if (data) setPrograms(p => [...p, data])
    return { error }
  }

  // Delete a program (by day name)
  const deleteProgram = async (dayName) => {
    const prog = programs.find(p => p.days.includes(dayName))
    if (!prog) return
    await supabase.from('programs').delete().eq('id', prog.id)
    setPrograms(p => p.filter(pr => pr.id !== prog.id))
  }

  // Update program exercises
  const updateProgramExercises = async (dayName, exercises) => {
    const prog = programs.find(p => p.days.includes(dayName))
    if (!prog) return
    const newExs = { ...prog.exercises, [dayName]: exercises }
    await supabase.from('programs').update({ exercises: newExs }).eq('id', prog.id)
    setPrograms(p => p.map(pr => pr.id === prog.id ? { ...pr, exercises: newExs } : pr))
  }

  // Save a session
  const saveSession = async (session) => {
    const todayStr = new Date().toDateString()
    // Check if session already exists today for this day
    const existing = sessionLog.find(s =>
      s.dayName === session.dayName &&
      new Date(s.date).toDateString() === todayStr
    )
    if (existing) {
      // Update existing
      await supabase.from('sessions').update({
        exercises: session.exercises,
        partial: session.partial
      }).eq('id', existing.id)
      setSessionLog(p => p.map(s => s.id === existing.id ? { ...s, ...session } : s))
    } else {
      // Insert new
      const { data } = await supabase.from('sessions').insert({
        user_id: user.id,
        day_name: session.dayName,
        exercises: session.exercises,
        partial: session.partial
      }).select().single()
      if (data) setSessionLog(p => [{
        id: data.id,
        date: new Date(data.logged_at).getTime(),
        dayName: data.day_name,
        exercises: data.exercises,
        partial: data.partial
      }, ...p])
    }
  }

  // Save workout state (last weights per exercise)
  const saveWorkoutState = async (exerciseName, sets) => {
    await supabase.from('workout_state').upsert({
      user_id: user.id,
      exercise_name: exerciseName,
      sets: sets,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,exercise_name' })
    setWorkoutState(p => ({ ...p, [exerciseName]: sets }))
  }

  // Update profile
  const updateProfile = async (updates) => {
    await supabase.from('profiles').update(updates).eq('id', user.id)
    setProfile(p => ({ ...p, ...updates }))
  }

  return {
    profile, programs, sessionLog, workoutState, loading,
    saveProgram, deleteProgram, updateProgramExercises,
    saveSession, saveWorkoutState, updateProfile, loadAllData
  }
}
