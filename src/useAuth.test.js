import { renderHook, waitFor, act } from '@testing-library/react'
import { useAuth } from './useAuth'
import { supabase } from './supabase'

vi.mock('./supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}))

const mockSession = (session) => {
  supabase.auth.getSession.mockResolvedValue({ data: { session } })
  supabase.auth.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  })
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts loading and resolves to no user when there is no session', async () => {
    mockSession(null)
    const { result } = renderHook(() => useAuth())
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toBeNull()
  })

  it('resolves to the session user when a session exists', async () => {
    mockSession({ user: { id: 'user-1', email: 'a@b.com' } })
    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toEqual({ id: 'user-1', email: 'a@b.com' })
  })

  it('signInWithGoogle calls supabase OAuth with the google provider', async () => {
    mockSession(null)
    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => {
      await result.current.signInWithGoogle()
    })
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'google' }),
    )
  })

  it('signInWithEmail forwards email/password and returns any error', async () => {
    mockSession(null)
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null })
    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.loading).toBe(false))
    let response
    await act(async () => {
      response = await result.current.signInWithEmail('a@b.com', 'secret')
    })
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'secret',
    })
    expect(response).toEqual({ error: null })
  })

  it('signOut calls supabase signOut', async () => {
    mockSession(null)
    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => {
      await result.current.signOut()
    })
    expect(supabase.auth.signOut).toHaveBeenCalled()
  })
})
