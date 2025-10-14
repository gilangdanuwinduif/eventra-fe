import { Event } from './Event'
import { OrderDetail } from './OrderDetail'

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
	event: Event
	orderDetails: OrderDetail[]
}
