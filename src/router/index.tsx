import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { publicRoutes, privateRoutes } from './routes'
import ProtectedRoute from './ProtectedRoute'
import CreateEventPage from '../pages/CreateEventPage' // Import CreateEventPage
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
						<Route key={index} path={route.path} element={React.createElement(route.element)} />
					)
				)}
				{/* Private routes will go here */}
				{privateRoutes.map((route, index) => (
					<Route
						key={index}
						path={route.path}
						element={<ProtectedRoute>{React.createElement(route.element)}</ProtectedRoute>}
					/>
				))}
			</Routes>
		</Suspense>
	)
}

export default AppRouter
