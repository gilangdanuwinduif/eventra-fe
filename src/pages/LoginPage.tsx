import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import axios from '../lib/axios'
import { jwtDecode } from 'jwt-decode'
import useAuthStore, { DecodedToken, User } from '../store/authStore'
import { useToast } from '../hooks/useToast'

const LoginPage: React.FC = () => {
	const { showToast } = useToast()
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const loginResponse = await axios.post('/auth/login', { email, password })
			const token = loginResponse.data.data.token
			useAuthStore.getState().setToken(token)

			const decodedToken: DecodedToken = jwtDecode(token)
			const userId = decodedToken.sub

			const userResponse = await axios.get(`/users/${userId}`, {
				headers: { Authorization: `Bearer ${token}` }
			})

			const userDetails = userResponse.data.data

			const fullUser: User = {
				sub: decodedToken.sub,
				iat: decodedToken.iat,
				exp: decodedToken.exp,
				role: userDetails.role,
				fullName: userDetails.fullName,
				profilePicture: userDetails.profilePicture || null,
				id: decodedToken.sub,
				email: userDetails.email,
				phone: userDetails.phone,
				createdAt: userDetails.createdAt,
				gender: userDetails.gender,
				nik: userDetails.nik,
				isRegistered: userDetails.isRegistered,
				wallet: userDetails.wallet
			}
			useAuthStore.getState().setUser(fullUser)

			if (userDetails.role === 'ADMIN') {
				navigate('/dashboard/admin')
			} else {
				navigate('/')
			}
		} catch (error) {
			console.error('Login failed:', error)
			showToast('Login failed. Please check your credentials.', 'error')
		}
	}

	return (
		<div>
			<section className="bg-[#d1c4e9] h-screen py-[100px] px-[50px] text-center text-[#4a148c] min-h-[500px] flex flex-col justify-center items-center">
				<div className="flex max-w-screen-md bg-white rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden mx-auto">
					<div className="flex flex-col md:flex-row p-[50px] gap-[30px]">
						{/* Left Column */}
						<div className="flex-1 pr-[40px] border-r border-r-[#eee] md:border-b-0 pb-[30px] mb-[30px] md:pb-0 md:mb-0">
							<h2 className="text-[28px] font-bold text-[#4a148c] mb-[20px]">
								Selamat Datang <br />
								Kembali di EventraTech Eventra
							</h2>
							<p className="text-[#555]">
								Masuk ke akun Anda untuk mengelola event, pembelian tiket, dan pengaturan personal
								lainnya.
							</p>
							<ul className="list-disc list-inside text-[#555] mt-[30px] text-left">
								<li>Akses ke semua event eksklusif</li>
								<li>Kelola tiket dan pembelian Anda</li>
								<li>Notifikasi untuk event favorit</li>
								<li>Pembayaran yang aman dan cepat</li>
							</ul>
						</div>

						{/* Right Column - Login Form */}
						<div className="flex-1 pl-[40px]">
							<h3 className="text-[24px] font-semibold text-[#4a148c] mb-[5px]">Masuk ke Akun</h3>
							<p className="text-[#555] mb-[20px]">
								Isi detail login Anda untuk mengelola akun EventTech Eventra
							</p>

							<form onSubmit={handleSubmit}>
								<div className="mb-[20px]">
									<label htmlFor="email" className="block font-medium mb-[8px] text-[#333]">
										Email atau Username
									</label>
									<input
										type="text"
										id="email"
										name="email"
										className="w-full p-[12px] border border-[#ccc] rounded-[6px] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#8c5dff]"
										placeholder="Masukkan email atau username"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>

								<div className="mb-[20px] relative">
									<label htmlFor="password" className="block font-medium mb-[8px] text-[#333]">
										Password
									</label>
									<div className="relative">
										<input
											type={showPassword ? 'text' : 'password'}
											id="password"
											name="password"
											className="w-full p-[12px] border border-[#ccc] rounded-[6px] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#8c5dff]"
											placeholder="Masukkan password"
											required
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
										{/* Tombol show/hide password */}
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-[15px] top-1/2 -translate-y-1/2 text-[#999] cursor-pointer"
										>
											<i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
										</button>
									</div>
								</div>

								<div className="flex justify-between items-center mb-[30px] text-[14px]">
									<label className="flex items-center">
										<input type="checkbox" name="remember" className="mr-[5px]" />
										Ingat saya
									</label>
									<a href="#" className="text-[#8c5dff] no-underline font-medium">
										Lupa Password?
									</a>
								</div>

								<Button
									type="submit"
									className="w-full p-[12px] bg-[#8c5dff] text-white border-none rounded-[6px] text-[18px] font-semibold cursor-pointer hover:bg-[#7a49ff] transition"
								>
									Masuk
								</Button>

								<p className="text-center mt-[30px] text-[14px] text-[#555]">Belum punya akun?</p>
								<Link
									to="/register"
									className="w-full p-[12px] bg-transparent text-[#8c5dff] border border-[#8c5dff] rounded-[6px] text-[18px] font-semibold cursor-pointer mt-[10px] inline-block text-center hover:bg-[#8c5dff] hover:text-white transition"
								>
									Daftar Sekarang
								</Link>
							</form>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

export default LoginPage
