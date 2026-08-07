import { render, screen } from '@testing-library/react'
import App from './App'
import { useAuth } from './useAuth'
import { useData } from './useData'

vi.mock('./useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('./useData', () => ({ useData: vi.fn() }))

const emptyData = {
  profile: null,
  programs: [],
  sessionLog: [],
  workoutState: {},
  loading: false,
  saveProgram: vi.fn(),
  deleteProgram: vi.fn(),
  updateProgramExercises: vi.fn(),
  saveSession: vi.fn(),
  deleteSession: vi.fn(),
  saveWorkoutState: vi.fn(),
  updateProfile: vi.fn(),
  deleteAccount: vi.fn(),
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    useData.mockReturnValue(emptyData)
  })

  it('shows a loading screen while auth is resolving', () => {
    useAuth.mockReturnValue({ user: null, loading: true, signOut: vi.fn(), signInWithGoogle: vi.fn() })
    render(<App />)
    expect(screen.getByText(/loading overload/i)).toBeInTheDocument()
  })

  it('shows the splash screen with a guest-mode entry point when logged out with no saved programs', () => {
    useAuth.mockReturnValue({ user: null, loading: false, signOut: vi.fn(), signInWithGoogle: vi.fn() })
    render(<App />)
    expect(screen.getByText(/get started/i)).toBeInTheDocument()
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
  })
})
