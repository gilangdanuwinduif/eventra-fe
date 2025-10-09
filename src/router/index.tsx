import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { publicRoutes, privateRoutes } from './routes'
import ProtectedRoute from './ProtectedRoute'
import Navbar from '../components/landing/Navbar' // Import Navbar

const AppRouter: React.FC = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Navbar /> {/* Render Navbar globally */}
			<Routes>
				{publicRoutes.map(
					(
						route: {
							path: string
							element: React.LazyExoticComponent<React.FC>
							exact: boolean
						},
						index: number
					) => (
						<Route key={index} path={route.path} element={<route.element />} />
					)
				)}
				{/* Private routes will go here */}
				{privateRoutes.map((route, index) => (
					<Route
						key={index}
						path={route.path}
						element={<ProtectedRoute>{<route.element />}</ProtectedRoute>}
					/>
				))}
			</Routes>
		</Suspense>
	)
}

export default AppRouter
