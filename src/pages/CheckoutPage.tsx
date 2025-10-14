import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useEventDetailStore from '../store/eventDetailStore'
import useAuthStore from '../store/authStore' // Import auth store
import axios from '../lib/axios' // Assuming axios is configured for API calls
import ValidatedInput from '../components/form-elements/ValidatedInput'
import { useToast } from '../hooks/useToast'

interface BuyerInfo {
	nik: string
	fullName: string
	email: string
	nikValid: boolean
	emailValid: boolean
	fullNameValid: boolean
}

const CheckoutPage: React.FC = () => {
	// Extract event ID from URL
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()
	const { event, loading, error, fetchEventDetail, ticketQuantity, ticketCategoryId } = useEventDetailStore()
	const { showToast } = useToast()
	const { user, token, refetchUser } = useAuthStore() // Get user from auth store
	const [buyerInfo, setBuyerInfo] = useState<BuyerInfo[]>([])
	const [agreeToTerms, setAgreeToTerms] = useState(false)

	useEffect(() => {
		if (id) {
			fetchEventDetail(id)
		}
	}, [id, fetchEventDetail])

	useEffect(() => {
		// Initialize buyerInfo array based on ticketQuantity
		setBuyerInfo(
			Array.from({ length: ticketQuantity }, () => ({
				nik: '',
				fullName: '',
				email: '',
				nikValid: false,
				emailValid: false,
				fullNameValid: false
			}))
		)
	}, [ticketQuantity])

	const handleBuyerInfoChange = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>,
		isValid: boolean,
		validationType: 'nik' | 'email' | 'text'
	) => {
		const { name, value } = e.target
		setBuyerInfo((prev) =>
			prev.map((info, i) =>
				i === index
					? {
							...info,
							[name]: value,
							[`${validationType}Valid`]: isValid
						}
					: info
			)
		)
	}

	const handleCheckout = async () => {
		if (!agreeToTerms) {
			showToast('You must agree to the Terms & Conditions and Privacy Policy.', 'error')
			return
		}
		if (!event) {
			showToast('Event data not loaded.', 'error')
			return
		}

		// Validate unique NIK and Email
		const nicks = buyerInfo.map((info) => info.nik)
		const emails = buyerInfo.map((info) => info.email)

		const hasDuplicateNik = new Set(nicks).size !== nicks.length
		const hasDuplicateEmail = new Set(emails).size !== emails.length

		if (hasDuplicateNik) {
			showToast('NIK tidak boleh sama. Setiap NIK harus unik untuk setiap pembeli.', 'error')
			return
		}

		if (hasDuplicateEmail) {
			showToast('Emails tidak boleh sama. Setiap email harus unik untuk setiap pembeli.', 'error')
			return
		}

		if (!user || !user.id) {
			showToast('Anda harus login untuk melakukan checkout.', 'error')
			return
		}

		try {
			const payload = {
				userId: user.id,
				eventId: event.id,
				totalPrice: calculateTotal(),
				ticketId: ticketCategoryId,
				orderDetails: buyerInfo.map((info) => ({
					nik: info.nik,
					fullName: info.fullName,
					email: info.email
				}))
			}

			const response = await axios.post('/orders', payload, {
				headers: { Authorization: `Bearer ${token}` }
			})
			if (response.data.success) {
				showToast('Checkout successful!', 'success')
				if (user && token) {
					await refetchUser(user.id, token)
				}
				// Redirect to a success page or update UI
				navigate(`/`)
			} else {
				showToast(`Checkout failed: ${response.data.message}`, 'error')
			}
		} catch (err) {
			if (err instanceof Error) {
				showToast(`Checkout error: ${err.message}`, 'error')
			} else {
				showToast('An unknown error occurred during checkout.', 'error')
			}
		}
	}

	const calculateSubtotal = () => {
		// Assuming one ticket type for simplicity, or the first ticket in the array
		return event && event.tickets.length > 0 && ticketCategoryId
			? (event.tickets.find((ticket) => ticket.id === ticketCategoryId)?.price || 0) * ticketQuantity || 0
			: 0
	}

	const calculateServiceFee = () => {
		return 10000 // Example fee
	}

	const calculatePPN = () => {
		const subtotal = calculateSubtotal()
		const serviceFee = calculateServiceFee()
		return (subtotal + serviceFee) * 0.11 // 11% PPN
	}

	const calculateTotal = () => {
		return calculateSubtotal() + calculateServiceFee() + calculatePPN()
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-[#d1c4e9] py-[100px] text-[#4a148c] flex flex-col justify-center items-center">
				<p className="text-lg">Loading event details...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen bg-[#d1c4e9] py-[100px] text-[#4a148c] flex flex-col justify-center items-center">
				<p className="text-lg text-red-500">Error: {error}</p>
			</div>
		)
	}

	if (!event) {
		return (
			<div className="min-h-screen bg-[#d1c4e9] py-[100px] text-[#4a148c] flex flex-col justify-center items-center">
				<p className="text-lg">Event not found or not loaded.</p>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-[#d1c4e9] py-[100px] text-[#4a148c]">
			<div className="container mx-auto px-4">
				{/* Progress Bar */}
				<div className="flex justify-between items-center mb-8 max-w-3xl mx-auto">
					<div className="text-center">
						<p className="font-bold text-lg text-[#673ab7]">Detail</p>
						<div className="h-1 w-full bg-[#8bc34a] mt-2"></div>
					</div>
					<div className="text-center">
						<p className="text-lg text-[#673ab7]">Pembayaran</p>
						<div className="h-1 w-full bg-gray-300 mt-2"></div>
					</div>
					<div className="text-center">
						<p className="text-lg text-[#673ab7]">Selesai</p>
						<div className="h-1 w-full bg-gray-300 mt-2"></div>
					</div>
				</div>

				<div className="flex flex-col lg:flex-row gap-8">
					{/* Left Section: Buyer Info & Payment Method */}
					<div className="lg:w-2/3 space-y-8">
						{/* Informasi Pembeli */}
						{Array.from({ length: ticketQuantity }).map((_, index) => (
							<div key={index} className="bg-white p-6 rounded-lg shadow-md mb-4">
								<h2 className="text-2xl font-bold mb-6 text-[#4a148c]">
									Informasi Pembeli Tiket {index + 1}
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<ValidatedInput
											validationType="nik"
											label="NIK"
											id={`nik-${index}`}
											name="nik"
											value={buyerInfo[index]?.nik || ''}
											onValueChange={(e, isValid) =>
												handleBuyerInfoChange(index, e, isValid, 'nik')
											}
											placeholder="317500505XXXXXX"
											required
										/>
									</div>
									<div>
										<ValidatedInput
											validationType="text"
											label="Nama Lengkap Sesuai KTP"
											id={`fullName-${index}`}
											name="fullName"
											value={buyerInfo[index]?.fullName || ''}
											onValueChange={(e, isValid) =>
												handleBuyerInfoChange(index, e, isValid, 'text')
											}
											placeholder="John Doe"
											required
										/>
									</div>
									<div>
										<ValidatedInput
											validationType="email"
											label="Email"
											id={`email-${index}`}
											name="email"
											value={buyerInfo[index]?.email || ''}
											onValueChange={(e, isValid) =>
												handleBuyerInfoChange(index, e, isValid, 'email')
											}
											placeholder="johndoe@example.com"
											required
										/>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Right Section: Ringkasan Pesanan */}
					<div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit">
						<h2 className="text-2xl font-bold mb-6 text-[#4a148c]">Ringkasan Pesanan</h2>
						<div className="flex items-center mb-6">
							<div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-12 w-12 text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div>
								<p className="font-bold text-lg">{event.title}</p>
								<p className="text-sm text-gray-600">
									{new Date(event.startDate).toLocaleDateString('id-ID', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
									,{' '}
									{new Date(event.startDate).toLocaleTimeString('id-ID', {
										hour: '2-digit',
										minute: '2-digit'
									})}
									, {event.location}
								</p>
								<p className="text-sm text-gray-600">
									Qty: {ticketQuantity}, Jenis Tiket:{' '}
									{event.tickets.length > 0 && event.tickets[0]
										? event.tickets[0].ticketCategory
										: 'N/A'}
								</p>
							</div>
						</div>

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

						<div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
							<p className="text-xl font-bold text-[#4a148c]">Total</p>
							<p className="text-xl font-bold text-[#4a148c]">
								Rp {calculateTotal().toLocaleString('id-ID')}
							</p>
						</div>

						<div className="flex items-center mt-6">
							<input
								type="checkbox"
								id="agreeTerms"
								checked={agreeToTerms}
								onChange={(e) => setAgreeToTerms(e.target.checked)}
								className="h-4 w-4 text-[#673ab7] focus:ring-[#673ab7] border-gray-300 rounded"
							/>
							<label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">
								Saya menyetujui{' '}
								<a href="#" className="text-[#673ab7] hover:underline">
									Syarat & Ketentuan
								</a>{' '}
								dan{' '}
								<a href="#" className="text-[#673ab7] hover:underline">
									Kebijakan Privasi
								</a>
							</label>
						</div>

						<button
							onClick={handleCheckout}
							className="w-full bg-[#673ab7] text-white py-3 rounded-md mt-6 hover:bg-[#5e35b1] transition-colors duration-200 font-semibold text-lg"
						>
							Bayar Sekarang
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CheckoutPage
