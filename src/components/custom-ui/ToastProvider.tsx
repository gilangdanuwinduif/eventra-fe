import React, { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ToastNotification } from './ToastNotification'

import { ToastContextType } from '../../interfaces/ToastContextType'
import { Toast } from '../../interfaces/Toast'

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [toasts, setToasts] = useState<Toast[]>([])

	const showToast = useCallback((message: string, type: 'success' | 'error') => {
		const id = Math.random().toString(36).substring(2, 9) // Simple unique ID
		setToasts((prevToasts) => [...prevToasts, { id, message, type }])
	}, [])

	const removeToast = useCallback((id: string) => {
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
	}, [])

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{createPortal(
				<div className="fixed bottom-4 right-4 z-[9999] space-y-2">
					{toasts.map((toast) => (
						<ToastNotification
							key={toast.id}
							message={toast.message}
							type={toast.type}
							onClose={() => removeToast(toast.id)}
						/>
					))}
				</div>,
				document.body
			)}
		</ToastContext.Provider>
	)
}

export const useToast = () => {
	const context = useContext(ToastContext)
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}
