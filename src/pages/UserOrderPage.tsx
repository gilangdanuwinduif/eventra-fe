import React, { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import { UserEvent } from '../types/order'
import axiosInstance from '../lib/axios'

const UserOrderPage: React.FC = () => {
	const [events, setEvents] = useState<UserEvent[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { user, token } = useAuthStore()
	const [filter, setFilter] = useState('')

	useEffect(() => {
		const fetchUserEvents = async () => {
			if (!user?.id) return

			setIsLoading(true)
			setError(null)
			try {
				const response = await axiosInstance.get(`/users/${user.id}/events`, {
					headers: {
						Authorization: `Bearer ${token}`
					},
					params: {
						status: filter
					}
				})
				setEvents(response.data.data.content)
				console.log(response.data.data.content, '<=== ini isinya apa?')
			} catch (err) {
				setError('Failed to fetch events')
			} finally {
				setIsLoading(false)
			}
		}

		fetchUserEvents()
	}, [user])

	const filteredEvents = events.filter((event) => {
		if (filter === 'Semua') return true
		if (filter === 'Mendatang') return event.status === 'UPCOMING'
		if (filter === 'Selesai') return event.status === 'COMPLETED'
		if (filter === 'Dibatalkan') return event.status === 'CANCELLED'
		return true
	})

	const upcomingEvents = filteredEvents.filter((event) => event.status === 'UPCOMING')
	const pastEvents = filteredEvents.filter((event) => event.status === 'COMPLETED' || event.status === 'CANCELLED')

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (error) {
		return <div>Error: {error}</div>
	}

	const renderEventCard = (event: UserEvent) => {
		const eventDate = new Date(event.startDate).toLocaleDateString('id-ID', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
		const eventTime = new Date(event.startDate).toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit'
		})

		return (
			<div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="p-4 bg-purple-500 text-white">
					<div className="flex justify-between items-center mb-2">
						<p className="text-sm">
							{eventDate} - {eventTime}
						</p>
						<span
							className={`px-2 py-1 text-xs rounded-full ${
								event.status === 'UPCOMING'
									? 'bg-white text-purple-600'
									: event.status === 'COMPLETED'
										? 'bg-orange-500 text-white'
										: 'bg-red-500 text-white'
							}`}
						>
							{event.status === 'UPCOMING'
								? 'Mendatang'
								: event.status === 'COMPLETED'
									? 'Selesai'
									: 'Dibatalkan'}
						</span>
					</div>
					<h3 className="text-xl font-bold">{event.title}</h3>
					<p className="text-sm">{event.location}</p>
				</div>
				<div className="p-4">
					<div className="flex justify-between mb-2">
						<span className="text-gray-600">No. Tiket</span>
						<span className="font-semibold">#VSP-20231105-7892</span>
					</div>
					<div className="flex justify-between mb-2">
						<span className="text-gray-600">Jenis Tiket</span>
						<span className="font-semibold">Regular</span>
					</div>
					<div className="flex justify-between mb-4">
						<span className="text-gray-600">Harga</span>
						<span className="font-semibold">Rp XXXXXX</span>
					</div>
					{event.status === 'UPCOMING' && (
						<>
							<div className="bg-gray-200 h-40 flex items-center justify-center rounded-md mb-4">
								<p className="text-gray-500">Scan QR code saat masuk event</p>
							</div>
							<button className="w-full bg-purple-600 text-white py-2 rounded-md">Unduh E-Tiket</button>
						</>
					)}
					{event.status === 'COMPLETED' && (
						<button className="w-full bg-purple-600 text-white py-2 rounded-md">Lihat Invoice</button>
					)}
					{event.status === 'CANCELLED' && (
						<button className="w-full bg-purple-600 text-white py-2 rounded-md">Beli Lagi</button>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className="bg-gray-50 min-h-screen">
			<div className="container mx-auto py-8">
				<h1 className="text-3xl font-bold mb-6">Tiket Saya</h1>

				<div className="mb-6">
					<button
						onClick={() => setFilter('Semua')}
						className={`px-4 py-2 rounded-md mr-2 ${
							filter === 'Semua' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-300'
						}`}
					>
						Semua
					</button>
					<button
						onClick={() => setFilter('Mendatang')}
						className={`px-4 py-2 rounded-md mr-2 ${
							filter === 'Mendatang' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-300'
						}`}
					>
						Mendatang
					</button>
					<button
						onClick={() => setFilter('Selesai')}
						className={`px-4 py-2 rounded-md mr-2 ${
							filter === 'Selesai' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-300'
						}`}
					>
						Selesai
					</button>
					<button
						onClick={() => setFilter('Dibatalkan')}
						className={`px-4 py-2 rounded-md ${
							filter === 'Dibatalkan' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-300'
						}`}
					>
						Dibatalkan
					</button>
				</div>

				{upcomingEvents.length > 0 && (
					<div>
						<h2 className="text-2xl font-semibold mb-4">Event Mendatang</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{upcomingEvents.map(renderEventCard)}
						</div>
					</div>
				)}

				{pastEvents.length > 0 && (
					<div className="mt-12">
						<h2 className="text-2xl font-semibold mb-4">Event Terdahulu</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{pastEvents.map(renderEventCard)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default UserOrderPage
