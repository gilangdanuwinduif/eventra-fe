import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

// ==============================
// 🧩 Tipe Data
// ==============================
export interface DecodedToken {
	sub: string
	iat: number
	exp: number
	role?: string | null
	fullName?: string | null
	profilePicture?: string | null
}

export interface User extends DecodedToken {
	id: string
	fullName: string
	email: string
	phone: string
	createdAt: string
	gender: string
	nik: string
	isRegistered: boolean
}

// ==============================
// 🧠 State & Store
// ==============================
interface AuthState {
	token: string | null
	user: User | DecodedToken | null
	userRole: string | null

	setToken: (token: string | null) => void
	setUser: (user: User | null) => void
	logout: () => void
	updateProfileInStore: (updatedFields: Partial<User>) => void
}

// ==============================
// ⚙️ Store Zustand dengan Persist
// ==============================
const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			userRole: null,

			setToken: (token) => {
				if (token) {
					const decodedToken: DecodedToken = jwtDecode(token)
					set({
						token,
						user: decodedToken,
						userRole: decodedToken.role || null,
					})
				} else {
					set({ token: null, user: null, userRole: null })
				}
			},

			setUser: (user) => {
				set({
					user,
					userRole: user?.role || null,
				})
			},

			logout: () => {
				set({ token: null, user: null, userRole: null })
			},

			updateProfileInStore: (updatedFields) =>
				set((state) => {
					if (!state.user) return state

					const currentUser = state.user as User
					const updatedUser: User = {
						...currentUser,
						...updatedFields,
					}
					return { user: updatedUser }
				}),
		}),
		{
			name: 'auth-storage', // key di localStorage
			partialize: (state) => ({
				token: state.token,
				user: state.user,
				userRole: state.userRole,
			}),
		}
	)
)

export default useAuthStore
