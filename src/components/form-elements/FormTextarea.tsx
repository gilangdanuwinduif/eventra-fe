import React from 'react'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { X } from 'lucide-react'

interface FormTextareaProps {
	id: string
	label: string
	placeholder: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	required?: boolean
	onClear?: () => void
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
	id,
	label,
	placeholder,
	value,
	onChange,
	required = false,
	onClear
}) => {
	return (
		<div>
			<Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
				{label} {required && <span className="text-red-500">*</span>}
			</Label>
			<div className="relative">
				<Textarea
					id={id}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className="w-full min-h-[100px] pr-10"
				/>
				{onClear && value && (
					<X className="absolute right-3 top-4 h-5 w-5 text-gray-400 cursor-pointer" onClick={onClear} />
				)}
			</div>
		</div>
	)
}
