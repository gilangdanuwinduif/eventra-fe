import { create } from 'zustand'
import axios from '../lib/axios'

interface Event {
	id: string
	title: string
	description: string | null
	location: string
	startDate: string
	endDate: string
	createdAt: string
	createdBy: string | null
	updatedAt: string | null
	updatedBy: string | null
	imageUrl: string
	capacity: number
	category: string
	status: string
}

interface CreateEventPayload {
	title: string
	description: string | null
	location: string
	startDate: string
	endDate: string
	imageUrl: string // Assuming a default or upload mechanism
	capacity: number
	category: string
}

interface EventState {
	loading: boolean
	error: string | null
	success: boolean
	message: string | null
	createEvent: (eventData: CreateEventPayload) => Promise<void>
	resetState: () => void
}

export const useEventStore = create<EventState>((set) => ({
	loading: false,
	error: null,
	success: false,
	message: null,

	createEvent: async (eventData: CreateEventPayload) => {
		set({ loading: true, error: null, success: false, message: null })
		try {
			const response = await axios.post('http://localhost:8080/api/events', eventData)
			if (response.data.success) {
				set({ success: true, message: response.data.message, loading: false })
			} else {
				set({ error: response.data.message || 'Failed to create event', loading: false })
			}
		} catch (err: any) {
			set({ error: err.response?.data?.message || err.message || 'An unexpected error occurred', loading: false })
		}
	},
	resetState: () => {
		set({ loading: false, error: null, success: false, message: null })
	}
}))
