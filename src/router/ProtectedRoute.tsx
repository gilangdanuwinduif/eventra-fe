import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom' // Import useLocation
import Navbar from '../components/landing/Navbar'
import useAuthStore from '../store/authStore'

interface ProtectedRouteProps {
	children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { token, user, userRole, logout } = useAuthStore()
	const navigate = useNavigate()
	const location = useLocation() // Get current location

	useEffect(() => {
		if (!token) {
			navigate('/login')
		} else {
			// Check if token is expired
			if (user && user.exp * 1000 < Date.now()) {
				logout()
				navigate('/login')
			} else if (location.pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
				// If trying to access admin dashboard and not an admin, redirect to home
				navigate('/')
			}
		}
	}, [token, user, userRole, navigate, logout, location.pathname])

	if (token && user && user.exp * 1000 >= Date.now()) {
		return (
			<>
				<Navbar />
				{children}
			</>
		)
	}

	return null // Or a loading spinner, while redirection happens
}

export default ProtectedRoute
