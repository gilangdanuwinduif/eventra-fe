import { Event } from './Event'

export interface EventDetailState {
	event: Event | null
	loading: boolean
	error: string | null
	fetchEventDetail: (id: string) => Promise<void>
	ticketQuantity: number | 0
	setTicketQuantity: (ticketQuantity: number) => void
	ticketCategoryId: string | undefined
	setTicketCategoryId: (ticketCategoryId: string | undefined) => void
	totalPrice: number | 0
	setTotalPrice: (totalPrice: number) => void
}
