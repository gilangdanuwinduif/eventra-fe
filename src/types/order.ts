export interface UserEvent {
	id: string
	title: string
	description: string
	location: string
	startDate: string
	endDate: string
	createdAt: string
	createdBy: string
	updatedAt: string
	updatedBy: string
	imageUrl: string
	category: string
	status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED'
	tickets: null | unknown[] // Replace 'any' with a specific ticket type if available
}

export interface Order {
	id: string
	orderNumber: string
	userId: string
	eventId: string
	status: string
	totalPrice: number
	createdAt: string
	createdBy: string
	updatedAt: string | null
	updatedBy: string | null
}

export interface UserOrderItem {
	event: UserEvent
	order: Order
}

export interface UserEventResponse {
	content: UserOrderItem[]
	page: number
	limit: number
	totalElements: number
	totalPages: number
	last: boolean
}
