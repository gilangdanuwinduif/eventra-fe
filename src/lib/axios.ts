import axios from 'axios'

import useAuthStore from '../store/authStore' // Import useAuthStore

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api', // Replace with your actual API base URL
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true // Ensure HttpOnly cookies are sent
})

// Optional: Add response interceptors
instance.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		// Example: Handle global errors, e.g., redirect to login on 401
		if (error.response && error.response.status === 401) {
			console.log('Unauthorized, logging out...')
			useAuthStore.getState().logout() // Logout user automatically
			// Optionally redirect to login page
			// window.location.href = '/login';
		}
		return Promise.reject(error)
	}
)

export default instance
