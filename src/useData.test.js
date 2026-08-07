import { renderHook, waitFor, act } from '@testing-library/react'
import { useData } from './useData'
import { supabase } from './supabase'

// Minimal chainable stand-in for the Supabase query builder: every method
// returns itself so calls can be chained in any order. `thenResult` is what
// resolves when the chain is awaited directly (used for list/update/delete
// queries); `singleResult` is what `.single()` resolves to (used after
// `.select().single()` on inserts/profile reads).
function makeQueryBuilder({
  thenResult = { data: null, error: null },
  singleResult = { data: null, error: null },
} = {}) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(singleResult)),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    upsert: vi.fn(() => Promise.resolve(thenResult)),
    then: (resolve) => resolve(thenResult),
  }
  return builder
}

vi.mock('./supabase', () => ({
  supabase: { from: vi.fn() },
}))

describe('useData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not load anything and finishes loading when there is no user', async () => {
    const { result } = renderHook(() => useData(null))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(supabase.from).not.toHaveBeenCalled()
    expect(result.current.programs).toEqual([])
  })

  it('loads profile, programs, sessions, and workout state for a logged-in user', async () => {
    const builders = {
      profiles: makeQueryBuilder({ singleResult: { data: { id: 'user-1', name: 'Alex' } } }),
      programs: makeQueryBuilder({ thenResult: { data: [{ id: 'p1', days: ['Push'] }] } }),
      sessions: makeQueryBuilder({
        thenResult: {
          data: [
            {
              id: 's1',
              logged_at: '2026-01-01T00:00:00Z',
              day_name: 'Push',
              exercises: [],
              partial: false,
            },
          ],
        },
      }),
      workout_state: makeQueryBuilder({
        thenResult: {
          data: [{ exercise_name: 'Bench Press', sets: [{ weight: 60, reps: 8 }] }],
        },
      }),
    }
    supabase.from.mockImplementation((table) => builders[table])

    const testUser = { id: 'user-1' }
    const { result } = renderHook(() => useData(testUser))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.profile).toEqual({ id: 'user-1', name: 'Alex' })
    expect(result.current.programs).toEqual([{ id: 'p1', days: ['Push'] }])
    expect(result.current.sessionLog).toHaveLength(1)
    expect(result.current.sessionLog[0].dayName).toBe('Push')
    expect(result.current.workoutState).toEqual({
      'Bench Press': [{ weight: 60, reps: 8 }],
    })
  })

  it('saveSession inserts a new session when none exists for today', async () => {
    const insertedRow = {
      id: 's2',
      logged_at: new Date().toISOString(),
      day_name: 'Pull',
      exercises: [{ name: 'Barbell Row' }],
      partial: false,
    }
    const sessionsBuilder = makeQueryBuilder({
      thenResult: { data: [] },
      singleResult: { data: insertedRow, error: null },
    })
    supabase.from.mockImplementation((table) =>
      table === 'sessions' ? sessionsBuilder : makeQueryBuilder(),
    )

    const testUser = { id: 'user-2' }
    const { result } = renderHook(() => useData(testUser))
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.saveSession({
        dayName: 'Pull',
        exercises: [{ name: 'Barbell Row' }],
        partial: false,
      })
    })

    expect(sessionsBuilder.insert).toHaveBeenCalledWith(
      expect.objectContaining({ day_name: 'Pull', partial: false }),
    )
    expect(result.current.sessionLog[0].dayName).toBe('Pull')
  })
})
