import React, { useState } from 'react'
import axios from '../lib/axios' // Our configured Axios instance
import useAuthStore from '../store/authStore' // Our Zustand store
import { Button } from './ui/button'

const DemoComponent: React.FC = () => {
	const { token, user, setToken, setUser, logout } = useAuthStore()
	const [apiResponse, setApiResponse] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const handleLogin = () => {
		// Simulate a login
		const dummyToken = 'fake-jwt-token-123'
		const dummyUser = {
			id: '1', // Changed to string as per User interface
			fullName: 'John Doe',
			email: 'john.doe@example.com',
			phone: '123-456-7890',
			createdAt: new Date().toISOString(),
			gender: 'Male',
			nik: '1234567890123456',
			isRegistered: true,
			wallet: 100000,
			sub: '1', // Required by DecodedToken
			iat: Date.now(), // Required by DecodedToken
			exp: Date.now() + 3600000 // Required by DecodedToken (1 hour from now)
		}
		setToken(dummyToken)
		setUser(dummyUser)
		setApiResponse('Logged in successfully!')
	}

	const handleLogout = () => {
		logout()
		setApiResponse('Logged out successfully!')
	}

	const fetchData = async () => {
		setLoading(true)
		setError(null)
		setApiResponse(null)
		try {
			// Example API call using our configured Axios instance
			// This will automatically include the Authorization header if a token is present
			const response = await axios.get('/users') // Replace with a valid API endpoint for testing
			setApiResponse(JSON.stringify(response.data, null, 2))
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message)
			} else {
				setError('An unknown error occurred')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			style={{
				padding: '20px',
				border: '1px solid #ccc',
				borderRadius: '8px',
				margin: '20px'
			}}
		>
			<h2>Axios & Zustand Demo</h2>

			<h3>Authentication Status</h3>
			<p>Token: {token ? 'Present' : 'Not Present'}</p>
			<p>User: {user ? user.fullName : 'Not Logged In'}</p>
			<Button onClick={handleLogin} style={{ marginRight: '10px' }}>
				Login
			</Button>
			<Button onClick={handleLogout}>Logout</Button>

			<h3>API Call Demo</h3>
			<Button onClick={fetchData} disabled={loading}>
				{loading ? 'Fetching...' : 'Fetch Data from API'}
			</Button>
			{error && <p style={{ color: 'red' }}>Error: {error}</p>}
			{apiResponse && (
				<div>
					<h4>API Response:</h4>
					<pre
						style={{
							backgroundColor: '#eee',
							padding: '10px',
							borderRadius: '4px'
						}}
					>
						{apiResponse}
					</pre>
				</div>
			)}
		</div>
	)
}

export default DemoComponent
