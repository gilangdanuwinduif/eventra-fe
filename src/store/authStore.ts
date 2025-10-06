import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

interface AuthState {
	token: string | null
	user: any | null // You might want to define a more specific User interface
	userRole: string | null
	setToken: (token: string | null) => void
	setUser: (user: any | null) => void
	logout: () => void
}

const useAuthStore = create<AuthState>((set) => ({
	token: localStorage.getItem('authToken'), // Initialize from local storage
	user: localStorage.getItem('authToken') ? jwtDecode(localStorage.getItem('authToken') as string) : null, // Decode token if it exists
	userRole: localStorage.getItem('authToken')
		? (jwtDecode(localStorage.getItem('authToken') as string) as any).role || null
		: null, // Decode token and get userRole
	setToken: (token) => {
		if (token) {
			localStorage.setItem('authToken', token)
			const decodedToken: any = jwtDecode(token)
			set({ token, user: decodedToken, userRole: decodedToken.role || null })
		} else {
			localStorage.removeItem('authToken')
			set({ token: null, user: null, userRole: null })
		}
	},
	setUser: (user) => set({ user }),
	logout: () => {
		localStorage.removeItem('authToken')
		set({ token: null, user: null, userRole: null })
	}
}))

export default useAuthStore
