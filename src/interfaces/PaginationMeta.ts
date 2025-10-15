export interface PaginationMeta {
	totalElements: number // Changed from totalItems
	totalPages: number
	currentPage: number // This will be 'page' from the backend
	page: number // Added based on backend response
	limit: number
	last: boolean // Changed from isLast
	// isFirst: boolean; // Removed as not in backend response
}
