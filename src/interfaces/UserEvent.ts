import { EventStatus } from '../enums/EventStatus'
import { Ticket } from './Ticket'

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
	status: EventStatus
	tickets: Ticket[]
}
