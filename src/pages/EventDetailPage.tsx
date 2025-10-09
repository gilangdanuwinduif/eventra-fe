import React, { useEffect, useState } from 'react' // Minor change to trigger TS server restart (3)
import { useParams } from 'react-router-dom'
import useEventDetailStore from '../store/eventDetailStore'
import Navbar from '../components/landing/Navbar'
import { Button } from '../components/ui/button' // Assuming a Button component exists

const EventDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const { event, loading, error, fetchEventDetail } = useEventDetailStore()
	const [ticketQuantity, setTicketQuantity] = useState(1)

	useEffect(() => {
		if (id) {
			fetchEventDetail(id)
		}
	}, [id, fetchEventDetail])

	const handleBuyTicket = () => {
		alert(`Buying ${ticketQuantity} tickets for ${event?.title}`)
		// Implement actual ticket purchase logic here
	}

	const handleSaveForLater = () => {
		alert(`Saving ${event?.title} for later`)
		// Implement save for later logic here
	}

	if (loading) {
		return <div className="flex justify-center items-center h-screen">Loading event details...</div>
	}

	if (error) {
		return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
	}

	if (!event) {
		return <div className="flex justify-center items-center h-screen">No event found.</div>
	}

	// Helper to format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	return (
		<div className="min-h-screen bg-purple-50">
			<Navbar />
			<div className="container mx-auto p-4 pt-20">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column: Event Poster and Details */}
					<div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
						<div className="relative mb-6">
							<img
								src={event.imageUrl}
								alt={event.title}
								className="w-full h-96 object-cover rounded-lg"
							/>
							<span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
								Trending
							</span>
						</div>
						<h2 className="text-2xl font-bold mb-2">{event.title}</h2>
						<p className="text-gray-600 mb-4">{event.description}</p>

						<div className="flex items-center text-gray-700 mb-2">
							<span className="font-semibold mr-2">Location:</span>
							<span>{event.location}</span>
						</div>
						<div className="flex items-center text-gray-700 mb-2">
							<span className="font-semibold mr-2">Category:</span>
							<span>{event.category}</span>
						</div>
						<div className="flex items-center text-gray-700 mb-2">
							<span className="font-semibold mr-2">Start Date:</span>
							<span>{formatDate(event.startDate)}</span>
						</div>
						<div className="flex items-center text-gray-700 mb-2">
							<span className="font-semibold mr-2">End Date:</span>
							<span>{formatDate(event.endDate)}</span>
						</div>

						{/* Highlights - Placeholder for now */}
						<div className="mt-6">
							<h3 className="text-xl font-semibold mb-3">Highlights</h3>
							<ul className="list-disc list-inside text-gray-700">
								<li>List Highlight 1</li>
								<li>List Highlight 2</li>
							</ul>
						</div>
					</div>

					{/* Right Column: Ticket Purchase */}
					<div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit sticky top-20">
						<h2 className="text-3xl font-bold text-purple-700 mb-2">Rp 300.000</h2>
						<p className="text-gray-600 mb-4">Harga sudah termasuk pajak</p>

						<div className="mb-6">
							<label className="block text-gray-700 text-sm font-bold mb-2">Jumlah tiket</label>
							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									size="icon"
									onClick={() => setTicketQuantity((prev) => Math.max(1, prev - 1))}
								>
									-
								</Button>
								<span className="text-lg font-semibold">{ticketQuantity}</span>
								<Button
									variant="outline"
									size="icon"
									onClick={() => setTicketQuantity((prev) => Math.min(event.capacity, prev + 1))}
								>
									+
								</Button>
								<span className="text-gray-500 text-sm">Max pembelian {event.capacity} tiket</span>
							</div>
						</div>

						<div className="border-t border-gray-200 pt-4">
							<div className="flex justify-between mb-2">
								<span className="text-gray-700">Tiket Regular</span>
								<span className="font-semibold">Rp xxx</span>
							</div>
							<div className="flex justify-between mb-2">
								<span className="text-gray-700">Biaya Lain</span>
								<span className="font-semibold">Rp xxx</span>
							</div>
							<div className="flex justify-between font-bold text-lg mt-4">
								<span>Total</span>
								<span>Rp xxxx.xxxx</span>
							</div>
						</div>

						<div className="mt-6 space-y-3">
							<Button
								className="w-full bg-purple-600 hover:bg-purple-700 text-white"
								onClick={handleBuyTicket}
							>
								Beli Tiket Sekarang
							</Button>
							<Button
								variant="outline"
								className="w-full border-purple-600 text-purple-600"
								onClick={handleSaveForLater}
							>
								Simpan untuk Nanti
							</Button>
						</div>
					</div>
				</div>

				{/* Additional Info Section */}
				<div className="mt-8 bg-white rounded-lg shadow-md p-6">
					<div className="flex items-center mb-4">
						<span className="mr-2 text-xl">🏷️</span>
						<div>
							<p className="font-semibold">Kategori</p>
							<p className="text-gray-600">{event.category}</p>
						</div>
					</div>
					<div className="flex items-center">
						<span className="mr-2 text-xl">🅿️</span>
						<div>
							<p className="font-semibold">Parkir</p>
							<p className="text-gray-600">Tersedia area parkir luas dengan kapasitas 500 mobil</p>
						</div>
					</div>
				</div>

				{/* Placeholder for more content */}
				<div className="mt-8 bg-white rounded-lg shadow-md p-6 h-48">
					<p className="text-gray-500">More content here...</p>
				</div>
			</div>
			<footer className="bg-gray-800 text-white text-center p-4 mt-8">FOOTER</footer>
		</div>
	)
}

export default EventDetailPage
