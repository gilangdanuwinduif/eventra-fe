import React, { useState, useEffect } from 'react'
import { User2, Lock, Ticket } from 'lucide-react'
import useAuthStore from '../store/authStore' // pastikan path ini sesuai struktur folder kamu

// Asumsi: Anda memiliki fungsi API helper atau Axios instance
// Ganti dengan API helper Anda (misalnya, axios.create({ baseURL: '...' }))
const API_BASE_URL = 'http://localhost:8081/api' 

const DEFAULT_AVATAR_URL = 'https://placehold.co/80x80/7b5bf3/ffffff?text=U'

const ProfilePage: React.FC = () => {
    // Ambil user dan token dari store
    const { user, token, updateProfileInStore } = useAuthStore((state) => ({
        user: state.user,
        token: state.token, // Asumsi token disimpan di store
        updateProfileInStore: state.updateProfileInStore
    }))

    // State form
    const [fullName, setFullName] = useState('')
    const [nik, setNik] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [gender, setGender] = useState<'Laki - Laki' | 'Perempuan' | string>('Laki - Laki')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // --- FUNGSI UTAMA UNTUK SINKRONISASI DATA ---
    
    // 1. Ambil data user dari store dan inisialisasi state
    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '')
            setNik(user.nik || '')
            setEmail(user.email || '')
            
            // PENTING: Menghilangkan '+62' dari user.phone untuk tampilan di form
            const cleanPhone = user.phone ? user.phone.replace(/^\+62/, '') : ''
            setPhone(cleanPhone)
            
            // PENTING: Mapping gender dari nilai backend ('male'/'female') ke label FE
            const mappedGender = user.gender === 'male' ? 'Laki - Laki' : 
                                 user.gender === 'female' ? 'Perempuan' : 
                                 'Laki - Laki';
            setGender(mappedGender)
        }
    }, [user])
    
    // 2. Fungsi untuk memetakan label FE ke nilai backend sebelum dikirim
    const mapGenderToBackend = (feGender: string) => {
        if (feGender === 'Laki - Laki') return 'male';
        if (feGender === 'Perempuan') return 'female';
        return 'male'; // Default
    }

    // --- SUBMIT FORM DAN KONEKSI API PUT ---

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user || !user.id || !token) {
            setError('Gagal memperbarui: Pengguna tidak terautentikasi atau data tidak lengkap.')
            return
        }

        setIsLoading(true)
        setError(null)
        setSuccessMessage(null)

        // Siapkan Payload sesuai dengan UpdateUserRequest DTO di Backend:
        const updatePayload = {
            fullName,
            // Tambahkan kembali '+62' saat mengirim ke backend
            phone: `+62${phone.startsWith('0') ? phone.substring(1) : phone}`,
            gender: mapGenderToBackend(gender),
            // wallet akan otomatis terkirim, asumsi BE mengizinkan null/default value jika tidak diubah
            wallet: user.wallet || 0 // Jika tidak ada perubahan, kirim nilai lama
        }
        
        try {
            // Panggil API PUT /users/{userId}
            const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Sertakan Token Autentikasi
                },
                body: JSON.stringify(updatePayload),
            })

            const data = await response.json()

            if (response.ok) {
                // Update data di Zustand Store dengan respons dari Backend
                updateProfileInStore(data.data) // Gunakan data.data karena respons Anda berstruktur {success: true, data: {user_object}}

                setSuccessMessage('Profil berhasil diperbarui!')
            } else {
                // Handle error dari backend
                setError(data.message || 'Gagal memperbarui profil. Silakan coba lagi.')
            }
        } catch (err) {
            console.error('API Error:', err)
            setError('Terjadi kesalahan jaringan atau server. Silakan coba lagi nanti.')
        } finally {
            setIsLoading(false)
        }
    }

    // ... (Sisa kode JSX tidak berubah)
    
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
                                    Rp{user?.wallet?.toLocaleString('id-ID') ?? 0}
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
                            {/* NIK (Disabled) */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">NIK</label>
                                <input
                                    type="text"
                                    placeholder="Nomor Induk Kependudukan"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-100 focus:ring-2 focus:ring-[#7b5bf3] focus:outline-none transition"
                                    value={nik}
                                    disabled={true}
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

                            {/* Email (Disabled) */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-100 focus:ring-2 focus:ring-[#7b5bf3] focus:outline-none transition"
                                    value={email}
                                    disabled={true}
                                />
                                <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah.</p>
                            </div>

                            {/* Nomor Telepon */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Nomor Telepon</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: 81234567890" 
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7b5bf3] focus:outline-none transition"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))} 
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