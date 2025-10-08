import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CiMenuFries } from 'react-icons/ci'
import useAuthStore from '../../store/authStore'
import { Button } from '../ui/button'
import Text from '../custom-ui/text'
import SideNav from './side-nav'
import { ModeToggle } from '../mode-toggle'
import { motion } from 'framer-motion'
import UserProfileDropdown from '../custom-ui/UserProfileDropdown'

export default function Navbar() {
	const [scrollY, setScrollY] = useState(0)
	const [isOpen, setIsOpen] = useState(false)
	const { token, user, userRole, logout } = useAuthStore() //edit : by Gilang ambil data token dan logout dari authStore
	const navigate = useNavigate()

	const toggleOpen = () => {
		setIsOpen(!isOpen)
	}

	const handleLogout = () => {
		logout()
		navigate('/') // Redirect to login page after logout
	}

	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY)
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	const handleNavClick = () => {
		if (isOpen) {
			setIsOpen(false)
		}
	}

	// Edit : By Gilang sampe
	// Definisi Navigasi Berdasarkan Role
	// Navigasi yang tampil di tengah Navbar
	const commonNavLinks = [
		{ to: '/', label: 'Home' },
		{ to: '/events', label: 'Events' },
		{ to: '/about', label: 'About Us' },
		{ to: '/contact', label: 'Contact' }
	]

	// Navigasi khusus
	const roleNavLinks = []
	console.log('UserRole:', userRole)
	if (userRole === 'ADMIN') {
		roleNavLinks.push(
			{ to: '/dashboard/admin', label: 'Dashboard' },
			{ to: '/event', label: 'Event' },
			{ to: '/tiket', label: 'Tiket' },
			{ to: '/pengguna', label: 'Pengguna' },
			{ to: '/laporan', label: 'Laporan' },
			{ to: '/order', label: 'Order' }
		)
	}
	// else if (userRole === 'USER') {
	//     roleNavLinks.push({ to: '/my-tickets', label: 'Tiket Saya' })
	// }

	let finalNavLinks = commonNavLinks
	if (userRole === 'ADMIN') {
		finalNavLinks = roleNavLinks
	} else {
		finalNavLinks = [...commonNavLinks]
	}

	return (
		<>
			<SideNav handleClose={toggleOpen} isOpen={isOpen} />
			<motion.nav
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ type: 'spring', stiffness: 300, damping: 30 }}
				className={`flex items-center justify-between px-4 md:px-8 w-full h-[80px] top-0 bg-blue-500/80 md:dark:border-none border-b dark:bg-blue-900/80 dark:border-b-gray-800 z-20 fixed backdrop-blur-md ${
					scrollY > 150 ? 'shadow-sm' : ''
				}`}
				onClick={handleNavClick}
			>
				{/* Logo */}
				<div className="flex items-center gap-8">
					<Link to="/">
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Text label="EventTech" className="text-xl font-bold text-white dark:text-white" />
						</motion.div>
					</Link>
				</div>

				{/* Desktop Navigation - Centered */}
				<div className="hidden md:flex items-center gap-6 mx-auto">
					{/* Tampilkan link yang sudah digabungkan dan difilter role */}
					{finalNavLinks.map((link) => (
						<motion.div key={link.to} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
							<Link
								to={link.to}
								className="text-sm font-medium text-white hover:text-even-tect-purple dark:text-white dark:hover:text-even-tect-purple transition-colors relative group"
							>
								{link.label}
								<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-even-tect-purple group-hover:w-full transition-all duration-300" />
							</Link>
						</motion.div>
					))}
				</div>

				{/* Auth/Profile & Mode Toggle */}
				<div className="flex items-center gap-4">
					<div className="hidden md:flex items-center gap-4">
						{/* 👇 Pengkondisian untuk Profil/Auth */}
						{token && user ? (
							// Tampilkan komponen dropdown profil jika sudah login
							<UserProfileDropdown />
						) : (
							// Tampilkan tombol Login/Signup jika belum login
							<>
								<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
									<Link
										to="/login"
										className="text-sm font-medium text-white hover:text-even-tect-purple dark:text-white dark:hover:text-even-tect-purple transition-colors"
									>
										Login
									</Link>
								</motion.div>
								<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
									<Link to="/register">
										<Button className="bg-even-tect-purple hover:bg-even-tect-purple/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
											Sign Up
										</Button>
									</Link>
								</motion.div>
							</>
						)}
					</div>
					{/* Tombol Menu untuk Mobile */}
					<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
						<CiMenuFries className="text-white text-2xl cursor-pointer md:hidden" onClick={toggleOpen} />
					</motion.div>
				</div>
			</motion.nav>
		</>
	)
}
