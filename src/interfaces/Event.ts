import { Ticket } from './Ticket'
import { EventStatus } from '../enums/EventStatus'

export interface Event {
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
