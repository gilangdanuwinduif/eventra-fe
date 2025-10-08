import React from 'react'
import { Link } from 'react-router-dom'
import { Bell, ChevronDown } from 'lucide-react' // Assuming lucide-react for icons

const Header: React.FC = () => {
	return (
		<header className="bg-purple-700 text-white p-4 flex items-center justify-between">
			{/* Left section: Logo and Brand */}
			<div className="flex items-center">
				{/* Placeholder for logo icon */}
				<div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-2">
					<img src="/src/logo.svg" alt="Eventra Logo" className="w-6 h-6" /> {/* Using existing logo.svg */}
				</div>
				<div>
					<h1 className="text-lg font-bold">EventTech</h1>
					<p className="text-sm">Eventra</p>
				</div>
			</div>

			{/* Middle section: Navigation Links */}
			<nav className="flex space-x-6">
				<Link to="/dashboard" className="hover:text-gray-300">
					Dashboard
				</Link>
				<Link to="/event" className="hover:text-gray-300">
					Event
				</Link>
				<Link to="/tiket" className="hover:text-gray-300">
					Tiket
				</Link>
				<Link to="/pengguna" className="hover:text-gray-300">
					Pengguna
				</Link>
				<Link to="/laporan" className="hover:text-gray-300">
					Laporan
				</Link>
				<Link to="/order" className="hover:text-gray-300">
					Order
				</Link>
			</nav>

			{/* Right section: Notification and User Profile */}
			<div className="flex items-center space-x-4">
				<Bell className="w-6 h-6 cursor-pointer hover:text-gray-300" />

				<div className="flex items-center space-x-2 cursor-pointer">
					<img
						src="https://via.placeholder.com/32" // Placeholder for user avatar
						alt="User Avatar"
						className="w-8 h-8 rounded-full"
					/>
					<div>
						<p className="font-semibold">Name</p>
						<p className="text-xs text-gray-200">Status User</p>
					</div>
					<ChevronDown className="w-4 h-4" />
				</div>
			</div>
		</header>
	)
}

export default Header
