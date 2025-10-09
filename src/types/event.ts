export interface Event {
	id: string
	title: string
	description: string | null
	location: string
	startDate: string
	endDate: string
	createdAt: string
	createdBy: string | null
	updatedAt: string
	updatedBy: string | null
	imageUrl: string
	category: string
	status: string
	tickets: Ticket[]
}

export interface Ticket {
	eventId?: string // Optional, as it might be generated on the backend or not needed for creation
	ticketCategory: string
	price: number
	quota: number
	id?: string
	createdAt?: string
	createdBy?: string
	updatedAt?: string
	updatedBy?: string
}

export interface EventResponse {
	success: boolean
	message: string
	data: {
		content: Event[]
		page: number
		limit: number
		totalElements: number
		totalPages: number
		last: boolean
	}
}
