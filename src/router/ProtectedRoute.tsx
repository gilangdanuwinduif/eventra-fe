import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

interface ProtectedRouteProps {
	children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { token, user, userRole, logout } = useAuthStore()
	const navigate = useNavigate()

	useEffect(() => {
		if (!token) {
			navigate('/login')
		} else {
			// Check if token is expired
			if (user && user.exp * 1000 < Date.now()) {
				logout()
				navigate('/login')
			} else if (userRole === 'ADMIN' && window.location.pathname !== '/dashboard/admin') {
				navigate('/dashboard/admin')
			}
		}
	}, [token, user, userRole, navigate, logout])

	if (token && user && user.exp * 1000 >= Date.now()) {
		return <>{children}</>
	}

	return null // Or a loading spinner, while redirection happens
}

export default ProtectedRoute
