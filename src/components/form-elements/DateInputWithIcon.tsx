import React, { forwardRef } from 'react'
import { Input } from '../ui/input'
import { CalendarIcon } from 'lucide-react'

interface DateInputWithIconProps {
	value?: string
	onClick?: () => void
	placeholder?: string
	className?: string
}

export const DateInputWithIcon = forwardRef<HTMLInputElement, DateInputWithIconProps>(
	({ value, onClick, placeholder, className }, ref) => (
		<div className="relative">
			<Input
				id="date-picker-input"
				type="text"
				className={`w-full pr-10 ${className}`}
				onClick={onClick}
				value={value}
				placeholder={placeholder}
				readOnly
				ref={ref}
			/>
			<CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
		</div>
	)
)

DateInputWithIcon.displayName = 'DateInputWithIcon'
