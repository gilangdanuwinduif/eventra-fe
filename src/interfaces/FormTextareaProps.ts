export interface FormTextareaProps {
	id: string
	label: string
	placeholder: string
	value: string
	onChange: (content: string) => void
	required?: boolean
	onClear?: () => void
}
