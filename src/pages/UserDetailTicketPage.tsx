import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ValidatedInput from '../components/form-elements/ValidatedInput'
import axios from '../lib/axios'
import useAuthStore from '../store/authStore'
import LoadingSpinner from '../components/custom-ui/LoadingSpinner'

import { BuyerInfo } from '../interfaces/BuyerInfo'
import { OrderDetail } from '../interfaces/OrderDetail'
import { Order } from '../interfaces/Order'
import { UserEventOrderItem } from '../interfaces/UserEventOrderItem'

const UserDetailTicketPage: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const { user, token } = useAuthStore()
	const [order, setOrder] = useState<Order | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [buyerInfo, setBuyerInfo] = useState<BuyerInfo[]>([])

	useEffect(() => {
		const fetchOrderDetail = async () => {
			if (!id || !token || !user?.id) {
				setLoading(false)
				setError('Missing order ID, user ID, or authentication token.')
				return
			}
			try {
				setLoading(true)
				const response = await axios.get(`/users/${user.id}/events?orderDetails=true`, {
					headers: { Authorization: `Bearer ${token}` }
				})

				if (response.data.success) {
					const allOrders = response.data.data.content
					const targetOrderData = allOrders.find((item: UserEventOrderItem) => item.order.id === id)

					if (targetOrderData) {
						// Reconstruct the order object to match the existing state structure
						const reconstructedOrder = {
							...targetOrderData.order,
							event: targetOrderData.event,
							orderDetails: targetOrderData.orderDetails
						}
						setOrder(reconstructedOrder)
						setBuyerInfo(
							targetOrderData.orderDetails.map((detail: OrderDetail) => ({
								nik: detail.nik,
								fullName: detail.fullName,
								email: detail.email
							}))
						)
					} else {
						setError('Order not found.')
					}
				} else {
					setError(response.data.message || 'Failed to fetch order details.')
				}
			} catch (err) {
				setError('An error occurred while fetching order details.')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchOrderDetail()
	}, [id, token, user])

	if (loading) {
		return (
			<div className="min-h-screen bg-[#d1c4e9] py-[100px] text-[#4a148c] flex flex-col justify-center items-center">
				<LoadingSpinner />
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

	if (!order) {
		return (
			<div className="min-h-screen bg-[#d1c4e9] py-[100px] text-[#4a148c] flex flex-col justify-center items-center">
				<p className="text-lg">Order not found or not loaded.</p>
			</div>
		)
	}

	// Since we don't have ticket details in the order object, we make some assumptions
	const calculateSubtotal = () => {
		// This is an approximation. The actual subtotal might be different.
		return order.totalPrice / 1.11 - 10000
	}

	const calculateServiceFee = () => {
		return 10000 // Example fee
	}

	const calculatePPN = () => {
		const subtotal = calculateSubtotal()
		const serviceFee = calculateServiceFee()
		return (subtotal + serviceFee) * 0.11 // 11% PPN
	}

	return (
		<div className="min-h-screen bg-[#d1c4e9] py-[100px] text-[#4a148c]">
			<div className="container mx-auto px-4">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Left Section: Buyer Info */}
					<div className="lg:w-2/3 space-y-8">
						{buyerInfo.map((info, index) => (
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
											value={info.nik}
											onValueChange={() => {}}
											placeholder="317500505XXXXXX"
											required
											disabled
										/>
									</div>
									<div>
										<ValidatedInput
											validationType="fullName"
											label="Nama Lengkap Sesuai KTP"
											id={`fullName-${index}`}
											name="fullName"
											value={info.fullName}
											onValueChange={() => {}}
											placeholder="John Doe"
											required
											disabled
										/>
									</div>
									<div>
										<ValidatedInput
											validationType="email"
											label="Email"
											id={`email-${index}`}
											name="email"
											value={info.email}
											onValueChange={() => {}}
											placeholder="johndoe@example.com"
											required
											disabled
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
								<img
									src={order.event.imageUrl}
									alt={order.event.title}
									className="w-full h-full object-cover rounded-lg"
								/>
							</div>
							<div>
								<p className="font-bold text-lg">{order.event.title}</p>
								<p className="text-sm text-gray-600">
									{new Date(order.event.startDate).toLocaleDateString('id-ID', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
									,{' '}
									{new Date(order.event.startDate).toLocaleTimeString('id-ID', {
										hour: '2-digit',
										minute: '2-digit'
									})}
									, {order.event.location}
								</p>
								<p className="text-sm text-gray-600">Qty: {buyerInfo.length}</p>
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
								Rp {order.totalPrice.toLocaleString('id-ID')}
							</p>
						</div>
						<div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
							<p className="text-xl font-bold text-[#4a148c]">Status Pembayaran</p>
							<p className="text-xl font-bold text-[#4a148c]">{order.status}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserDetailTicketPage
