import { createContext, useContext } from 'react'
import { AuthReducerState, initialState } from './Auth.state'

export interface AuthContextType extends AuthReducerState {
  signIn(): void
  signInSilent(): void
  switchUser(nationalId?: string): void
  signOut(): void
}

export const defaultAuthContext = {
  ...initialState,
  signIn() {
    // Intentionally empty
  },
  signInSilent() {
    // Intentionally empty
  },
  switchUser(_nationalId?: string) {
    // Intentionally empty
  },
  signOut() {
    // Intentionally empty
  },
}

export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export const useAuth: () => AuthContextType = () => useContext(AuthContext)
