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
	capacity: number
	category: string
	status: string
	importantInfo: string | null
	ticketTypes: TicketType[]
}

export interface TicketType {
	name: string
	price: number
	quantity: number
	purchaseLimit: number
	importantInfo: string | null
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
