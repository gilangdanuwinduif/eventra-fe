export interface DecodedToken {
	sub: string
	iat: number
	exp: number
	role?: string | null
	fullName?: string | null
	profilePicture?: string | null
}
