import { UserData } from './UserData'
import { PaginationMeta } from './PaginationMeta'

// Tipe Respons API Lengkap (sesuai structure: ApiResponse<PaginationResponse<UserResponse>>)
export interface UserListResponse {
	success: boolean
	message: string
	data: PaginationMeta & {
		// Menggabungkan properti pagination langsung ke 'data'
		content: UserData[]
	}
}
