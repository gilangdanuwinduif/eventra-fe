import React, { useState } from 'react'

import { ValidatedInputProps } from '../../interfaces/ValidatedInputProps'

const ValidatedInput: React.FC<ValidatedInputProps> = ({
	validationType,
	label,
	value,
	onValueChange,
	prefix,
	...props
}) => {
	const [error, setError] = useState<string | null>(null)

	const validateInput = (inputValue: string): boolean => {
		let isValid = true
		let errorMessage: string | null = null

		switch (validationType) {
			case 'nik':
				// NIK should be exactly 16 digits
				if (!/^\d{16}$/.test(inputValue)) {
					isValid = false
					errorMessage = 'NIK harus 16 digit angka.'
				}
				break
			case 'email':
				// Basic email validation
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
					isValid = false
					errorMessage = 'Format email tidak valid.'
				}
				break
			case 'phoneNumber':
				// Indonesian phone number validation (starts with 08, 10-13 digits)
				if (!/^8\d{9,12}$/.test(inputValue)) {
					isValid = false
					errorMessage = 'Nomor telepon tidak valid (contoh: 081234567890).'
				}
				break
			case 'fullName':
				// Full name should only contain alphabets and spaces
				if (!/^[a-zA-Z\s]*$/.test(inputValue)) {
					isValid = false
					errorMessage = 'Nama lengkap hanya boleh berisi huruf.'
				}
				break
			case 'text':
			default:
				// No specific validation for 'text' type, but can add required check if needed
				if (props.required && inputValue.trim() === '') {
					isValid = false
					errorMessage = `${label} tidak boleh kosong.`
				}
				break
		}

		setError(errorMessage)
		return isValid
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target
		const isValid = validateInput(inputValue)
		onValueChange(e, isValid)
	}

	return (
		<div className="w-full">
			{/* Label */}
			<label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
				{label}
			</label>

			{/* Input Group */}
			<div className="flex items-center rounded-md overflow-hidden border focus-within:ring-2 focus-within:ring-[#673ab7] transition">
				{prefix && (
					<span className="px-3 py-2 bg-gray-50 text-gray-700 border-r text-sm font-medium select-none">
						{prefix}
					</span>
				)}
				<input
					{...props}
					value={value}
					onChange={handleChange}
					className={`w-full px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-transparent ${
						error ? 'border-red-500 focus:ring-red-500' : 'border-transparent'
					}`}
				/>
			</div>

			{/* Error Message */}
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	)
}

export default ValidatedInput
