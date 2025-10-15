import React, { useState, useEffect } from 'react';
// Asumsi Anda memiliki store untuk token admin
import useAuthStore from '../store/authStore'; 
import { URLSearchParams } from 'url';

// ----------------------------------------------------
// 1. INTERFACE/TIPE DATA
// ----------------------------------------------------

interface UserData {
    id: string; // UUID
    fullName: string;
    email: string;
    nik: string;
    phone: string; 
    gender: string; 
    // Tambahkan field lain dari UserResponse jika dibutuhkan
    // role, createdAt, isRegistered, wallet
}

interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    page: number;
    limit: number;
    isFirst: boolean;
    isLast: boolean;
}

// Tipe Respons API Lengkap (sesuai structure: ApiResponse<PaginationResponse<UserResponse>>)
interface UserListResponse {
    success: boolean;
    message: string;
    data: PaginationMeta & { // Menggabungkan properti pagination langsung ke 'data'
        content: UserData[];
    };
}

const API_BASE_URL = 'http://localhost:8081/api';

const AdminViewUserPage: React.FC = () => {
    // 2. STATE UNTUK DATA DAN STATUS
    const { token } = useAuthStore();
    const defaultPaginationState: PaginationMeta = { 
        totalItems: 0, 
        totalPages: 1, 
        currentPage: 1, 
        page: 1, 
        limit: 10,
        isFirst: true,
        isLast: true,
    };

    const [users, setUsers] = useState<UserData[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta>(defaultPaginationState);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 3. FUNGSI FETCH DATA
    const fetchUsers = React.useCallback(async (page: number) => {
        setIsLoading(true);
        setError(null);

        // Parameter hardcoded: limit=10, sortBy=createdAt, sortDir=asc
        const params = new URLSearchParams({
            page: page.toString(),
            limit: '10', 
            sortBy: 'createdAt',
            sortDir: 'asc'
        });

        try {
            const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
                method: 'GET',
                headers: {
                    // WAJIB: Sertakan token Admin
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                },
            });

            const result: any = await response.json();
            
            // 💡 Perbaikan: Cek response.ok DAN result.success
            if (!response.ok || !result.success) { 
                throw new Error(result.message || `Gagal mengambil data: Status HTTP ${response.status}`);
            }

            const userListResult: UserListResponse = result;
            
            // Perbarui state
            setUsers(userListResult.data.content);
            setPagination(userListResult.data); // Karena data dari BE sudah mencakup semua field PaginationMeta
            setCurrentPage(userListResult.data.page);

        } catch (err) {
            console.error("Fetch User Error:", err);
            // 💡 SOLUSI PENTING: Reset state ke nilai default yang aman saat GAGAL
            setUsers([]); 
            setPagination(defaultPaginationState);
            setError(`Gagal memuat data: ${err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga'}`);
        } finally {
            setIsLoading(false);
        }
    }, [token, defaultPaginationState]); // Tambahkan defaultPaginationState ke dependency array

    // 4. EFFECT HOOKS: Panggil fetchUsers saat komponen dimuat atau currentPage berubah
    useEffect(() => {
        if (token) {
            fetchUsers(currentPage);
        } else {
            setError("Token tidak ditemukan. Mohon login sebagai Admin.");
            setUsers([]); 
            setPagination(defaultPaginationState); 
            setIsLoading(false);
        }
    }, [token, currentPage, fetchUsers, defaultPaginationState]);

    // 5. HELPER FUNCTION: Mapping Gender dari nilai BE ke label FE
    const mapGender = (backendGender: string) => {
        if (!backendGender) return 'N/A';
        const lowerCaseGender = backendGender.toLowerCase();
        if (lowerCaseGender === 'male' || lowerCaseGender === 'pria' || lowerCaseGender === 'laki-laki') {
            return 'Pria';
        }
        if (lowerCaseGender === 'female' || lowerCaseGender === 'wanita' || lowerCaseGender === 'perempuan') {
            return 'Wanita';
        }
        return 'Lainnya';
    }
    
    // 6. HELPER FUNCTION: Render Pagination Links
    const renderPagination = () => {
        // 💡 SOLUSI: Pastikan totalPages ada dan lebih dari 1
        if (pagination.totalPages === undefined || pagination.totalPages <= 1) return null;

        const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

        return (
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <span className="px-3 py-2 text-sm font-medium text-gray-700">Page</span>
                {pages.map(page => (
                    <a 
                        key={page}
                        href="#"
                        onClick={(e) => { e.preventDefault(); fetchUsers(page); }}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border transition duration-150 ${
                            page === currentPage 
                                ? 'z-10 bg-[#7b5bf3] text-white border-[#7b5bf3]'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </a>
                ))}
            </nav>
        );
    };

    // 7. RENDER KONTEN (JSX)
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <header className="bg-[#7b5bf3] text-white shadow-md">
                 {/* ... (Navbar JSX Anda) ... */}
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin View User</h1>
                    <p className="text-sm text-gray-500">Home / <span className="text-gray-700 font-medium">Dashboard</span></p>
                </div>

                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    {/* Tampilkan Loading/Error State */}
                    {isLoading && <p className="p-4 text-center text-[#7b5bf3]">Memuat data...</p>}
                    {error && <p className="p-4 text-center text-red-600 font-medium">Error: {error}</p>}

                    {/* Tampilkan Tabel hanya jika data sudah ada dan tidak ada error */}
                    {!isLoading && !error && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Telepon</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kelamin</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {/* Mapping Data Pengguna */}
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.nik || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone?.replace(/^\+62/, '0') || 'N/A'}</td> 
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mapGender(user.gender)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="bg-[#7b5bf3] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#6a4ae0] transition duration-150">
                                                        Riwayat Aktifitas User
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && !isLoading && !error && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                                    Tidak ada data pengguna yang ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* PAGINATION */}
                            <div className="px-4 py-3 border-t border-gray-200 bg-white sm:px-6 flex justify-center items-center">
                                {renderPagination()}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminViewUserPage;