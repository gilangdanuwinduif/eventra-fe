import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

// URL default jika pengguna belum memiliki foto profil
const DEFAULT_PROFILE_URL = 'https://via.placeholder.com/32'

export default function UserProfileDropdown() {
	// State untuk mengontrol status buka/tutup dropdown
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null) // Specify the type of the ref
	const { user, logout } = useAuthStore()
	const navigate = useNavigate()

	// Fungsi untuk menutup dropdown saat klik di luar area
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			// Explicitly type event as MouseEvent
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				// Cast event.target to Node
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [dropdownRef])

	const handleLogout = () => {
		logout()
		navigate('/')
	}

	if (!user) {
		return null
	}
	const userName = user.email || 'Pengguna'
	const initials = userName
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.substring(0, 2)

	const displayRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : 'User'

	const profileImageUrl = DEFAULT_PROFILE_URL

	return (
		// Gunakan ref untuk mendeteksi klik di luar
		<div className="relative" ref={dropdownRef}>
			{/* =======================================
               TRIGGER: Bagian yang Terlihat di Navbar
               ======================================= */}
			<div
				className="flex items-center gap-2 cursor-pointer p-2 rounded-full transition-colors hover:bg-blue-600/50"
				onClick={() => setIsOpen(!isOpen)} // Toggle Dropdown
			>
				{/* Avatar/Foto Kustom (Tailwind Murni) */}
				<div className="h-8 w-8 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center flex-shrink-0">
					{profileImageUrl !== DEFAULT_PROFILE_URL ? (
						<img src={profileImageUrl} alt={user.email} className="h-full w-full object-cover" />
					) : (
						<span className="text-sm font-medium text-white">{initials}</span>
					)}
				</div>

				{/* Nama dan Status */}
				<div className="flex flex-col items-start hidden sm:flex">
					<span className="text-sm font-semibold text-white truncate max-w-[120px]">{user.email}</span>
					<span className="text-xs text-blue-200">{displayRole}</span>
				</div>

				{/* Dropdown Icon */}
				<svg
					className={`h-4 w-4 text-white ml-1 hidden sm:block transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth="2"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</div>

			{/* =======================================
               CONTENT: Isi Dropdown Menu
               ======================================= */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-200 z-30 transform origin-top-right animate-fade-in">
					{/* Label Header */}
					<div className="px-4 py-3 border-b">
						<p className="font-bold text-gray-900">{user.email}</p>
						<p className="text-xs font-normal text-gray-500">{displayRole}</p>
					</div>

					{/* Menu Items */}
					<div className="py-1">
						{/* Opsi Role-Based */}
						{user.role === 'ADMIN' && (
							<Link
								to="/dashboard/admin"
								className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => setIsOpen(false)}
							>
								Dashboard Admin
							</Link>
						)}

						<Link
							to="/profile"
							className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							onClick={() => setIsOpen(false)}
						>
							Profil Saya
						</Link>

						<Link
							to="/settings"
							className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							onClick={() => setIsOpen(false)}
						>
							Pengaturan
						</Link>

						{/* Separator */}
						<div className="border-t border-gray-200 my-1"></div>

						{/* Logout */}
						<button
							onClick={handleLogout}
							className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-red-50"
						>
							Logout
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
