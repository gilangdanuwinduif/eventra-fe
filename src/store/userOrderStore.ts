import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import { UserEvent } from '../types/order'

interface UserOrderState {
	events: UserEvent[]
	isLoading: boolean
	error: string | null
	fetchUserEvents: (userId: string) => Promise<void>
}

export const useUserOrderStore = create<UserOrderState>((set) => ({
	events: [],
	isLoading: false,
	error: null,
	fetchUserEvents: async (userId: string) => {
		set({ isLoading: true, error: null })
		try {
			const response = await axiosInstance.get(`/users/${userId}/events`)
			set({ events: response.data.data.content, isLoading: false })
		} catch (error) {
			set({ error: 'Failed to fetch events', isLoading: false })
		}
	}
}))
