import { UserEvent } from './UserEvent'
import { Order } from './Order'

export interface UserOrderItem {
	event: UserEvent
	order: Order
}
