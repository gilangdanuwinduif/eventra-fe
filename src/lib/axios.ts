import axios from 'axios'

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api', // Replace with your actual API base URL
	headers: {
		'Content-Type': 'application/json'
	}
})

// Optional: Add request interceptors
instance.interceptors.request.use(
	(config) => {
		// Example: Add an authorization token from local storage or a Zustand store
		const token = localStorage.getItem('authToken') // Or from your Zustand store
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Optional: Add response interceptors
instance.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		// Example: Handle global errors, e.g., redirect to login on 401
		if (error.response && error.response.status === 401) {
			console.log('Unauthorized, redirecting to login...')
			// window.location.href = '/login'; // Uncomment and adjust as needed
		}
		return Promise.reject(error)
	}
)

export default instance
