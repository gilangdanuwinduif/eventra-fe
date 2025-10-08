import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import axios from '../lib/axios'
import { jwtDecode } from 'jwt-decode'
import useAuthStore, { DecodedToken, User } from '../store/authStore'

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const loginResponse = await axios.post('/auth/login', { email, password })
			const token = loginResponse.data.data.token
			useAuthStore.getState().setToken(token) // Use the store's setToken function

			const decodedToken: { sub: string; iat: number; exp: number } = jwtDecode(token)
			const userId = decodedToken.sub // Assuming 'sub' contains the user ID or email

			const userResponse = await axios.get(`/users/${userId}`, {
				headers: { Authorization: `Bearer ${token}` }
			})

			const userRole = userResponse.data.data.role // Assuming the user role is in response.data.data.role
			const currentUser = useAuthStore.getState().user as DecodedToken // Cast to DecodedToken
			const fullUser: User = {
				sub: currentUser.sub,
				iat: currentUser.iat,
				exp: currentUser.exp,
				role: userRole,
				fullName: currentUser.fullName, // edit : by Gilang Diisi dari API
				profilePicture: currentUser.profilePicture // edit : by Gilang Diisi dari API
			}
			useAuthStore.getState().setUser(fullUser) // Update user role in store
			console.log(userRole, '<==== ini userRole')
			if (userRole == 'ADMIN') {
				console.log('masuk sini')
				navigate('/dashboard/admin')
			} else {
				console.log('masuk sini2')

				navigate('/') // Redirect to a default page for non-admin users
			}
		} catch (error) {
			console.error('Login failed:', error)
			alert('Login failed. Please check your credentials.')
		}
	}

	return (
		<div>
			<section className="bg-[#d1c4e9] py-[100px] px-[50px] text-center text-[#4a148c] min-h-[500px] flex flex-col justify-center items-center">
				<div className="flex max-w-screen-md bg-white rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden mx-auto">
					<div className="flex flex-col md:flex-row p-[50px] gap-[30px]">
						{/* Left Column - Welcome & Features */}
						<div className="flex-1 pr-[40px] border-r border-r-[#eee] md:border-b-0 pb-[30px] mb-[30px] md:pb-0 md:mb-0">
							<h2 className="text-[28px] font-bold text-[#4a148c] mb-[20px]">
								Selamat Datang <br />
								Kembali di EventraTech Eventra
							</h2>
							<p className="text-[#555]">
								Masuk ke akun Anda untuk mengelola event, pembelian tiket, dan pengaturan personal
								lainnya.
							</p>

							<ul className="list-none p-0 mt-[30px]">
								<li className="text-[16px] mb-[15px] text-[#555] flex items-start before:content-['\f058'] before:font-['Font_Awesome_6_Free'] before:font-black before:text-[#4CAF50] before:mr-[15px] before:text-[18px] before:leading-[1.5]">
									Akses ke semua event eksklusif
								</li>
								<li className="text-[16px] mb-[15px] text-[#555] flex items-start before:content-['\f058'] before:font-['Font_Awesome_6_Free'] before:font-black before:text-[#4CAF50] before:mr-[15px] before:text-[18px] before:leading-[1.5]">
									Kelola tiket dan pembelian Anda
								</li>
								<li className="text-[16px] mb-[15px] text-[#555] flex items-start before:content-['\f058'] before:font-['Font_Awesome_6_Free'] before:font-black before:text-[#4CAF50] before:mr-[15px] before:text-[18px] before:leading-[1.5]">
									Notifikasi untuk event favorit
								</li>
								<li className="text-[16px] mb-[15px] text-[#555] flex items-start before:content-['\f058'] before:font-['Font_Awesome_6_Free'] before:font-black before:text-[#4CAF50] before:mr-[15px] before:text-[18px] before:leading-[1.5]">
									Pembayaran yang aman dan cepat
								</li>
							</ul>
						</div>

						{/* Right Column - Login Form */}
						<div className="flex-1 pl-[40px]">
							<h3 className="text-[24px] font-semibold text-[#4a148c] mb-[5px]">Masuk ke Akun</h3>
							<p className="text-[#555]">Isi detail login Anda untuk mengelola akun EventTech Eventra</p>

							<form onSubmit={handleSubmit}>
								<div className="mb-[20px]">
									<label htmlFor="email" className="block font-medium mb-[8px] text-[#333]">
										Email atau Username
									</label>
									<input
										type="text"
										id="email"
										name="email"
										className="w-full p-[12px] border border-[#ccc] rounded-[6px] text-[16px]"
										placeholder="Masukkan email atau username"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>

								<div className="mb-[20px]">
									<label htmlFor="password" className="block font-medium mb-[8px] text-[#333]">
										Password
									</label>
									<div className="relative">
										<input
											type="password"
											id="password"
											name="password"
											className="w-full p-[12px] border border-[#ccc] rounded-[6px] text-[16px]"
											placeholder="Masukkan password"
											required
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
										<i className="far fa-eye-slash absolute right-[15px] top-1/2 -translate-y-1/2 text-[#999] cursor-pointer"></i>
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
									className="w-full p-[12px] bg-[#8c5dff] text-white border-none rounded-[6px] text-[18px] font-semibold cursor-pointer"
								>
									Masuk
								</Button>

								<p className="text-center mt-[30px] text-[14px] text-[#555]">Belum punya akun?</p>
								<Link
									to="/register"
									className="w-full p-[12px] bg-transparent text-[#8c5dff] border border-[#8c5dff] rounded-[6px] text-[18px] font-semibold cursor-pointer mt-[10px] inline-block text-center"
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
