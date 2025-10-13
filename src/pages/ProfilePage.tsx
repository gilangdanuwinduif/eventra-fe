import React, { useState, useEffect } from 'react'
import { User2, Lock, Ticket } from 'lucide-react'
import useAuthStore from '../store/authStore' // pastikan path ini sesuai struktur folder kamu

const DEFAULT_AVATAR_URL = 'https://placehold.co/80x80/7b5bf3/ffffff?text=U'

const ProfilePage: React.FC = () => {
	const { user, updateProfileInStore } = useAuthStore()

	// State form
	const [fullName, setFullName] = useState('')
	const [nik, setNik] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [gender, setGender] = useState<'Laki - Laki' | 'Perempuan' | string>('Laki - Laki')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	// Ambil data user dari store
	useEffect(() => {
		if (user) {
			setFullName(user.fullName || '')
			setNik(user.nik || '')
			setEmail(user.email || '')
			setPhone(user.phone || '')
			setGender(user.gender || 'Laki - Laki')
		}
	}, [user])

	// Simpan perubahan
	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)
		setSuccessMessage(null)

		try {
			const updatePayload = {
				fullName,
				nik,
				email,
				phone,
				gender
			}

			// TODO: nanti sambungkan ke API update profile-mu di sini
			await new Promise((resolve) => setTimeout(resolve, 1500)) // simulasi loading

			// Update di Zustand store
			updateProfileInStore(updatePayload)

			setSuccessMessage('Profil berhasil diperbarui!')
		} catch (err) {
			console.error(err)
			setError('Gagal memperbarui profil. Silakan coba lagi.')
		} finally {
			setIsLoading(false)
		}
	}

	const userAvatar = user?.profilePicture || DEFAULT_AVATAR_URL

	return (
		<div className="min-h-screen bg-[#f3f3ff] font-sans">
			<style>
				{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
        `}
			</style>

			<main className="flex flex-col md:flex-row gap-8 p-8 max-w-7xl mx-auto">
				{/* SIDEBAR */}
				<aside className="bg-white rounded-2xl shadow-lg p-6 w-full md:w-1/4 h-fit sticky top-8">
					<div className="flex flex-col items-center">
						<div className="bg-[#e9e3ff] w-20 h-20 rounded-full flex items-center justify-center mb-4 overflow-hidden">
							<img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" />
						</div>
						<h2 className="font-bold text-xl text-gray-800">{fullName || 'Nama Pengguna'}</h2>
						<p className="text-gray-500 text-sm mb-4">{email || 'email@example.com'}</p>

						<div className="flex items-center space-x-2 text-center bg-[#f3f3ff] p-3 rounded-xl w-full justify-center">
							<Ticket className="w-5 h-5 text-[#7b5bf3]" />
							<div>
								<p className="text-[#7b5bf3] font-bold text-2xl leading-none">
									{user?.wallet ?? 0} {/* Assuming 'tickets' was meant to be 'wallet' */}
								</p>
								<p className="text-gray-500 text-xs mt-1">Wallet Anda</p>
							</div>
						</div>
					</div>

					<hr className="my-6 border-gray-200" />

					<nav className="space-y-4 text-base">
						<a
							href="#"
							className="flex items-center text-[#7b5bf3] font-semibold p-2 bg-[#f3f3ff] rounded-lg"
						>
							<User2 className="w-5 h-5 mr-3" /> Informasi Pribadi
						</a>
						<a
							href="#"
							className="flex items-center text-gray-600 hover:text-[#7b5bf3] p-2 hover:bg-[#f3f3ff] rounded-lg transition duration-150"
						>
							<Lock className="w-5 h-5 mr-3" /> Keamanan
						</a>
					</nav>
				</aside>

				{/* FORM EDIT PROFIL */}
				<section className="bg-white rounded-2xl shadow-lg p-8 flex-1">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Edit Informasi Pribadi</h2>

					{error && (
						<div
							className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
							role="alert"
						>
							{error}
						</div>
					)}

					{successMessage && (
						<div
							className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
							role="alert"
						>
							{successMessage}
						</div>
					)}

					<form className="space-y-6" onSubmit={handleFormSubmit}>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* NIK */}
							<div>
								<label className="block text-sm font-medium mb-1 text-gray-700">NIK</label>
								<input
									type="text"
									placeholder="Nomor Induk Kependudukan"
									className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7b5bf3] focus:outline-none transition"
									value={nik}
									onChange={(e) => setNik(e.target.value)}
									disabled={isLoading}
								/>
								<p className="text-xs text-gray-500 mt-1">NIK hanya bisa diubah oleh Admin.</p>
							</div>

							{/* Nama */}
							<div>
								<label className="block text-sm font-medium mb-1 text-gray-700">Nama</label>
								<input
									type="text"
									placeholder="Nama Sesuai NIK"
									className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7b5bf3] focus:outline-none transition"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									disabled={isLoading}
								/>
							</div>

							{/* Email */}
							<div>
								<label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
								<input
									type="email"
									className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-[#7b5bf3] focus:outline-none transition"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled
								/>
								<p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah.</p>
							</div>

							{/* Nomor Telepon */}
							<div>
								<label className="block text-sm font-medium mb-1 text-gray-700">Nomor Telepon</label>
								<input
									type="text"
									className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7b5bf3] focus:outline-none transition"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									disabled={isLoading}
								/>
							</div>

							{/* Gender */}
							<div>
								<label className="block text-sm font-medium mb-1 text-gray-700">Jenis Kelamin</label>
								<select
									className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7b5bf3] focus:outline-none transition cursor-pointer"
									value={gender}
									onChange={(e) => setGender(e.target.value)}
									disabled={isLoading}
								>
									<option value="Laki - Laki">Laki - Laki</option>
									<option value="Perempuan">Perempuan</option>
								</select>
							</div>
						</div>

						{/* Tombol Simpan */}
						<div className="pt-4">
							<button
								type="submit"
								className="w-full bg-[#7b5bf3] hover:bg-[#6a4ae0] text-white py-3 rounded-xl font-semibold text-lg transition duration-200 disabled:bg-gray-400 flex items-center justify-center shadow-lg hover:shadow-xl"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<svg
											className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                        5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 
                        3 7.938l3-2.647z"
											></path>
										</svg>
										Menyimpan...
									</>
								) : (
									'Simpan Perubahan'
								)}
							</button>
						</div>
					</form>
				</section>
			</main>
		</div>
	)
}

export default ProfilePage
