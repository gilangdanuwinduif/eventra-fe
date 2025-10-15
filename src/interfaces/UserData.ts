export interface UserData {
	id: string // UUID
	fullName: string
	email: string
	nik: string
	phone: string
	gender: string
	role?: string // Added based on backend response
	createdAt: string // Added based on backend response
	isRegistered: boolean // Added based on backend response
	wallet: number // Added based on backend response
}
