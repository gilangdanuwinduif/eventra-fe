import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { CalendarIcon, UploadCloud, AlertCircle, MapPin, List } from 'lucide-react'
import useEventStore from '../store/eventStore'
import { FormInput } from '../components/form-elements/FormInput'
import { FormTextarea } from '../components/form-elements/FormTextarea'
import { Label } from '../components/ui/label' // Re-import Label for date/time fields
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { DateInputWithIcon } from '../components/form-elements/DateInputWithIcon'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import { Event } from '../interfaces/Event'
import { EventStatus } from '../enums/EventStatus'
import { Ticket } from '../interfaces/Ticket'

export default function UpdateEventPage() {
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()
	const [eventName, setEventName] = useState('')
	const [category, setCategory] = useState('')
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [endDate, setEndDate] = useState<Date | null>(null)
	// startTime and endTime will be handled by DatePicker directly within startDate/endDate
	const [venueName, setVenueName] = useState('')
	const [address, setAddress] = useState('')
	const [city, setCity] = useState('')
	const [province, setProvince] = useState('')
	const [description, setDescription] = useState('')
	const [tickets, setTickets] = useState([{ ticketCategory: '', price: 0, quota: 0 }]) // State for ticket types
	const { showToast } = useToast()

	const { loading, error, updateEvent, resetState, fetchEventById } = useEventStore((state) => ({
		loading: state.loading,
		error: state.error,
		updateEvent: state.updateEvent,
		resetState: state.resetState,
		fetchEventById: state.fetchEventById
	}))
	const [isEditMode, setIsEditMode] = useState(false)

	useEffect(() => {
		if (id) {
			setIsEditMode(true)
			const fetchEvent = async () => {
				resetState() // Clear any previous error states
				try {
					const event = await fetchEventById(id, showToast)
					if (event) {
						setEventName(event.title)
						setCategory(event.category)
						setStartDate(new Date(event.startDate))
						setEndDate(new Date(event.endDate))
						const locationParts = event.location.split(', ')
						setVenueName(locationParts[0] || '')
						setAddress(locationParts[1] || '')
						setCity(locationParts[2] || '')
						setProvince(locationParts[3] || '')
						setDescription(event.description || '')
						setTickets(
							event.tickets && event.tickets.length > 0
								? event.tickets.map((ticket) => ({
										ticketCategory: ticket.ticketCategory || '',
										price: ticket.price || 0,
										quota: ticket.quota || 0
									}))
								: [{ ticketCategory: '', price: 0, quota: 0 }]
						)
					} else {
						navigate('/dashboard/admin') // Redirect if event not found or error
					}
				} catch (err) {
					console.error('Failed to fetch event details:', err)
					navigate('/dashboard/admin') // Redirect if event not found or error
				}
			}
			fetchEvent()
		}
	}, [id, navigate, resetState, fetchEventById, showToast]) // Add fetchEventById and showToast to dependency array

	const handleTicketTypeChange = (index: number, field: string, value: string | number) => {
		const updatedTickets = [...tickets]
		updatedTickets[index] = { ...updatedTickets[index], [field]: value }
		setTickets(updatedTickets)
	}

	const addTicketType = () => {
		setTickets([...tickets, { ticketCategory: '', price: 0, quota: 0 }])
	}

	const removeTicketType = (indexToRemove: number) => {
		setTickets(tickets.filter((_, index) => index !== indexToRemove))
	}

	const handleSaveEvent = async () => {
		const formattedStartDate = startDate ? startDate.toISOString() : ''
		const formattedEndDate = endDate ? endDate.toISOString() : ''

		const eventPayload = {
			title: eventName,
			description: description,
			location: `${venueName}, ${address}, ${city}, ${province}`,
			startDate: formattedStartDate,
			endDate: formattedEndDate,
			imageUrl: 'https://picsum.photos/seed/event1/800/600', // Placeholder
			category: category,
			status: EventStatus.UPCOMING, // Assuming status remains UPCOMING for now
			tickets: tickets.map((ticket: Partial<Ticket>) => ({
				ticketCategory: ticket.ticketCategory,
				price: ticket.price,
				quota: ticket.quota
			}))
		}

		if (isEditMode && id) {
			await updateEvent(
				id,
				eventPayload as Omit<Event, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
				showToast
			)
			if (!loading && !error) {
				navigate('/dashboard/admin')
			}
		}
	}

	return (
		<>
			<section className="bg-[#d1c4e9] py-[100px] text-[#4a148c] min-h-[500px] flex flex-col justify-center items-center w-full">
				<div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-8">
					<h1 className="text-3xl font-bold mb-6 text-gray-900">
						{isEditMode ? 'Update Event' : 'Buat Event Baru'}
					</h1>

					{loading && <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">Loading...</div>}
					{/* Error and Success messages are now handled by global toast */}

					{/* Informasi Dasar */}
					<div className="mb-8 p-6 bg-purple-50 rounded-lg shadow-md">
						<div className="flex items-center mb-4">
							<span className="text-purple-700 mr-2">
								<AlertCircle className="h-6 w-6" />
							</span>
							<h2 className="text-xl font-semibold text-gray-800">Informasi Dasar</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormInput
								id="eventName"
								label="Judul Event"
								placeholder="Contoh : Playlist Festival"
								value={eventName}
								onChange={(e) => setEventName(e.target.value)}
								required
								onClear={() => setEventName('')}
							/>
							<FormInput
								id="category"
								label="Kategori"
								placeholder="Contoh : Playlist Festival"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								required
								onClear={() => setCategory('')}
							/>
						</div>
						<div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
							<UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
							<p className="mt-2 text-sm text-gray-600">
								Drag and drop an image here, or click to select
							</p>
							<Button className="mt-3 bg-purple-600 hover:bg-purple-700 text-white">Pilih Gambar</Button>
						</div>
					</div>

					{/* Tanggal & Waktu */}
					<div className="mb-8 p-6 bg-purple-50 rounded-lg shadow-md">
						<div className="flex items-center mb-4">
							<span className="text-purple-700 mr-2">
								<CalendarIcon className="h-6 w-6" />
							</span>
							<h2 className="text-xl font-semibold text-gray-800">Tanggal & Waktu</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<Label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
									Tanggal & Waktu Mulai <span className="text-red-500">*</span>
								</Label>
								<div className="relative">
									<DatePicker
										id="startDate"
										selected={startDate}
										onChange={(date: Date | null) => setStartDate(date)}
										showTimeSelect
										dateFormat="Pp"
										placeholderText="dd/mm/yyyy --:--"
										minDate={new Date()}
										customInput={<DateInputWithIcon />}
										className="w-full pr-10 border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
								</div>
							</div>
							<div>
								<Label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
									Tanggal & Waktu Selesai <span className="text-red-500">*</span>
								</Label>
								<div className="relative">
									<DatePicker
										id="endDate"
										selected={endDate}
										onChange={(date: Date | null) => setEndDate(date)}
										showTimeSelect
										dateFormat="Pp"
										placeholderText="dd/mm/yyyy --:--"
										minDate={startDate || new Date()} // End date cannot be before start date
										customInput={<DateInputWithIcon />}
										className="w-full pr-10 border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
								</div>
							</div>
						</div>

						{/* Lokasi */}
						<div className="mb-8 bg-purple-50 rounded-lg shadow-md">
							<div className="flex items-center mb-4">
								<span className="text-purple-700 mr-2">
									<MapPin className="h-6 w-6" />
								</span>
								<h2 className="text-xl font-semibold text-gray-800">Lokasi</h2>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormInput
									id="venueName"
									label="Nama Venue"
									placeholder="Contoh : JIEXPO Kemayoran"
									value={venueName}
									onChange={(e) => setVenueName(e.target.value)}
									required
									onClear={() => setVenueName('')}
								/>
								<FormInput
									id="address"
									label="Alamat"
									placeholder="Contoh : Jalan H. Benyamin Suaeb, Pademangan,"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									required
									onClear={() => setAddress('')}
								/>
								<FormInput
									id="city"
									label="Kota / Kabupaten"
									placeholder="Contoh : Jakarta Utara"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									required
									onClear={() => setCity('')}
								/>
								<FormInput
									id="province"
									label="Provinsi"
									placeholder="Contoh : DKI Jakarta"
									value={province}
									onChange={(e) => setProvince(e.target.value)}
									required
									onClear={() => setProvince('')}
								/>
							</div>
						</div>

						{/* Deskripsi / Highlight Acara & Informasi Penting */}
						<div className="mb-8 p-6 bg-purple-50 rounded-lg shadow-md">
							<div className="flex items-center mb-4">
								<span className="text-purple-700 mr-2">
									<List className="h-6 w-6" />
								</span>
								<h2 className="text-xl font-semibold text-gray-800">
									Deskripsi / Highlight Acara & Informasi Penting
								</h2>
							</div>
							<div className="mb-6">
								<FormTextarea
									id="description"
									label="Deskripsi / Highlight Acara"
									placeholder="Jelaskan secara singkat dan Menarik"
									value={description}
									onChange={setDescription}
									required
									onClear={() => setDescription('')}
								/>
							</div>
						</div>

						{/* Informasi Tiket */}
						<div className="mb-8 p-6 bg-purple-50 rounded-lg shadow-md">
							<div className="flex items-center mb-4">
								<span className="text-purple-700 mr-2">
									<List className="h-6 w-6" />{' '}
								</span>
								<h2 className="text-xl font-semibold text-gray-800">Informasi Tiket</h2>
							</div>
							{tickets.map((ticket, index) => (
								<div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-lg font-medium text-gray-700">Jenis Tiket #{index + 1}</h3>
										{tickets.length > 1 && (
											<Button
												type="button"
												variant="destructive"
												onClick={() => removeTicketType(index)}
												className="bg-red-500 hover:bg-red-600 text-white"
											>
												Hapus
											</Button>
										)}
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
										<FormInput
											id={`ticketCategory-${index}`}
											label="Kategori Tiket"
											placeholder="Contoh : Asik"
											value={ticket.ticketCategory}
											onChange={(e) =>
												handleTicketTypeChange(index, 'ticketCategory', e.target.value)
											}
											required
											onClear={() => handleTicketTypeChange(index, 'ticketCategory', '')}
										/>
										<FormInput
											id={`ticketPrice-${index}`}
											label="Harga"
											type="number"
											placeholder={'Rp. 0'}
											value={ticket.price}
											onChange={(e) =>
												handleTicketTypeChange(index, 'price', Number(e.target.value))
											}
											required
											onClear={() => handleTicketTypeChange(index, 'price', 0)}
										/>
										<FormInput
											id={`ticketQuota-${index}`}
											label="Kuota"
											type="number"
											placeholder={'0'}
											value={ticket.quota}
											onChange={(e) =>
												handleTicketTypeChange(index, 'quota', Number(e.target.value))
											}
											required
											onClear={() => handleTicketTypeChange(index, 'quota', 0)}
										/>
									</div>
								</div>
							))}
							<Button
								type="button"
								onClick={addTicketType}
								className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
							>
								+ Tambah Jenis Tiket
							</Button>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end gap-4">
						<Button
							type="button"
							onClick={handleSaveEvent}
							className="bg-purple-600 hover:bg-purple-700 text-white"
						>
							{isEditMode ? 'Update Event' : 'Publikasi Event'}
						</Button>
					</div>
				</div>
			</section>
		</>
	)
}
