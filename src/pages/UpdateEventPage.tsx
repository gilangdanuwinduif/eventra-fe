import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { CalendarIcon, UploadCloud, AlertCircle, MapPin, List } from 'lucide-react'
import { useEventStore } from '../store/eventStore'
import { FormInput } from '../components/form-elements/FormInput'
import { FormTextarea } from '../components/form-elements/FormTextarea'
import { Label } from '../components/ui/label' // Re-import Label for date/time fields
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { DateInputWithIcon } from '../components/form-elements/DateInputWithIcon'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/axios' // Import the configured axios instance

interface Event {
	id: string
	title: string
	description: string
	location: string
	startDate: string
	endDate: string
	createdAt: string
	createdBy: string
	updatedAt: string
	updatedBy: string
	imageUrl: string
	capacity: number
	category: string
	status: string
}

export default function UpdateEventPage() {
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()
	const [eventName, setEventName] = useState('')
	const [category, setCategory] = useState('')
	const [capacity, setCapacity] = useState('')
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [endDate, setEndDate] = useState<Date | null>(null)
	// startTime and endTime will be handled by DatePicker directly within startDate/endDate
	const [venueName, setVenueName] = useState('')
	const [address, setAddress] = useState('')
	const [city, setCity] = useState('')
	const [province, setProvince] = useState('')
	const [description, setDescription] = useState('')
	// Removed importantInfo and ticketTypes states as they are not part of the API payload

	const { loading, error, success, message, createEvent, updateEvent, resetState } = useEventStore()
	const [isEditMode, setIsEditMode] = useState(false)

	useEffect(() => {
		if (id) {
			setIsEditMode(true)
			const fetchEvent = async () => {
				resetState() // Clear any previous success/error states
				try {
					const event = await useEventStore.getState().fetchEventById(id)
					if (event) {
						setEventName(event.title)
						setCategory(event.category)
						setCapacity(event.capacity.toString())
						setStartDate(new Date(event.startDate))
						setEndDate(new Date(event.endDate))
						const locationParts = event.location.split(', ')
						setVenueName(locationParts[0] || '')
						setAddress(locationParts[1] || '')
						setCity(locationParts[2] || '')
						setProvince(locationParts[3] || '')
						setDescription(event.description || '')
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
	}, [id, navigate, resetState]) // Add resetState to dependency array

	useEffect(() => {
		if (success) {
			const timer = setTimeout(() => {
				resetState()
				navigate('/dashboard/admin') // Redirect on success
			}, 3000) // Reset after 3 seconds and redirect
			return () => clearTimeout(timer)
		} else if (error) {
			const timer = setTimeout(() => {
				resetState()
			}, 5000) // Reset after 5 seconds
			return () => clearTimeout(timer)
		}
	}, [success, error, resetState, navigate])

	const handleSaveEvent = async () => {
		const formattedStartDate = startDate ? startDate.toISOString() : ''
		const formattedEndDate = endDate ? endDate.toISOString() : ''

		const eventPayload = {
			title: eventName,
			description: description || null,
			location: `${venueName}, ${address}, ${city}, ${province}`,
			startDate: formattedStartDate,
			endDate: formattedEndDate,
			imageUrl: 'https://picsum.photos/seed/event1/800/600', // Placeholder
			capacity: parseInt(capacity),
			category: category,
			status: 'PLANNED' // Assuming status remains PLANNED for now
		}

		if (isEditMode && id) {
			await updateEvent(id, eventPayload)
		} else {
			await createEvent(eventPayload)
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
					{error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">Error: {error}</div>}
					{success && (
						<div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">Success: {message}</div>
					)}

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
							<FormInput
								id="capacity"
								label="Kapasitas"
								type="number"
								placeholder="123"
								value={capacity}
								onChange={(e) => setCapacity(e.target.value)}
								required
								onClear={() => setCapacity('')}
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
									{/* CalendarIcon is now part of DateInputWithIcon */}
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
									{/* CalendarIcon is now part of DateInputWithIcon */}
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
						<div className="mb-8 bg-purple-50 rounded-lg shadow-md">
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
									onChange={(e) => setDescription(e.target.value)}
									required
									onClear={() => setDescription('')}
								/>
							</div>
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
