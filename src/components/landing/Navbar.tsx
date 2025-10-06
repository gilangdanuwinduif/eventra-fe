import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CiMenuFries } from 'react-icons/ci'
import { Button } from '../ui/button'
import Text from '../custom-ui/text'
import SideNav from './side-nav'
import { ModeToggle } from '../mode-toggle'
import { motion } from 'framer-motion'

export default function Navbar() {
	const [scrollY, setScrollY] = useState(0)
	const [isOpen, setIsOpen] = useState(false)

	const toggleOpen = () => {
		setIsOpen(!isOpen)
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

	const navLinks = [
		{ to: '/', label: 'Home' }, // Changed from /features to /
		{ to: '/events', label: 'Events' }, // Added Events
		{ to: '/about', label: 'About Us' }, // Added About Us
		{ to: '/contact', label: 'Contact' } // Added Contact
	]

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
					{navLinks.map((link) => (
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

				{/* Auth Buttons */}
				<div className="flex items-center gap-4">
					<div className="hidden md:flex items-center gap-4">
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
					</div>

					{/* <ModeToggle />
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <CiMenuFries
              onClick={toggleOpen}
              className="h-6 w-6 md:hidden text-gray-600 dark:text-gray-400 cursor-pointer hover:text-even-tect-purple dark:hover:text-even-tect-purple transition-colors"
            />
          </motion.div> */}
				</div>
			</motion.nav>
		</>
	)
}
