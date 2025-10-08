import React from 'react'
import Header from './Header' // Assuming Header.tsx is in the same directory
import Navbar from '../landing/Navbar' // Assuming Navbar.tsx is in src/components/landing

interface MainHeaderProps {
	role: 'ADMIN' | 'USER'
}

const MainHeader: React.FC<MainHeaderProps> = ({ role }) => {
	return <>{role === 'ADMIN' ? <Header /> : <Navbar />}</>
}

export default MainHeader
