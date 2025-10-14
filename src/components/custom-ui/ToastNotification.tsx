import React, { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface ToastNotificationProps {
	message: string
	type: 'success' | 'error'
	onClose: () => void
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, type, onClose }) => {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false)
			onClose()
		}, 3000) // Disappear after 3 seconds

		return () => clearTimeout(timer)
	}, [onClose])

	const icon =
		type === 'success' ? (
			<CheckCircle2 className="h-5 w-5 text-green-500" />
		) : (
			<AlertCircle className="h-5 w-5 text-red-500" />
		)
	const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50'
	const textColor = type === 'success' ? 'text-green-800' : 'text-red-800'
	const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400'

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: -100 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -100 }}
					transition={{ duration: 0.3 }}
					className={`fixed top-4 left-1/2 -translate-x-1/2 transform z-50 flex items-center p-4 rounded-lg shadow-lg border ${bgColor} ${borderColor}`}
					role="alert"
				>
					<div className="flex-shrink-0">{icon}</div>
					<div className="ml-3 text-sm font-medium ${textColor}">{message}</div>
					<button
						type="button"
						className={`ml-auto -mx-1.5 -my-1.5 ${textColor} rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-offset-white p-1.5 inline-flex h-8 w-8`}
						onClick={() => {
							setIsVisible(false)
							onClose()
						}}
						aria-label="Close"
					>
						<span className="sr-only">Close</span>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clipRule="evenodd"
							></path>
						</svg>
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
