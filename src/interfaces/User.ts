import { DecodedToken } from './DecodedToken'

export interface User extends DecodedToken {
	id: string
	fullName: string | null
	email: string
	phone: string
	createdAt: string
	gender: string
	nik: string
	isRegistered: boolean
	wallet: number
}
