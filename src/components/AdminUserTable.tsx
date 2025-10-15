import React from 'react'
import { UserData } from '../interfaces/UserData'
import { PaginationMeta } from '../interfaces/PaginationMeta'
import { formatHeaderKey } from '../lib/utils'

interface AdminUserTableProps {
	users: UserData[]
	pagination: PaginationMeta
	onPageChange: (page: number) => void
	isLoading: boolean
	error: string | null
}

const AdminUserTable: React.FC<AdminUserTableProps> = ({ users, pagination, onPageChange, isLoading, error }) => {
	// HELPER FUNCTION: Mapping Gender dari nilai BE ke label FE
	const mapGender = (backendGender: string) => {
		if (!backendGender) return 'N/A'
		const lowerCaseGender = backendGender.toLowerCase()
		if (lowerCaseGender === 'male' || lowerCaseGender === 'pria' || lowerCaseGender === 'laki-laki') {
			return 'Pria'
		}
		if (lowerCaseGender === 'female' || lowerCaseGender === 'wanita' || lowerCaseGender === 'perempuan') {
			return 'Wanita'
		}
		return 'Lainnya'
	}

	// Define the order of columns and their corresponding keys from UserData
	const columnKeys: (keyof UserData)[] = [
		'id',
		'fullName',
		'email',
		'phone',
		'role',
		'createdAt',
		'gender',
		'nik',
		'isRegistered',
		'wallet'
	]

	// HELPER FUNCTION: Render Pagination Links
	const renderPagination = () => {
		if (pagination.totalPages === undefined || pagination.totalPages <= 1) return null

		const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1)

		return (
			<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
				<span className="px-3 py-2 text-sm font-medium text-gray-700">Page</span>
				{pages.map((page) => (
					<a
						key={page}
						href="#"
						onClick={(e) => {
							e.preventDefault()
							onPageChange(page)
						}}
						className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border transition duration-150 ${
							page === pagination.currentPage
								? 'z-10 bg-[#7b5bf3] text-white border-[#7b5bf3]'
								: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
						}`}
					>
						{page}
					</a>
				))}
			</nav>
		)
	}

	return (
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
									{columnKeys.map((key) => (
										<th
											key={key}
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											{formatHeaderKey(key)}
										</th>
									))}
									{/* Static "Aksi" column */}
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Aksi
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{/* Mapping Data Pengguna */}
								{users.map((user) => (
									<tr key={user.id}>
										{columnKeys.map((key) => (
											<td
												key={`${user.id}-${key}`}
												className="px-6 py-4 whitespace-nowrap text-sm  text-gray-900"
											>
												{key === 'createdAt'
													? new Date(user[key] as string).toLocaleDateString()
													: key === 'phone'
														? (user[key] as string)?.replace(/^\+62/, '0') || 'N/A'
														: key === 'gender'
															? mapGender(user[key] as string)
															: key === 'isRegistered'
																? user[key]
																	? 'Yes'
																	: 'No'
																: key === 'wallet'
																	? (user[key] as number)?.toLocaleString('id-ID', {
																			style: 'currency',
																			currency: 'IDR'
																		}) || 'N/A'
																	: user[key] !== undefined && user[key] !== null
																		? String(user[key])
																		: 'N/A'}
											</td>
										))}
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<button className="bg-[#7b5bf3] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#6a4ae0] transition duration-150">
												Riwayat Aktifitas User
											</button>
										</td>
									</tr>
								))}
								{users.length === 0 && !isLoading && !error && (
									<tr>
										<td
											colSpan={columnKeys.length + 1}
											className="px-6 py-4 text-center text-gray-500"
										>
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
	)
}

export default AdminUserTable
