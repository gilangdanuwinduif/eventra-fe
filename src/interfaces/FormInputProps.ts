import React from 'react'

export interface FormInputProps {
	id: string
	label: string
	placeholder: string
	value: string | number
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	type?: string
	required?: boolean
	onClear?: () => void
}
