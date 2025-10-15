import { Event } from './Event'
import { ApiResponse } from './ApiResponse'

export interface EventState {
	events: Event[]
	loading: boolean
	error: string | null
	currentPage: number
	totalPages: number
	totalElements: number
	limit: number
	fetchEvents: (page?: number, limit?: number, title?: string) => Promise<void>
	createEvent: (
		event: Omit<Event, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
		showToast: (message: string, type: 'success' | 'error') => void
	) => Promise<void>
	fetchEventById: (
		id: string,
		showToast?: (message: string, type: 'success' | 'error') => void
	) => Promise<Event | null>
	updateEvent: (
		id: string,
		event: Omit<Event, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
		showToast: (message: string, type: 'success' | 'error') => void
	) => Promise<void>
	resetState: () => void
}
