import { create } from 'zustand'
import axios from '../lib/axios'
import { Event, EventResponse } from '../types/event'

interface EventState {
	events: Event[]
	loading: boolean
	error: string | null
	currentPage: number
	totalPages: number
	totalElements: number
	limit: number
	success: boolean
	message: string | null
	fetchEvents: (page?: number, limit?: number) => Promise<void>
	createEvent: (event: Omit<Event, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>) => Promise<void>
	fetchEventById: (id: string) => Promise<Event | null>
	updateEvent: (
		id: string,
		event: Omit<Event, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>
	) => Promise<void>
	resetState: () => void
}

const useEventStore = create<EventState>((set, get) => ({
	events: [],
	loading: false,
	error: null,
	currentPage: 1,
	totalPages: 1,
	totalElements: 0,
	limit: 20, // Default limit as per requirement
	success: false,
	message: null,

	fetchEvents: async (page = get().currentPage, limit = get().limit) => {
		set({ loading: true, error: null, success: false, message: null })
		try {
			const response = await axios.get<EventResponse>(`/events?page=${page}&limit=${limit}`)
			if (response.data.success) {
				set({
					events: response.data.data.content,
					currentPage: response.data.data.page,
					totalPages: response.data.data.totalPages,
					totalElements: response.data.data.totalElements,
					limit: response.data.data.limit,
					loading: false,
					success: true,
					message: 'Events fetched successfully'
				})
			} else {
				set({ error: response.data.message, loading: false, success: false, message: response.data.message })
			}
		} catch (err) {
			if (err instanceof Error) {
				set({ error: err.message, loading: false, success: false, message: err.message })
			} else {
				set({
					error: 'An unknown error occurred',
					loading: false,
					success: false,
					message: 'An unknown error occurred'
				})
			}
		}
	},

	createEvent: async (eventPayload) => {
		set({ loading: true, error: null, success: false, message: null })
		try {
			const response = await axios.post('/events', eventPayload)
			if (response.data.success) {
				set({ loading: false, success: true, message: 'Event created successfully!' })
			} else {
				set({ loading: false, error: response.data.message, success: false, message: response.data.message })
			}
		} catch (err) {
			if (err instanceof Error) {
				set({ loading: false, error: err.message, success: false, message: err.message })
			} else {
				set({
					loading: false,
					error: 'An unknown error occurred',
					success: false,
					message: 'An unknown error occurred'
				})
			}
		}
	},

	fetchEventById: async (id: string) => {
		set({ loading: true, error: null, success: false, message: null })
		try {
			const response = await axios.get(`/events/${id}`)
			if (response.data.success) {
				set({ loading: false, success: true, message: 'Event fetched successfully' })
				return response.data.data
			} else {
				set({ loading: false, error: response.data.message, success: false, message: response.data.message })
				return null
			}
		} catch (err) {
			if (err instanceof Error) {
				set({ loading: false, error: err.message, success: false, message: err.message })
			} else {
				set({
					loading: false,
					error: 'An unknown error occurred',
					success: false,
					message: 'An unknown error occurred'
				})
			}
			return null
		}
	},

	updateEvent: async (id, eventPayload) => {
		set({ loading: true, error: null, success: false, message: null })
		try {
			const response = await axios.put(`/events/${id}`, eventPayload)
			if (response.data.success) {
				set({ loading: false, success: true, message: 'Event updated successfully!' })
			} else {
				set({ loading: false, error: response.data.message, success: false, message: response.data.message })
			}
		} catch (err) {
			if (err instanceof Error) {
				set({ loading: false, error: err.message, success: false, message: err.message })
			} else {
				set({
					loading: false,
					error: 'An unknown error occurred',
					success: false,
					message: 'An unknown error occurred'
				})
			}
		}
	},

	resetState: () => set({ loading: false, error: null, success: false, message: null })
}))

export default useEventStore
