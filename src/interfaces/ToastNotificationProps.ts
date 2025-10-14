export interface ToastNotificationProps {
	message: string
	type: 'success' | 'error'
	onClose: () => void
}
