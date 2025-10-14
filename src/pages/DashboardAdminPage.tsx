import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import api from '../lib/axios' // Import the configured axios instance
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

import { SummaryData } from '../interfaces/SummaryData'
import { Event } from '../interfaces/Event'
import { ApiResponse } from '../interfaces/ApiResponse'

const DashboardAdminPage: React.FC = () => {
	const { user } = useAuthStore()
	const navigate = useNavigate()
	const [events, setEvents] = useState<Event[]>([])
	const [summary, setSummary] = useState<SummaryData | null>(null)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(1)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const handleDetailClick = (id: string) => {
		navigate(`/update/event/${id}`)
	}

	useEffect(() => {
		const fetchSummary = async () => {
			try {
				const response = await api.get<{ data: SummaryData }>('/events/summary')
				setSummary(response.data.data)
			} catch (err) {
				console.error('Failed to fetch summary data:', err)
			}
		}

		const fetchEvents = async () => {
			setLoading(true)
			setError(null)
			try {
				const response = await api.get<ApiResponse>(`/events?page=${currentPage}&limit=10`)
				setEvents(response.data.data.content)
				setTotalPages(response.data.data.totalPages)
			} catch (err) {
				setError('Failed to fetch events.')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		if (user?.role === 'ADMIN') {
			fetchSummary()
			fetchEvents()
		}
	}, [currentPage, user])

	if (user?.role !== 'ADMIN') {
		return (
			<div className="flex justify-center items-center h-screen">
				<h1 className="text-2xl font-bold text-red-500">You are not authorized to view this page.</h1>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Main Content */}
			<main className="p-8">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Dashboard Admin</h1>
					<p className="text-gray-600">Home / Dashboard</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					{/* Card 1: Tiket Terjual */}
					<div className="bg-white rounded-lg shadow-md p-6 flex items-center">
						<div className="mr-4">
							<img src="https://via.placeholder.com/48" alt="Icon" className="h-12 w-12" />
						</div>
						<div>
							<p className="text-3xl font-bold">{summary?.totalOrderDetails ?? 0}</p>
							<p className="text-gray-600">Tiket Terjual</p>
						</div>
					</div>

					{/* Card 2: Total Pendapatan */}
					<div className="bg-white rounded-lg shadow-md p-6 flex items-center">
						<div className="mr-4">
							<img src="https://via.placeholder.com/48" alt="Icon" className="h-12 w-12" />
						</div>
						<div>
							<p className="text-3xl font-bold">
								Rp{summary?.totalRevenue?.toLocaleString('id-ID') ?? 0}
							</p>
							<p className="text-gray-600">Total Pendapatan</p>
						</div>
					</div>

					{/* Card 3: Pengguna Terdaftar */}
					<div className="bg-white rounded-lg shadow-md p-6 flex items-center">
						<div className="mr-4">
							<img src="https://via.placeholder.com/48" alt="Icon" className="h-12 w-12" />
						</div>
						<div>
							<p className="text-3xl font-bold">{summary?.totalUsers ?? 0}</p>
							<p className="text-gray-600">Pengguna Terdaftar</p>
						</div>
					</div>

					{/* Card 4: Event Aktif */}
					<div className="bg-white rounded-lg shadow-md p-6 flex items-center">
						<div className="mr-4">
							<img src="https://via.placeholder.com/48" alt="Icon" className="h-12 w-12" />
						</div>
						<div>
							<p className="text-3xl font-bold">{summary?.totalUpcomingEvents ?? 0}</p>
							<p className="text-gray-600">Event Aktif</p>
						</div>
					</div>
				</div>

				{/* Event List */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex justify-end mb-4">
						<Button
							onClick={() => navigate('/create/event')}
							className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
						>
							<span className="mr-2">+</span> Event
						</Button>
					</div>

					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Judul Event
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tanggal Event
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Sisa Tiket
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{loading ? (
								<tr>
									<td colSpan={5} className="px-6 py-4 text-center text-gray-500">
										Loading events...
									</td>
								</tr>
							) : error ? (
								<tr>
									<td colSpan={5} className="px-6 py-4 text-center text-red-500">
										{error}
									</td>
								</tr>
							) : events.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-6 py-4 text-center text-gray-500">
										No events found.
									</td>
								</tr>
							) : (
								events.map((event) => (
									<tr key={event.id}>
										<td className="px-6 py-4 whitespace-nowrap">
											<img
												src={event.imageUrl || 'https://via.placeholder.com/40'}
												alt="Event Thumbnail"
												className="h-10 w-10 object-cover rounded"
											/>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{new Date(event.startDate).toLocaleDateString('id-ID', {
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">N/A</td>{' '}
										{/* Sisa Tiket - Not available in API */}
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<Button
												onClick={() => handleDetailClick(event.id)}
												className="bg-purple-600 text-white px-4 py-2 rounded-md"
											>
												Detail
											</Button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>

					{/* Pagination */}
					<div className="mt-4 flex justify-center">
						<Button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1 || loading}
							className="px-3 py-1 mx-1 border rounded-md"
						>
							Previous
						</Button>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<Button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`px-3 py-1 mx-1 border rounded-md ${
									currentPage === page ? 'bg-purple-700 text-white' : 'bg-gray-200'
								}`}
								disabled={loading}
							>
								{page}
							</Button>
						))}
						<Button
							onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
							disabled={currentPage === totalPages || loading}
							className="px-3 py-1 mx-1 border rounded-md"
						>
							Next
						</Button>
					</div>
				</div>
			</main>
		</div>
	)
}

export default DashboardAdminPage
