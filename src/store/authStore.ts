import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

export interface DecodedToken {
	sub: string
	iat: number
	exp: number
	role?: string | null // Role might be in the token, can be string or null property JWT
	fullName: string // <-- TAMBAHKAN INI : by Gilang
	profilePicture?: string | null // <-- TAMBAHKAN INI (opsional) : by Gilang
}

export interface User {
	sub: string
	iat: number
	exp: number
	role: string | null // User object will definitely have a role after fetching
	fullName: string // <-- TAMBAHKAN INI : by Gilang
	profilePicture?: string | null // <-- TAMBAHKAN INI (opsional) : by Gilang
}

export interface AuthState {
	token: string | null
	user: User | DecodedToken | null // User can be a DecodedToken initially, then a full User
	userRole: string | null
	setToken: (token: string | null) => void
	setUser: (user: User | null) => void
	logout: () => void
}

const useAuthStore = create<AuthState>((set) => ({
	token: localStorage.getItem('authToken'), // Initialize from local storage
	user: localStorage.getItem('authToken')
		? (jwtDecode(localStorage.getItem('authToken') as string) as DecodedToken)
		: null, // Decode token if it exists
	userRole: localStorage.getItem('authToken')
		? (jwtDecode(localStorage.getItem('authToken') as string) as DecodedToken).role || null
		: null, // Decode token and get userRole
	setToken: (token) => {
		if (token) {
			localStorage.setItem('authToken', token)
			const decodedToken: DecodedToken = jwtDecode(token)
			set({ token, user: decodedToken, userRole: decodedToken.role || null })
		} else {
			localStorage.removeItem('authToken')
			set({ token: null, user: null, userRole: null })
		}
	},
	setUser: (user) => set({ user, userRole: user?.role || null }), // Ensure userRole is updated when user is set
	logout: () => {
		localStorage.removeItem('authToken')
		set({ token: null, user: null, userRole: null })
	}
}))

export default useAuthStore
