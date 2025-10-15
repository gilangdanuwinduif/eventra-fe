import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CiMenuFries } from 'react-icons/ci'
import useAuthStore from '../../store/authStore'
import { useToast } from '../../hooks/useToast' // Import useToast
import { Button } from '../ui/button'
import Text from '../custom-ui/text'
import UserProfileDropdown from '../custom-ui/UserProfileDropdown'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export default function Navbar() {
	const [scrollY, setScrollY] = useState(0)
	const [isOpen, setIsOpen] = useState(false)
	const [showTopupModal, setShowTopupModal] = useState(false)
	const { token, user, topupAmount, setTopupAmount, topupWallet, logout } = useAuthStore()
	const { showToast } = useToast() // Initialize useToast

	const toggleOpen = () => {
		setIsOpen(!isOpen)
	}
	const handleTopup = async () => {
		if (user && token) {
			// Check if 'id' property exists in user
			const success = await topupWallet(user.id, topupAmount, token)
			if (success) {
				setShowTopupModal(false)
				showToast('Successfully top up wallet!', 'success')
			} else {
				showToast('Unable to top up wallet. Please try again. Or contact admin', 'error')
			}
		} else {
			showToast('Please Relogin.', 'error')
			logout()
		}
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
	if (user?.role === 'ADMIN') {
		roleNavLinks.push(
			{ to: '/', label: 'Dashboard User' },
			{ to: '/dashboard/admin', label: 'Dashboard' },
			{ to: '/dashboard/admin/users', label: 'User List' },
			{ to: '/laporan', label: 'Laporan' },
			{ to: '/order', label: 'Order' }
		)
	}
	if (user?.role === 'USER') {
		roleNavLinks.push({ to: '/user/order', label: 'Tiket Saya' })
	}

	let finalNavLinks = commonNavLinks
	if (user?.role === 'ADMIN') {
		finalNavLinks = roleNavLinks
	} else if (user?.role === 'USER') {
		finalNavLinks = [...commonNavLinks, ...roleNavLinks]
	} else {
		finalNavLinks = [...commonNavLinks]
	}

	return (
		<div className="my-20">
			<nav
				className={`flex items-center justify-between px-4 md:px-8 w-full h-[80px] top-0 bg-blue-500/80 md:border-none border-b z-20 fixed backdrop-blur-md ${
					scrollY > 150 ? 'shadow-sm' : ''
				}`}
				onClick={handleNavClick}
			>
				{/* Logo */}
				<div className="flex items-center gap-8">
					<Link to="/">
						<div>
							<Text label="EventTech" className="text-xl font-bold text-white" />
						</div>
					</Link>
				</div>

				{/* Desktop Navigation - Centered */}
				<div className="hidden md:flex items-center gap-6 mx-auto">
					{/* Tampilkan link yang sudah digabungkan dan difilter role */}
					{finalNavLinks.map((link) => (
						<div key={link.to}>
							<Link
								to={link.to}
								className="text-sm font-medium text-white hover:text-even-tect-purple transition-colors relative group"
							>
								{link.label}
								<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-even-tect-purple group-hover:w-full transition-all duration-300" />
							</Link>
						</div>
					))}
				</div>

				{/* Auth/Profile & Mode Toggle */}
				<div className="flex items-center gap-4">
					<div className="hidden md:flex items-center gap-4">
						{/* 👇 Pengkondisian untuk Profil/Auth */}
						{token && user ? (
							// Tampilkan komponen dropdown profil jika sudah login
							<>
								<Dialog open={showTopupModal} onOpenChange={setShowTopupModal}>
									<DialogTrigger asChild>
										<Button
											variant="ghost"
											className="text-sm font-medium text-white hover:text-even-tect-purple transition-colors"
										>
											Wallet: Rp{user?.wallet?.toLocaleString('id-ID') ?? 0}
										</Button>
									</DialogTrigger>
									<DialogContent className="bg-white sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Top Up Wallet</DialogTitle>
											<DialogDescription>
												Current Balance: Rp{user?.wallet?.toLocaleString('id-ID') ?? 0}
											</DialogDescription>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="grid grid-cols-4 items-center gap-4">
												<Label htmlFor="amount" className="text-right">
													Amount
												</Label>
												<Input
													id="amount"
													type="number"
													value={topupAmount}
													onChange={(e) => setTopupAmount(Number(e.target.value))}
													className="col-span-3"
												/>
											</div>
										</div>
										<DialogFooter>
											<Button
												className="bg-[#d1c4e9] text-[#4a148c] "
												type="button"
												onClick={handleTopup}
											>
												Top Up
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
								<UserProfileDropdown />
							</>
						) : (
							// Tampilkan tombol Login/Signup jika belum login
							<>
								<Link
									to="/login"
									className="text-sm font-medium text-white hover:text-even-tect-purple transition-colors"
								>
									Login
								</Link>
								<Link to="/register">
									<Button className="bg-even-tect-purple hover:bg-even-tect-purple/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
										Sign Up
									</Button>
								</Link>
							</>
						)}
					</div>
					{/* Tombol Menu untuk Mobile */}
					<CiMenuFries className="text-white text-2xl cursor-pointer md:hidden" onClick={toggleOpen} />
				</div>
			</nav>
		</div>
	)
}
