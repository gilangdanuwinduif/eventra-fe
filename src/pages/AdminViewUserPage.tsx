import React, { useState, useEffect } from 'react'
// Asumsi Anda memiliki store untuk token admin
import useAuthStore from '../store/authStore'
import axios from '../lib/axios' // Import the pre-configured axios instance

import { UserData } from '../interfaces/UserData'
import { PaginationMeta } from '../interfaces/PaginationMeta'
import { UserListResponse } from '../interfaces/UserListResponse'
import AdminUserTable from '../components/AdminUserTable' // Import the new component
// 📝 TARUH DI LUAR KOMPONEN
const DEFAULT_PAGINATION_STATE: PaginationMeta = {
	totalElements: 0,
	totalPages: 1,
	currentPage: 1,
	page: 1,
	limit: 10,
	last: true
}

const AdminViewUserPage: React.FC = () => {
	const { token } = useAuthStore()

	const [users, setUsers] = useState<UserData[]>([])
	const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION_STATE)
	const [currentPage, setCurrentPage] = useState(1)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchUsers = React.useCallback(
		async (page: number) => {
			setIsLoading(true)
			setError(null)
			try {
				const response = await axios.get('/users', {
					headers: { Authorization: `Bearer ${token}` },
					params: { page: page.toString(), limit: '10', sortBy: 'createdAt', sortDir: 'desc' }
				})

				const result: UserListResponse = response.data
				if (!result.success) throw new Error(result.message || `Gagal mengambil data`)

				setUsers(result.data.content)
				setPagination({
					...result.data,
					currentPage: result.data.page,
					last: result.data.last
				})

				// ❗ hanya update kalau berbeda, untuk mencegah loop
				if (currentPage !== result.data.page) {
					setCurrentPage(result.data.page)
				}
			} catch (err) {
				console.error('Fetch User Error:', err)
				setUsers([])
				setPagination(DEFAULT_PAGINATION_STATE)
				setError(`Gagal memuat data: ${err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga'}`)
			} finally {
				setIsLoading(false)
			}
		},
		[token, currentPage]
	)

	useEffect(() => {
		if (token) {
			fetchUsers(currentPage)
		} else {
			setError('Token tidak ditemukan. Mohon login sebagai Admin.')
			setUsers([])
			setPagination(DEFAULT_PAGINATION_STATE)
			setIsLoading(false)
		}
	}, [token, currentPage, fetchUsers]) // 🟢 sudah aman

	return (
		<div className="bg-gray-100 font-sans">
			<header className="bg-[#7b5bf3] text-white shadow-md" />
			<main className="min-w-full flex flex-col justify-center items-center max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-800">Dashboard Admin View User</h1>
				</div>
				<AdminUserTable
					users={users}
					pagination={pagination}
					onPageChange={fetchUsers}
					isLoading={isLoading}
					error={error}
				/>
			</main>
		</div>
	)
}

export default AdminViewUserPage
