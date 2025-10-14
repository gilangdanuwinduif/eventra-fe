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

export interface UserEventResponse {
	content: UserEvent[]
	page: number
	limit: number
	totalElements: number
	totalPages: number
	last: boolean
}
