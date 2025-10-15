import { create } from 'zustand'
import axios from '../lib/axios'
import useAuthStore from './authStore'
import { EventState } from '../interfaces/EventState'
import { ApiResponse } from '../interfaces/ApiResponse'

const useEventStore = create<EventState>((set, get) => ({
	events: [],
	loading: false,
	error: null,
	currentPage: 1,
	totalPages: 1,
	totalElements: 0,
	limit: 20, // Default limit as per requirement

	fetchEvents: async (page = get().currentPage, limit = get().limit, title?: string) => {
		set({ loading: true, error: null })
		try {
			let url = `/events?page=${page}&limit=${limit}`
			if (title) {
				url += `&title=${title}`
			}
			const response = await axios.get<ApiResponse>(url)
			if (response.data.success) {
				set({
					events: response.data.data.content,
					currentPage: response.data.data.page,
					totalPages: response.data.data.totalPages,
					totalElements: response.data.data.totalElements,
					limit: response.data.data.limit,
					loading: false
				})
			} else {
				set({ error: response.data.message, loading: false })
			}
		} catch (err) {
			if (err instanceof Error) {
				set({ error: err.message, loading: false })
			} else {
				set({
					error: 'An unknown error occurred',
					loading: false
				})
			}
		}
	},

	createEvent: async (eventPayload, showToast) => {
		set({ loading: true, error: null })
		const token = useAuthStore.getState().token
		try {
			const response = await axios.post('/events', eventPayload, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			if (response.data.success) {
				set({ loading: false })
				showToast('Event created successfully!', 'success')
			} else {
				set({ loading: false, error: response.data.message })
				showToast(response.data.message || 'Failed to create event', 'error')
			}
		} catch (err) {
			if (err instanceof Error) {
				set({ loading: false, error: err.message })
				showToast(err.message, 'error')
			} else {
				set({
					loading: false,
					error: 'An unknown error occurred'
				})
				showToast('An unknown error occurred', 'error')
			}
		}
	},

	fetchEventById: async (id: string, showToast) => {
		set({ loading: true, error: null })
		const token = useAuthStore.getState().token
		try {
			const response = await axios.get(`/events/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			if (response.data.success) {
				set({ loading: false })
				if (showToast) showToast('Event fetched successfully', 'success')
				return response.data.data
			} else {
				set({ loading: false, error: response.data.message })
				if (showToast) showToast(response.data.message || 'Failed to fetch event', 'error')
				return null
			}
		} catch (err) {
			if (err instanceof Error) {
				set({ loading: false, error: err.message })
				if (showToast) showToast(err.message, 'error')
			} else {
				set({
					loading: false,
					error: 'An unknown error occurred'
				})
				if (showToast) showToast('An unknown error occurred', 'error')
			}
			return null
		}
	},

	updateEvent: async (id, eventPayload, showToast) => {
		set({ loading: true, error: null })
		const token = useAuthStore.getState().token
		try {
			const response = await axios.put(`/events/${id}`, eventPayload, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			if (response.data.success) {
				set({ loading: false })
				showToast('Event updated successfully!', 'success')
			} else {
				set({ loading: false, error: response.data.message })
				showToast(response.data.message || 'Failed to update event', 'error')
			}
		} catch (err) {
			if (err instanceof Error) {
				set({ loading: false, error: err.message })
				showToast(err.message, 'error')
			} else {
				set({
					loading: false,
					error: 'An unknown error occurred'
				})
				showToast('An unknown error occurred', 'error')
			}
		}
	},

	resetState: () => set({ loading: false, error: null })
}))

export default useEventStore
