import React from 'react'
import AppRouter from './router/index.tsx'
import { ToastProvider } from './components/custom-ui/ToastProvider'

function App() {
	return (
		<ToastProvider>
			<AppRouter />
		</ToastProvider>
	)
}

export default App
