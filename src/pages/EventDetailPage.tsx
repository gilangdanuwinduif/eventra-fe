import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useEventDetailStore from '../store/eventDetailStore'
import { useToast } from '../hooks/useToast'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import DOMPurify from 'dompurify'
import authStore from '../store/authStore'
import { User } from '../store/authStore' // Import User type from authStore

const EventDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const { event, loading, error, fetchEventDetail } = useEventDetailStore()
	const [selectedTicketId, setSelectedTicketId] = useState<string | undefined>(
		event?.tickets && event.tickets.length > 0 ? event.tickets[0].id : undefined
	)
	const [ticketQuantity, setTicketQuantity] = useState(1)
	const [totalPrice, setTotalPrice] = useState(0)
	const [userRole] = useState<string | null>(authStore.getState().userRole) // Removed setUserRole
	const [user, setUser] = useState<User | null>(authStore.getState().user) // Get user from authStore
	const navigate = useNavigate()
	const { showToast } = useToast()
	const token = authStore.getState().token

	useEffect(() => {
		const unsubscribe = authStore.subscribe((state) => {
			setUser(state.user)
		})
		return () => unsubscribe()
	}, [])

	useEffect(() => {
		if (id) {
			fetchEventDetail(id)
		}
	}, [id, fetchEventDetail])

	useEffect(() => {
		if (event && event.tickets && event.tickets.length > 0) {
			// Set initial selected ticket to the first one if none is selected
			if (!selectedTicketId) {
				setSelectedTicketId(event.tickets[0].id)
			}
			// Calculate total price
			setTotalPrice(calculateTotal())
		}
	}, [event, selectedTicketId, ticketQuantity])

	const handleBuyTicket = () => {
		if (!token) {
			showToast('Anda harus melakukan login terlebih dahulu', 'error')
			navigate('/login')
			return
		}

		const selectedTicket = event?.tickets.find((ticket) => ticket.id === selectedTicketId)
		if (selectedTicket) {
			useEventDetailStore.setState({ ticketQuantity, ticketCategoryId: selectedTicket.id })
			navigate(`/checkout/${id}`)
		} else {
			showToast('Please select a ticket category.', 'error')
		}
	}

	const calculateSubtotal = () => {
		const selectedTicket = event?.tickets.find((ticket) => ticket.id === selectedTicketId)
		return (selectedTicket?.price || 0) * ticketQuantity
	}

	const calculateServiceFee = () => {
		return 10000
	}

	const calculatePPN = () => {
		const totalPrice = calculateSubtotal() + calculateServiceFee()
		return totalPrice * 0.11 // 11% PPN
	}

	const calculateTotal = () => {
		return calculateSubtotal() + calculateServiceFee() + calculatePPN()
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
		<div className="min-h-screen bg-[#d1c4e9] py-[100px] text-[#4a148c] min-h-[500px] flex flex-col justify-center items-center w-full">
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
						<div className="flex flex-row items-center justify-between">
							<h2 className="text-2xl font-bold mb-2">{event.title}</h2>
							<div className="flex items-center mb-4">
								<span className="mr-2 text-xl">🏷️</span>
								<div>
									<p className="font-semibold">Kategori</p>
									<p className="text-gray-600">{event.category}</p>
								</div>
							</div>
						</div>

						<div className="flex items-center text-gray-700 mb-2">
							<span className="font-semibold mr-2">Location:</span>
							<span>{event.location}</span>
						</div>
						<div className="flex items-center text-gray-700 mb-2">
							<span className="font-semibold mr-2">Start Date:</span>
							<span>{formatDate(event.startDate)}</span>
						</div>
						<div className="flex items-center text-gray-700 mb-2">
							<span className="font-semibold mr-2">End Date:</span>
							<span>{formatDate(event.endDate)}</span>
						</div>
					</div>

					{/* Right Column: Ticket Purchase */}
					<div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit sticky top-20">
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-3xl font-bold text-purple-700">
								Rp{' '}
								{(
									event.tickets.find((ticket) => ticket.id === selectedTicketId)?.price || 0
								).toLocaleString('id-ID')}
							</h2>
							<Button variant="outline" size="icon" onClick={() => showToast('Share event!', 'success')}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8.684 13.342C8.886 12.938 9 12.493 9 12c0-.493-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
									/>
								</svg>
							</Button>
						</div>
						<p className="text-gray-600 mb-4">Harga sudah termasuk pajak</p>

						<div className="mb-6">
							<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ticket-category">
								Pilih Kategori Tiket
							</label>
							<Select
								onValueChange={(value: string) => {
									setSelectedTicketId(value)
									setTicketQuantity(1) // Reset quantity when category changes
								}}
								value={selectedTicketId}
							>
								<SelectTrigger id="ticket-category" className="w-full">
									<SelectValue placeholder="Pilih kategori tiket" />
								</SelectTrigger>
								<SelectContent>
									{event.tickets.map((ticket) => (
										<SelectItem key={ticket.id} value={ticket.id!}>
											{ticket.ticketCategory} - Rp {ticket.price.toLocaleString('id-ID')}{' '}
											(Tersedia: {ticket.quota})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{selectedTicketId && (
							<div className="mb-6">
								<label className="block text-gray-700 text-sm font-bold mb-2">Jumlah tiket</label>
								<div className="flex items-center space-x-2">
									<Button
										variant="outline"
										size="icon"
										onClick={() => setTicketQuantity((prev) => Math.max(1, prev - 1))}
										disabled={ticketQuantity <= 1}
									>
										-
									</Button>
									<span className="text-lg font-semibold">{ticketQuantity}</span>
									<Button
										variant="outline"
										size="icon"
										onClick={() => {
											const selectedTicket = event.tickets.find(
												(ticket) => ticket.id === selectedTicketId
											)
											if (selectedTicket) {
												setTicketQuantity((prev) => Math.min(selectedTicket.quota, prev + 1))
											}
										}}
										disabled={
											ticketQuantity >=
												(event.tickets.find((ticket) => ticket.id === selectedTicketId)
													?.quota || 0) || ticketQuantity == 4
										}
									>
										+
									</Button>
									<span className="text-gray-500 text-sm">
										Max pembelian{' '}
										{event.tickets.find((ticket) => ticket.id === selectedTicketId)?.quota || 0}{' '}
										tiket
									</span>
								</div>
							</div>
						)}

						<div className="space-y-2 border-t border-gray-200 pt-4 mt-4">
							<div className="flex justify-between">
								<p className="text-gray-700">SubTotal</p>
								<p className="font-medium">Rp {calculateSubtotal().toLocaleString('id-ID')}</p>
							</div>
							<div className="flex justify-between">
								<p className="text-gray-700">Biaya Layanan</p>
								<p className="font-medium">Rp {calculateServiceFee().toLocaleString('id-ID')}</p>
							</div>
							<div className="flex justify-between">
								<p className="text-gray-700">PPN (11%)</p>
								<p className="font-medium">Rp {calculatePPN().toLocaleString('id-ID')}</p>
							</div>
						</div>

						<div className="border-t border-gray-200 pt-4 mt-4">
							<div className="flex justify-between font-bold text-lg">
								<span>Total</span>
								<span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
							</div>
						</div>

						<div className="mt-6 space-y-3">
							<Button
								className="w-full bg-purple-600 hover:bg-purple-700 text-white"
								onClick={handleBuyTicket}
								disabled={
									!selectedTicketId ||
									ticketQuantity === 0 ||
									userRole === 'ADMIN' ||
									(user && user.wallet >= totalPrice ? false : true)
								}
							>
								Beli Tiket Sekarang
							</Button>
							{user && user.wallet < totalPrice && (
								<p className="text-red-500 text-sm text-center">
									Saldo anda kurang. Silahkan Top Up Saldo
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Additional Info Section */}
				<div className="mt-8 bg-white rounded-lg shadow-md p-6">
					<div className="flex items-center">
						<div>
							<h1 className="font-bold text-lg">Deskripsi</h1>
							<div
								className="prose"
								dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description || '') }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EventDetailPage
