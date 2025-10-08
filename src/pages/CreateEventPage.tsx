import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import {
	CalendarIcon,
	ClockIcon,
	UploadCloud,
	Plus,
	X,
	AlertCircle,
	MapPin,
	List,
	Ticket,
	Bookmark
} from 'lucide-react'

interface TicketType {
	id: number
	name: string
	price: number
	quantity: number
	purchaseLimit: number
	importantInfo: string
}

export default function CreateEventPage() {
	const [eventName, setEventName] = useState('')
	const [category, setCategory] = useState('')
	const [capacity, setCapacity] = useState('')
	const [startDate, setStartDate] = useState('')
	const [startTime, setStartTime] = useState('')
	const [endDate, setEndDate] = useState('')
	const [endTime, setEndTime] = useState('')
	const [venueName, setVenueName] = useState('')
	const [address, setAddress] = useState('')
	const [city, setCity] = useState('')
	const [province, setProvince] = useState('')
	const [description, setDescription] = useState('')
	const [importantInfo, setImportantInfo] = useState('')
	const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
		{ id: 1, name: '', price: 0, quantity: 0, purchaseLimit: 0, importantInfo: '' }
	])

	const handleAddTicketType = () => {
		setTicketTypes([
			...ticketTypes,
			{ id: ticketTypes.length + 1, name: '', price: 0, quantity: 0, purchaseLimit: 0, importantInfo: '' }
		])
	}

	const handleRemoveTicketType = (id: number) => {
		setTicketTypes(ticketTypes.filter((ticket) => ticket.id !== id))
	}

	const handleTicketChange = (id: number, field: keyof TicketType, value: string | number) => {
		setTicketTypes(ticketTypes.map((ticket) => (ticket.id === id ? { ...ticket, [field]: value } : ticket)))
	}

	const handleSaveDraft = () => {
		// Implement save draft logic
		console.log('Save Draft', {
			eventName,
			category,
			capacity,
			startDate,
			startTime,
			endDate,
			endTime,
			venueName,
			address,
			city,
			province,
			description,
			importantInfo,
			ticketTypes
		})
	}

	const handlePublishEvent = () => {
		// Implement publish event logic
		console.log('Publish Event', {
			eventName,
			category,
			capacity,
			startDate,
			startTime,
			endDate,
			endTime,
			venueName,
			address,
			city,
			province,
			description,
			importantInfo,
			ticketTypes
		})
	}

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
			<div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
				<h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Buat Event Baru</h1>

				{/* Informasi Dasar */}
				<div className="mb-8 p-6 bg-purple-50 dark:bg-purple-950 rounded-lg">
					<div className="flex items-center mb-4">
						<span className="text-purple-700 dark:text-purple-300 mr-2">
							<AlertCircle className="h-6 w-6" />
						</span>
						<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Informasi Dasar</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<Label
								htmlFor="eventName"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Judul Event <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Input
									id="eventName"
									type="text"
									placeholder="Contoh : Playlist Festival"
									value={eventName}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventName(e.target.value)}
									className="w-full pr-10"
								/>
								{eventName && (
									<X
										className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
										onClick={() => setEventName('')}
									/>
								)}
							</div>
						</div>
						<div>
							<Label
								htmlFor="category"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Kategori <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Input
									id="category"
									type="text"
									placeholder="Contoh : Playlist Festival"
									value={category}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
									className="w-full pr-10"
								/>
								{category && (
									<X
										className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
										onClick={() => setCategory('')}
									/>
								)}
							</div>
						</div>
						<div>
							<Label
								htmlFor="capacity"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Kapasitas <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Input
									id="capacity"
									type="number"
									placeholder="123"
									value={capacity}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCapacity(e.target.value)}
									className="w-full pr-10"
								/>
								{capacity && (
									<X
										className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
										onClick={() => setCapacity('')}
									/>
								)}
							</div>
						</div>
					</div>
					<div className="mt-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
						<UploadCloud className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							Drag and drop an image here, or click to select
						</p>
						<Button className="mt-3 bg-purple-600 hover:bg-purple-700 text-white">Pilih Gambar</Button>
					</div>
				</div>

				{/* Tanggal & Waktu */}
				<div className="mb-8 p-6 bg-purple-50 dark:bg-purple-950 rounded-lg">
					<div className="flex items-center mb-4">
						<span className="text-purple-700 dark:text-purple-300 mr-2">
							<CalendarIcon className="h-6 w-6" />
						</span>
						<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Tanggal & Waktu</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<Label
								htmlFor="startDate"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Tanggal Mulai <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Input
									id="startDate"
									type="text"
									placeholder="dd/mm/yyyy"
									value={startDate}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
									className="w-full pr-10"
								/>
								<CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
							</div>
						</div>
						<div>
							<Label
								htmlFor="endDate"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Tanggal Selesai <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Input
									id="endDate"
									type="text"
									placeholder="dd/mm/yyyy"
									value={endDate}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
									className="w-full pr-10"
								/>
								<CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
							</div>
						</div>
						<div>
							<Label
								htmlFor="startTime"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Waktu Mulai <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Input
									id="startTime"
									type="text"
									placeholder="--:--"
									value={startTime}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
									className="w-full pr-10"
								/>
								<ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
							</div>
						</div>
						<div>
							<Label
								htmlFor="endTime"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Waktu Selesai <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Input
									id="endTime"
									type="text"
									placeholder="--:--"
									value={endTime}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
									className="w-full pr-10"
								/>
								<ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
							</div>
						</div>
					</div>
				</div>

				{/* Lokasi */}
				<div className="mb-8 p-6 bg-purple-50 dark:bg-purple-950 rounded-lg">
					<div className="flex items-center mb-4">
						<span className="text-purple-700 dark:text-purple-300 mr-2">
							<MapPin className="h-6 w-6" />
						</span>
						<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Lokasi</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<Label
								htmlFor="venueName"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Nama Venue <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Input
									id="venueName"
									type="text"
									placeholder="Contoh : JIEXPO Kemayoran"
									value={venueName}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVenueName(e.target.value)}
									className="w-full pr-10"
								/>
								{venueName && (
									<X
										className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
										onClick={() => setVenueName('')}
									/>
								)}
							</div>
						</div>
						<div>
							<Label
								htmlFor="address"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Alamat <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Input
									id="address"
									type="text"
									placeholder="Contoh : Jalan H. Benyamin Suaeb, Pademangan,"
									value={address}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
									className="w-full pr-10"
								/>
								{address && (
									<X
										className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
										onClick={() => setAddress('')}
									/>
								)}
							</div>
						</div>
						<div>
							<Label
								htmlFor="city"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Kota / Kabupaten <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Input
									id="city"
									type="text"
									placeholder="Contoh : Jakarta Utara"
									value={city}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
									className="w-full pr-10"
								/>
								{city && (
									<X
										className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
										onClick={() => setCity('')}
									/>
								)}
							</div>
						</div>
						<div>
							<Label
								htmlFor="province"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Provinsi <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<Input
									id="province"
									type="text"
									placeholder="Contoh : DKI Jakarta"
									value={province}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProvince(e.target.value)}
									className="w-full pr-10"
								/>
								{province && (
									<X
										className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
										onClick={() => setProvince('')}
									/>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Deskripsi / Highlight Acara & Informasi Penting */}
				<div className="mb-8 p-6 bg-purple-50 dark:bg-purple-950 rounded-lg">
					<div className="flex items-center mb-4">
						<span className="text-purple-700 dark:text-purple-300 mr-2">
							<List className="h-6 w-6" />
						</span>
						<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
							Deskripsi / Highlight Acara & Informasi Penting
						</h2>
					</div>
					<div className="mb-6">
						<Label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Deskripsi / Highlight Acara <span className="text-red-500">*</span>
						</Label>
						<div className="relative">
							<Textarea
								id="description"
								placeholder="Jelaskan secara singkat dan Menarik"
								value={description}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
								className="w-full min-h-[100px] pr-10"
							/>
							{description && (
								<X
									className="absolute right-3 top-4 h-5 w-5 text-gray-400 cursor-pointer"
									onClick={() => setDescription('')}
								/>
							)}
						</div>
					</div>
					<div>
						<Label
							htmlFor="importantInfo"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Informasi Penting <span className="text-red-500">*</span>
						</Label>
						<div className="relative">
							<Textarea
								id="importantInfo"
								placeholder="Jelaskan secara singkat dan Menarik"
								value={importantInfo}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
									setImportantInfo(e.target.value)
								}
								className="w-full min-h-[100px] pr-10"
							/>
							{importantInfo && (
								<X
									className="absolute right-3 top-4 h-5 w-5 text-gray-400 cursor-pointer"
									onClick={() => setImportantInfo('')}
								/>
							)}
						</div>
					</div>
				</div>

				{/* Informasi Tiket */}
				<div className="mb-8 p-6 bg-purple-50 dark:bg-purple-950 rounded-lg">
					<div className="flex items-center mb-4">
						<span className="text-purple-700 dark:text-purple-300 mr-2">
							<Ticket className="h-6 w-6" />
						</span>
						<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Informasi Tiket</h2>
					</div>

					{ticketTypes.map((ticket) => (
						<div
							key={ticket.id}
							className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border-b pb-6 last:border-b-0 last:pb-0"
						>
							<div>
								<Label
									htmlFor={`ticketName-${ticket.id}`}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>
									Nama Tiket <span className="text-red-500">*</span>
								</Label>
								<div className="relative">
									<Input
										id={`ticketName-${ticket.id}`}
										type="text"
										placeholder="Contoh : Regular Tiket"
										value={ticket.name}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											handleTicketChange(ticket.id, 'name', e.target.value)
										}
										className="w-full pr-10"
									/>
									{ticket.name && (
										<X
											className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
											onClick={() => handleTicketChange(ticket.id, 'name', '')}
										/>
									)}
								</div>
							</div>
							<div>
								<Label
									htmlFor={`ticketPrice-${ticket.id}`}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>
									Harga <span className="text-red-500">*</span>
								</Label>
								<div className="relative">
									<Input
										id={`ticketPrice-${ticket.id}`}
										type="number"
										placeholder="0"
										value={ticket.price}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											handleTicketChange(ticket.id, 'price', parseFloat(e.target.value))
										}
										className="w-full pr-10"
									/>
									{ticket.price > 0 && (
										<X
											className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
											onClick={() => handleTicketChange(ticket.id, 'price', 0)}
										/>
									)}
								</div>
							</div>
							<div>
								<Label
									htmlFor={`ticketQuantity-${ticket.id}`}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>
									Jumlah <span className="text-red-500">*</span>
								</Label>
								<div className="relative">
									<Input
										id={`ticketQuantity-${ticket.id}`}
										type="number"
										placeholder="0"
										value={ticket.quantity}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											handleTicketChange(ticket.id, 'quantity', parseInt(e.target.value))
										}
										className="w-full pr-10"
									/>
									{ticket.quantity > 0 && (
										<X
											className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
											onClick={() => handleTicketChange(ticket.id, 'quantity', 0)}
										/>
									)}
								</div>
							</div>
							<div>
								<Label
									htmlFor={`purchaseLimit-${ticket.id}`}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>
									Batas Pembelian
								</Label>
								<div className="relative">
									<Input
										id={`purchaseLimit-${ticket.id}`}
										type="number"
										placeholder="Maksimal per Orang"
										value={ticket.purchaseLimit}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											handleTicketChange(ticket.id, 'purchaseLimit', parseInt(e.target.value))
										}
										className="w-full pr-10"
									/>
									{ticket.purchaseLimit > 0 && (
										<X
											className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
											onClick={() => handleTicketChange(ticket.id, 'purchaseLimit', 0)}
										/>
									)}
								</div>
							</div>
							<div className="md:col-span-2">
								<Label
									htmlFor={`ticketImportantInfo-${ticket.id}`}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
								>
									Informasi Penting
								</Label>
								<div className="relative">
									<Textarea
										id={`ticketImportantInfo-${ticket.id}`}
										placeholder="Yang di dapat pada tiket ini"
										value={ticket.importantInfo}
										onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
											handleTicketChange(ticket.id, 'importantInfo', e.target.value)
										}
										className="w-full min-h-[80px] pr-10"
									/>
									{ticket.importantInfo && (
										<X
											className="absolute right-3 top-4 h-5 w-5 text-gray-400 cursor-pointer"
											onClick={() => handleTicketChange(ticket.id, 'importantInfo', '')}
										/>
									)}
								</div>
							</div>
							{ticketTypes.length > 1 && (
								<div className="md:col-span-2 flex justify-end">
									<Button
										type="button"
										onClick={() => handleRemoveTicketType(ticket.id)}
										className="flex items-center bg-red-500 hover:bg-red-600 text-white"
									>
										<X className="h-4 w-4 mr-2" /> Hapus Tiket
									</Button>
								</div>
							)}
						</div>
					))}

					<Button
						type="button"
						onClick={handleAddTicketType}
						className="mt-4 flex items-center text-purple-600 border border-purple-600 hover:bg-purple-50 dark:text-purple-300 dark:border-purple-300 dark:hover:bg-purple-900"
					>
						<Plus className="h-4 w-4 mr-2" /> Tambah Jenis Tiket
					</Button>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end gap-4">
					<Button
						type="button"
						onClick={handleSaveDraft}
						className="border border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-300 dark:text-purple-300 dark:hover:bg-purple-900"
					>
						<Bookmark className="h-5 w-5 mr-2" />
						Simpan Draft
					</Button>
					<Button
						type="button"
						onClick={handlePublishEvent}
						className="bg-purple-600 hover:bg-purple-700 text-white"
					>
						Publikasi Event
					</Button>
				</div>
			</div>
		</div>
	)
}
