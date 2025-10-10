import React from 'react'

// Public Pages
const LandingPage = React.lazy(() => import('../pages/LandingPage'))
const LoginPage = React.lazy(() => import('../pages/LoginPage'))
const RegisterPage = React.lazy(() => import('../pages/RegisterPage'))
const ProfilePage = React.lazy(() => import('../pages/ProfilePage'))

// Admin Pages
const DashboardAdminPage = React.lazy(() => import('../pages/DashboardAdminPage'))
const CreateEventPage = React.lazy(() => import('../pages/CreateEventPage'))
const UpdateEventPage = React.lazy(() => import('../pages/UpdateEventPage'))
const EventDetailPage = React.lazy(() => import('../pages/EventDetailPage'))
const CheckoutPage = React.lazy(() => import('../pages/CheckoutPage'))

export const publicRoutes = [
	{
		path: '/',
		element: LandingPage,
		exact: true
	},
	{
		path: '/login',
		element: LoginPage,
		exact: true
	},
	{
		path: '/register',
		element: RegisterPage,
		exact: true
	},
	{
		path: '/event/:id',
		element: EventDetailPage,
		exact: true
	}
]

export const privateRoutes = [
	{
		path: '/dashboard/admin',
		element: DashboardAdminPage,
		exact: true
	},
	{
		path: '/create/event',
		element: CreateEventPage,
		exact: true
	},
	{
		path: '/update/event/:id',
		element: UpdateEventPage,
		exact: true
	},
	{
		path: '/profile', //Edit : By Gilang, route untuk profile page
		element: ProfilePage,
		exact: true
	},
	{
		path: '/checkout',
		element: CheckoutPage,
		exact: true
	}
]
