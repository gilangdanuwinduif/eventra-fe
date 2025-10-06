import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

interface AuthState {
  token: string | null
  user: any | null // You might want to define a more specific User interface
  setToken: (token: string | null) => void
  setUser: (user: any | null) => void
  logout: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('authToken'), // Initialize from local storage
  user: localStorage.getItem('authToken')
    ? jwtDecode(localStorage.getItem('authToken') as string)
    : null, // Decode token if it exists
  setToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token)
      set({ token, user: jwtDecode(token) })
    } else {
      localStorage.removeItem('authToken')
      set({ token: null, user: null })
    }
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('authToken')
    set({ token: null, user: null })
  }
}))

export default useAuthStore
