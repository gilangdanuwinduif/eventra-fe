import React from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { X } from 'lucide-react'

interface FormInputProps {
	id: string
	label: string
	placeholder: string
	value: string | number
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	type?: string
	required?: boolean
	onClear?: () => void
}

export const FormInput: React.FC<FormInputProps> = ({
	id,
	label,
	placeholder,
	value,
	onChange,
	type = 'text',
	required = false,
	onClear
}) => {
	return (
		<div>
			<Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
				{label} {required && <span className="text-red-500">*</span>}
			</Label>
			<div className="relative">
				<Input
					id={id}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className="w-full pr-10"
					min={type === 'number' ? 1 : undefined} // Enforce minimum value of 1 for number inputs
				/>
				{onClear && value !== 0 && (
					<X
						className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
						onClick={onClear}
					/>
				)}
			</div>
		</div>
	)
}
