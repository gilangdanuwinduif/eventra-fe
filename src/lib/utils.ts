import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatHeaderKey(key: string): string {
	if (!key) return ''

	// Handle SCREAMING_SNAKE_CASE (e.g., "FULL_NAME" -> "Full Name")
	if (key === key.toUpperCase() && key.includes('_')) {
		return key
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ')
	}

	// Handle kebab-case (e.g., "kebab-case" -> "Kebab Case")
	if (key.includes('-')) {
		return key
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
	}

	// Handle snake_case (e.g., "snake_case" -> "Snake Case")
	if (key.includes('_')) {
		return key
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
	}

	// Handle camelCase and PascalCase (e.g., "camelCase" -> "Camel Case", "PascalCase" -> "Pascal Case")
	// This also covers single words like "id" -> "Id"
	return key
		.replace(/([A-Z])/g, ' $1') // Add space before capital letters
		.split(' ') // Split by spaces
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
		.join(' ') // Join back with spaces
		.trim() // Remove leading space if any
}
