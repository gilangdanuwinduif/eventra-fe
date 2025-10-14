import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios' // Assuming axios is already configured or will be configured

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
	fullName: string | null
	email: string
	phone: string
	createdAt: string
	gender: string
	nik: string
	isRegistered: boolean
	wallet: number
}

// ==============================
// 🧠 State & Store
// ==============================
interface AuthState {
	token: string | null
	user: User | null
	userRole: string | null

	setToken: (token: string | null) => void
	setUser: (user: User | null) => void
	logout: () => void
	updateProfileInStore: (updatedFields: Partial<User>) => void
	updateWalletBalance: (newBalance: number) => void
	refetchUser: (userId: string, token: string) => Promise<void>
	topupAmount: number
	setTopupAmount: (amount: number) => void
	topupWallet: (userId: string, amount: number, token: string) => Promise<boolean>
}

// ==============================
// ⚙️ Store Zustand dengan Persist
// ==============================
const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			token: null,
			user: null,
			userRole: null,
			topupAmount: 0, // Initialize topupAmount

			setToken: (token) => {
				if (token) {
					const decodedToken: DecodedToken = jwtDecode(token)
					const userFromToken: User = {
						id: decodedToken.sub ?? '', // Assuming 'sub' is the user ID, provide empty string fallback
						fullName: decodedToken.fullName ?? '',
						email: '', // Placeholder
						phone: '', // Placeholder
						createdAt: '', // Placeholder
						gender: '', // Placeholder
						nik: '', // Placeholder
						isRegistered: false, // Placeholder
						wallet: 0, // Placeholder
						...decodedToken // Spread decodedToken to include other properties like role, profilePicture, iat, exp
					}
					set({
						token,
						user: userFromToken,
						userRole: decodedToken.role || null
					})
				} else {
					set({ token: null, user: null, userRole: null })
				}
			},

			setUser: (user) => {
				set({
					user,
					userRole: user?.role || null
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
						...updatedFields
					}
					return { user: updatedUser }
				}),

			updateWalletBalance: (newBalance: number) =>
				set((state) => {
					if (!state.user) return state

					const currentUser = state.user as User
					const updatedUser: User = {
						...currentUser,
						wallet: newBalance
					}
					return { user: updatedUser }
				}),

			refetchUser: async (userId, token) => {
				try {
					const response = await axios.get(`/api/users/${userId}`, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					})
					if (response.data.data) {
						set({ user: response.data.data })
					}
				} catch (error) {
					console.error('Failed to refetch user:', error)
				}
			},

			setTopupAmount: (amount) => set({ topupAmount: amount }),

			topupWallet: async (userId, amount, token) => {
				try {
					const response = await axios.put(
						`/api/users/${userId}`,
						{ wallet: amount }, // The curl example shows sending the new total wallet amount
						{
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${token}`
							}
						}
					)
					if (response.status === 200) {
						// Update the user's wallet balance in the auth store
						const currentUser = get().user as User
						const newWalletBalance = currentUser.wallet + amount
						get().updateWalletBalance(newWalletBalance)
						set({ topupAmount: 0 })
						return true
					}
					return false
				} catch (error) {
					console.error('Failed to top up wallet:', error)
					return false
				}
			}
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				token: state.token,
				user: state.user,
				userRole: state.userRole
			})
		}
	)
)

export default useAuthStore
