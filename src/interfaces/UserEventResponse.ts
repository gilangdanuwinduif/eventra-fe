import { UserOrderItem } from './UserOrderItem'

export interface UserEventResponse {
	content: UserOrderItem[]
	page: number
	limit: number
	totalElements: number
	totalPages: number
	last: boolean
}
