import { Event } from './Event'
import { Order } from './Order'
import { OrderDetail } from './OrderDetail'

export interface UserEventOrderItem {
	event: Event
	order: Omit<Order, 'event' | 'orderDetails'>
	orderDetails: OrderDetail[]
}
