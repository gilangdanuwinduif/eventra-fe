import { create } from 'zustand'
import axios from '../lib/axios'
import { Event } from '../types/event'

interface EventDetailState {
	event: Event | null
	loading: boolean
	error: string | null
	fetchEventDetail: (id: string) => Promise<void>
}

const useEventDetailStore = create<EventDetailState>((set) => ({
	event: null,
	loading: false,
	error: null,
	fetchEventDetail: async (id: string) => {
		set({ loading: true, error: null })
		try {
			const response = await axios.get(`/events/${id}`)
			if (response.data.success) {
				set({ event: response.data.data, loading: false })
			} else {
				set({ error: response.data.message, loading: false })
			}
		} catch (err) {
			if (err instanceof Error) {
				set({ error: err.message, loading: false })
			} else {
				set({ error: 'An unknown error occurred', loading: false })
			}
		}
	}
}))

export default useEventDetailStore
