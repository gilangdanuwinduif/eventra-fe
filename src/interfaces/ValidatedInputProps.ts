import React from 'react'

export interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	validationType: 'nik' | 'email' | 'phoneNumber' | 'text' | 'fullName'
	label: string
	value: string
	onValueChange: (e: React.ChangeEvent<HTMLInputElement>, isValid: boolean) => void
	suffix?: string
}
