import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useEventDetailStore from '../store/eventDetailStore'
import axios from '../lib/axios' // Assuming axios is configured for API calls
import ValidatedInput from '../components/form-elements/ValidatedInput'

interface BuyerInfo {
	nik: string
	fullName: string
	email: string
	phoneNumber: string
	nikValid: boolean
	emailValid: boolean
	phoneNumberValid: boolean
	fullNameValid: boolean
}

const CheckoutPage: React.FC = () => {
	// Extract event ID from URL
	const { id } = useParams<{ id: string }>()
	const { event, loading, error, fetchEventDetail, ticketQuantity, ticketCategoryId } = useEventDetailStore()
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
				phoneNumber: '',
				nikValid: false,
				emailValid: false,
				phoneNumberValid: false,
				fullNameValid: false
			}))
		)
	}, [ticketQuantity])

	const handleBuyerInfoChange = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>,
		isValid: boolean,
		validationType: 'nik' | 'email' | 'phoneNumber' | 'text'
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
			alert('You must agree to the Terms & Conditions and Privacy Policy.')
			return
		}
		if (!event) {
			alert('Event data not loaded.')
			return
		}

		const allBuyerInfoValid = buyerInfo.every(
			(info) => info.nikValid && info.emailValid && info.phoneNumberValid && info.fullNameValid
		)

		if (!allBuyerInfoValid) {
			alert('Please ensure all buyer information is valid.')
			return
		}

		// Placeholder for actual checkout logic
		console.log('Initiating checkout with:', {
			eventId: event.id,
			buyerInfo: buyerInfo, // Now an array of buyer info
			totalAmount: calculateTotal(),
			paymentMethod: 'Bank BCA' // Hardcoded for now
		})

		try {
			// Example API call for checkout
			const response = await axios.post('/checkout', {
				eventId: event.id,
				buyerInfo: buyerInfo.map(({ nikValid, emailValid, phoneNumberValid, fullNameValid, ...rest }) => ({
					...rest,
					phoneNumber: `+62${rest.phoneNumber}` // Add +62 prefix for submission
				})), // Send only relevant data
				totalAmount: calculateTotal(),
				paymentMethod: 'Bank BCA'
			})
			if (response.data.success) {
				alert('Checkout successful!')
				// Redirect to a success page or update UI
			} else {
				alert(`Checkout failed: ${response.data.message}`)
			}
		} catch (err) {
			if (err instanceof Error) {
				alert(`Checkout error: ${err.message}`)
			} else {
				alert('An unknown error occurred during checkout.')
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
											placeholder="XXXXXXXXXXXXXXXX"
											required
										/>
									</div>
									<div>
										<ValidatedInput
											validationType="text"
											label="Nama Lengkap"
											id={`fullName-${index}`}
											name="fullName"
											value={buyerInfo[index]?.fullName || ''}
											onValueChange={(e, isValid) =>
												handleBuyerInfoChange(index, e, isValid, 'text')
											}
											placeholder="XXXXXXXXXXXXXXXX"
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
											placeholder="XXXXXXXXXXXXXXXX"
											required
										/>
									</div>
									<div>
										<ValidatedInput
											validationType="phoneNumber"
											label="Nomor Telepon"
											id={`phoneNumber-${index}`}
											name="phoneNumber"
											value={buyerInfo[index]?.phoneNumber || ''}
											onValueChange={(e, isValid) =>
												handleBuyerInfoChange(index, e, isValid, 'phoneNumber')
											}
											placeholder="81234567890"
											prefix="+62"
											required
										/>
									</div>
								</div>
							</div>
						))}

						{/* Metode Pembayaran */}
						<div className="bg-white p-6 rounded-lg shadow-md">
							<h2 className="text-2xl font-bold mb-6 text-[#4a148c] flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-7 w-7 mr-3 text-[#673ab7]"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M21 18H2V6h19V4H2v2h19v12zm0 2H2v-2h19v2zM2 10h19v2H2v-2zm0 4h19v2H2v-2z" />
								</svg>
								Metode Pembayaran
							</h2>
							<div className="border border-gray-200 rounded-md p-4 bg-gray-50">
								<p className="font-semibold text-lg mb-2">Transfer ke Rekening Berikut</p>
								<div className="flex justify-between items-center">
									<div>
										<p className="text-gray-800">Bank BCA</p>
										<p className="text-gray-600">VA_XXXXXXXXXXXX</p>
									</div>
									<p className="text-[#673ab7] font-bold text-xl">
										Rp {calculateTotal().toLocaleString('id-ID')}
									</p>
								</div>
							</div>
						</div>
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
