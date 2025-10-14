import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from '../lib/axios'
import { EventDetailState } from '../interfaces/EventDetailState'

const useEventDetailStore = create<EventDetailState>()(
	persist(
		(set) => ({
			event: null,
			loading: false,
			error: null,
			ticketQuantity: 0,
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
			},
			setTicketQuantity: (ticketQuantity: number) => {
				set({ ticketQuantity })
			},
			ticketCategoryId: undefined,
			setTicketCategoryId: (ticketCategoryId: string | undefined) => {
				set({ ticketCategoryId })
			},
			totalPrice: 0,
			setTotalPrice: (totalPrice: number) => set({ totalPrice })
		}),
		{
			name: 'event-detail-storage'
		}
	)
)

export default useEventDetailStore
