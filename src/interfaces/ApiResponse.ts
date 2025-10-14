import { Event } from './Event'

export interface ApiResponse {
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
