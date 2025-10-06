import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'

const RegisterPage: React.FC = () => {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		nik: '',
		nama: '',
		email: '',
		telepon: '',
		password: '',
		konfirmasi_password: '',
		jenis_kelamin: '',
		terms: false
	})
	const [error, setError] = useState('')

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target
		setFormData((prevData) => ({
			...prevData,
			[name]: type === 'checkbox' ? checked : value
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		if (formData.password !== formData.konfirmasi_password) {
			setError('Password dan konfirmasi password tidak cocok.')
			return
		}

		if (!formData.terms) {
			setError('Anda harus menyetujui Syarat & Ketentuan dan Kebijakan Privasi.')
			return
		}

		try {
			const response = await fetch('http://localhost:8081/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nik: formData.nik,
					nama: formData.nama,
					email: formData.email,
					telepon: formData.telepon,
					password: formData.password,
					jenis_kelamin: formData.jenis_kelamin
				})
			})

			const data = await response.json()

			if (response.ok) {
				alert('Registrasi berhasil! Silakan masuk.')
				navigate('/login')
			} else {
				setError(data.message || 'Registrasi gagal. Silakan coba lagi.')
			}
		} catch (err) {
			setError('Terjadi kesalahan jaringan. Silakan coba lagi nanti.')
		}
	}

	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-[#d1c4e9] h-screen py-[40px] px-[20px] pt-[90px]">
				<div className="w-[90%] max-w-[900px] bg-white rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden mx-auto">
					<div className="p-[40px]">
						<h2 className="text-[28px] font-bold text-[#4a148c] mb-[5px] text-center">Buat Akun Baru</h2>
						<p className="text-[14px] text-[#777] mb-[40px] text-center">
							Daftar sekarang untuk mengakses semua fitur EventTech Eventra
						</p>

						{error && <p className="text-red-500 text-center mb-[20px]">{error}</p>}

						<form
							onSubmit={handleSubmit}
							className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[20px]"
						>
							<div className="mb-[10px]">
								<label htmlFor="nik" className="block font-medium mb-[5px] text-[#333]">
									NIK
								</label>
								<input
									type="text"
									id="nik"
									name="nik"
									value={formData.nik}
									onChange={handleChange}
									className="w-full p-[12px] border border-[#ccc] rounded-[6px] text-[16px] placeholder-[#bbb]"
									placeholder="Masukkan NIK"
									required
								/>
							</div>

							<div className="mb-[10px]">
								<label htmlFor="nama" className="block font-medium mb-[5px] text-[#333]">
									Nama Sesuai NIK
								</label>
								<input
									type="text"
									id="nama"
									name="nama"
									value={formData.nama}
									onChange={handleChange}
									className="w-full p-[12px] border border-[#ccc] rounded-[6px] text-[16px] placeholder-[#bbb]"
									placeholder="Masukkan nama sesuai NIK"
									required
								/>
							</div>

							<div className="mb-[10px]">
								<label htmlFor="email" className="block font-medium mb-[5px] text-[#333]">
									Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className="w-full p-[12px] border border-[#ccc] rounded-[6px] text-[16px] placeholder-[#bbb]"
									placeholder="Masukkan alamat email"
									required
								/>
							</div>

							<div className="mb-[10px]">
								<label htmlFor="telepon" className="block font-medium mb-[5px] text-[#333]">
									Nomor Telepon
								</label>
								<input
									type="tel"
									id="telepon"
									name="telepon"
									value={formData.telepon}
									onChange={handleChange}
									className="w-full p-[12px] border border-[#ccc] rounded-[6px] text-[16px] placeholder-[#bbb]"
									placeholder="Contoh: 08123781263"
									required
								/>
							</div>

							<div className="mb-[10px] relative">
								<label htmlFor="password" className="block font-medium mb-[5px] text-[#333]">
									Password
								</label>
								<input
									type="password"
									id="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									className="w-full p-[12px] border border-[#ccc] rounded-[6px] text-[16px] placeholder-[#bbb]"
									placeholder="Masukkan password"
									required
								/>
							</div>

							<div className="mb-[10px] relative">
								<label htmlFor="konfirmasi_password" className="block font-medium mb-[5px] text-[#333]">
									Konfirmasi Password
								</label>
								<input
									type="password"
									id="konfirmasi_password"
									name="konfirmasi_password"
									value={formData.konfirmasi_password}
									onChange={handleChange}
									className="w-full p-[12px] border border-[#ccc] rounded-[6px] text-[16px] placeholder-[#bbb]"
									placeholder="Konfirmasi password"
									required
								/>
							</div>

							<div className="mb-[10px]">
								<label className="block font-medium mb-[5px] text-[#333]">Jenis Kelamin</label>
								<div className="flex items-center h-full pt-[10px] gap-[25px]">
									<label className="inline-flex items-center font-normal cursor-pointer">
										<input
											type="radio"
											name="jenis_kelamin"
											value="Laki-Laki"
											checked={formData.jenis_kelamin === 'Laki-Laki'}
											onChange={handleChange}
											className="mr-[8px] w-[16px] h-[16px]"
											required
										/>
										Laki-Laki
									</label>
									<label className="inline-flex items-center font-normal cursor-pointer">
										<input
											type="radio"
											name="jenis_kelamin"
											value="Perempuan"
											checked={formData.jenis_kelamin === 'Perempuan'}
											onChange={handleChange}
											className="mr-[8px] w-[16px] h-[16px]"
										/>
										Perempuan
									</label>
								</div>
							</div>

							<div className="md:col-span-1 p-t-[10px] md:pl-[20px]">
								<h4 className="text-red-500 text-[14px] font-semibold mb-[8px]">
									Password harus memenuhi:
								</h4>
								<ul className="list-none text-[13px] text-[#555]">
									<li className="mb-[4px] pl-[15px] relative before:content-['•'] before:absolute before:left-0 before:text-red-500">
										Minimal 8 karakter
									</li>
									<li className="mb-[4px] pl-[15px] relative before:content-['•'] before:absolute before:left-0 before:text-red-500">
										Mengandung huruf besar
									</li>
									<li className="mb-[4px] pl-[15px] relative before:content-['•'] before:absolute before:left-0 before:text-red-500">
										Mengandung angka
									</li>
									<li className="mb-[4px] pl-[15px] relative before:content-['•'] before:absolute before:left-0 before:text-red-500">
										Mengandung karakter khusus
									</li>
								</ul>
							</div>

							<div className="col-span-full mt-[20px] mb-[30px] text-[14px] text-[#555] flex items-center">
								<input
									type="checkbox"
									id="terms"
									name="terms"
									checked={formData.terms}
									onChange={handleChange}
									className="mr-[10px]"
									required
								/>
								<label htmlFor="terms">
									Saya menyetujui{' '}
									<a href="#" className="text-[#8c5dff] no-underline font-medium">
										Syarat & Ketentuan
									</a>{' '}
									dan{' '}
									<a href="#" className="text-[#8c5dff] no-underline font-medium">
										Kebijakan Privasi
									</a>{' '}
									EventTech Eventra
								</label>
							</div>

							<div className="col-span-full">
								<Button
									type="submit"
									className="w-full p-[12px] bg-[#8c5dff] text-white border-none rounded-[6px] text-[18px] font-semibold cursor-pointer"
								>
									Daftar Sekarang
								</Button>
							</div>
						</form>

						<div className="text-center mt-[30px]">
							<p className="text-[14px] text-[#555] mb-[10px]">Sudah punya akun?</p>
							<Link
								to="/login"
								className="w-full p-[12px] bg-transparent text-[#8c5dff] border border-[#8c5dff] rounded-[6px] text-[18px] font-semibold cursor-pointer inline-block"
							>
								Masuk ke Akun
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default RegisterPage
