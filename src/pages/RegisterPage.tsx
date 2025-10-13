import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import ValidatedInput from '../components/form-elements/ValidatedInput'

interface RegisterFormData {
	nik: string
	nama: string
	email: string
	telepon: string
	password: string
	konfirmasi_password: string
	jenis_kelamin: string
	terms: boolean
	nikValid: boolean
	namaValid: boolean
	emailValid: boolean
	teleponValid: boolean
	passwordValid: boolean
	konfirmasi_passwordValid: boolean
}

const RegisterPage: React.FC = () => {
	const navigate = useNavigate()
	const [formData, setFormData] = useState<RegisterFormData>({
		nik: '',
		nama: '',
		email: '',
		telepon: '',
		password: '',
		konfirmasi_password: '',
		jenis_kelamin: '',
		terms: false,
		nikValid: false,
		namaValid: false,
		emailValid: false,
		teleponValid: false,
		passwordValid: false,
		konfirmasi_passwordValid: false
	})
	const [error, setError] = useState('')

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		isValid: boolean | null = null,
		validationType: 'nik' | 'email' | 'phoneNumber' | 'text' | 'password' | 'confirmPassword' | null = null
	) => {
		const { name, value, type, checked } = e.target

		setFormData((prevData) => {
			const newData: RegisterFormData = {
				...prevData,
				[name]: type === 'checkbox' ? checked : value
			}

			if (validationType) {
				// For ValidatedInput components
				if (isValid !== null) {
					if (name === 'nik') {
						newData.nikValid = isValid
					} else if (name === 'nama') {
						newData.namaValid = isValid
					} else if (name === 'email') {
						newData.emailValid = isValid
					} else if (name === 'phoneNumber') {
						newData.teleponValid = isValid
					} else if (name === 'password') {
						newData.passwordValid = isValid
					} else if (name === 'konfirmasi_password') {
						newData.konfirmasi_passwordValid = isValid
					}
				}
			} else if (name === 'terms') {
				// For the terms checkbox
				newData.terms = checked
			}

			// Special handling for password confirmation
			if (name === 'password' || name === 'konfirmasi_password') {
				const isPasswordMatch = newData.password === newData.konfirmasi_password
				newData.konfirmasi_passwordValid = isPasswordMatch && newData.passwordValid
			}

			return newData
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		// Manual validation for password match and terms
		if (formData.password !== formData.konfirmasi_password) {
			setError('Password dan konfirmasi password tidak cocok.')
			return
		}

		if (!formData.terms) {
			setError('Anda harus menyetujui Syarat & Ketentuan dan Kebijakan Privasi.')
			return
		}

		// Check all validated fields
		const allFieldsValid =
			formData.nikValid &&
			formData.namaValid &&
			formData.emailValid &&
			formData.teleponValid &&
			formData.passwordValid &&
			formData.konfirmasi_passwordValid

		if (!allFieldsValid) {
			setError('Harap lengkapi semua bidang dengan benar.')
			return
		}

		try {
			const response = await fetch('http://localhost:8080/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nik: formData.nik,
					nama: formData.nama,
					email: formData.email,
					telepon: `+62${formData.telepon}`, // Add +62 prefix for submission
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
		<div>
			<section className="bg-[#d1c4e9] py-[100px] px-[50px] text-center text-[#4a148c] flex flex-col justify-center items-center min-h-screen">
				<div className="w-[90%] max-w-[900px] bg-white rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden mx-auto">
					<div className="p-[40px]">
						<h2 className="text-[28px] font-bold text-[#4a148c] mb-[5px] text-center">Buat Akun Baru</h2>
						<p className="text-[14px] text-[#777] mb-[40px] text-center">
							Daftar sekarang untuk mengakses semua fitur EventTech Eventra
						</p>

						{error && <p className="text-red-500 text-center mb-[20px]">{error}</p>}

						<form
							onSubmit={handleSubmit}
							className="text-left grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[20px]"
						>
							<div className="mb-[10px]">
								<ValidatedInput
									validationType="nik"
									label="NIK"
									id="nik"
									name="nik"
									value={formData.nik}
									onValueChange={(e, isValid) => handleChange(e, isValid, 'nik')}
									placeholder="Masukkan NIK"
									required
								/>
							</div>

							<div className="mb-[10px]">
								<ValidatedInput
									validationType="text"
									label="Nama Sesuai NIK"
									id="nama"
									name="nama"
									value={formData.nama}
									onValueChange={(e, isValid) => handleChange(e, isValid, 'text')}
									placeholder="Masukkan nama sesuai NIK"
									required
								/>
							</div>

							<div className="mb-[10px]">
								<ValidatedInput
									validationType="email"
									label="Email"
									id="email"
									name="email"
									value={formData.email}
									onValueChange={(e, isValid) => handleChange(e, isValid, 'email')}
									placeholder="Masukkan alamat email"
									required
								/>
							</div>

							<div className="mb-[10px]">
								<ValidatedInput
									validationType="phoneNumber"
									label="Nomor Telepon"
									id="telepon"
									name="telepon"
									value={formData.telepon}
									onValueChange={(e, isValid) => handleChange(e, isValid, 'phoneNumber')}
									placeholder="8123781263"
									prefix="+62"
									required
								/>
							</div>

							<div className="mb-[10px] relative">
								<ValidatedInput
									validationType="text" // Using 'text' as a placeholder for password validation
									label="Password"
									id="password"
									name="password"
									type="password"
									value={formData.password}
									onValueChange={(e, isValid) => handleChange(e, isValid, 'password')}
									placeholder="Masukkan password"
									required
								/>
							</div>

							<div className="mb-[10px] relative">
								<ValidatedInput
									validationType="text" // Using 'text' as a placeholder for password validation
									label="Konfirmasi Password"
									id="konfirmasi_password"
									name="konfirmasi_password"
									type="password"
									value={formData.konfirmasi_password}
									onValueChange={(e, isValid) => handleChange(e, isValid, 'text')}
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
											onChange={(e) => handleChange(e)}
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
											onChange={(e) => handleChange(e)}
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
									onChange={(e) => handleChange(e)}
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
			</section>
		</div>
	)
}

export default RegisterPage
