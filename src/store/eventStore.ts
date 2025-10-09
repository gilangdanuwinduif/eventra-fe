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
	fetchEventById: (id: string) => Promise<Event | null>
	updateEvent: (id: string, eventData: CreateEventPayload) => Promise<void>
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
			const response = await axios.post('/events', eventData)
			if (response.data.success) {
				set({ success: true, message: response.data.message, loading: false })
			} else {
				set({ error: response.data.message || 'Failed to create event', loading: false })
			}
		} catch (err: unknown) {
			const message =
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(err as any).response?.data?.message || (err as Error).message || 'An unexpected error occurred'
			set({ error: message, loading: false })
		}
	},

	fetchEventById: async (id: string): Promise<Event | null> => {
		set({ loading: true, error: null, success: false, message: null }) // Reset success/message for fetch
		try {
			const response = await axios.get(`/events/${id}`)
			set({ loading: false }) // Only set loading to false, do not set success/message
			return response.data.data
		} catch (err: unknown) {
			const message =
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(err as any).response?.data?.message || (err as Error).message || 'Failed to fetch event'
			set({ error: message, loading: false })
			return null
		}
	},

	updateEvent: async (id: string, eventData: CreateEventPayload) => {
		set({ loading: true, error: null, success: false, message: null })
		try {
			const response = await axios.put(`/events/${id}`, eventData)
			console.log(response.data, '<=== ini apa isinya')
			console.log(response.data.data, '<=== ini apa isinya2222222222')

			if (response.data.success) {
				set({ success: true, message: response.data.message, loading: false })
			} else {
				set({ error: response.data.message || 'Failed to update event', loading: false })
			}
		} catch (err: unknown) {
			const message =
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(err as any).response?.data?.message || (err as Error).message || 'An unexpected error occurred'
			set({ error: message, loading: false })
		}
	},

	resetState: () => {
		set({ loading: false, error: null, success: false, message: null })
	}
}))
