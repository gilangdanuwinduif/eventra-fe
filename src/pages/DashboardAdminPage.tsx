import React from 'react'
import { Button } from '../components/ui/button'

const DashboardAdminPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-100">
			{/* Header */}
			<header className="bg-purple-700 text-white p-4 flex justify-between items-center">
				<div className="flex items-center">
					<img src="/src/logo.svg" alt="EventTech Eventra Logo" className="h-8 mr-2" />
					<span className="text-xl font-bold">EventTech Eventra</span>
				</div>
				<nav>
					<ul className="flex space-x-4">
						<li>
							<a href="#" className="hover:underline">
								Dashboard
							</a>
						</li>
						<li>
							<a href="#" className="hover:underline">
								Event
							</a>
						</li>
						<li>
							<a href="#" className="hover:underline">
								Tiket
							</a>
						</li>
						<li>
							<a href="#" className="hover:underline">
								Pengguna
							</a>
						</li>
						<li>
							<a href="#" className="hover:underline">
								Laporan
							</a>
						</li>
						<li>
							<a href="#" className="hover:underline">
								Order
							</a>
						</li>
					</ul>
				</nav>
				<div className="text-right">
					<p className="font-semibold">Name</p>
					<p className="text-sm">Status User</p>
				</div>
			</header>

			{/* Main Content */}
			<main className="p-8">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Dashboard Admin</h1>
					<p className="text-gray-600">Home / Dashboard</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					{/* Card 1 */}
					<div className="bg-white rounded-lg shadow-md p-6 flex items-center">
						<div className="mr-4">
							<img src="https://via.placeholder.com/48" alt="Icon" className="h-12 w-12" />{' '}
							{/* Placeholder for icon */}
						</div>
						<div>
							<p className="text-3xl font-bold">1.0000</p>
							<p className="text-gray-600">Tiket Terjual</p>
						</div>
					</div>

					{/* Card 2 */}
					<div className="bg-white rounded-lg shadow-md p-6 flex items-center">
						<div className="mr-4">
							<img src="https://via.placeholder.com/48" alt="Icon" className="h-12 w-12" />{' '}
							{/* Placeholder for icon */}
						</div>
						<div>
							<p className="text-3xl font-bold">Rp 1000</p>
							<p className="text-gray-600">Total Pendapatan</p>
						</div>
					</div>

					{/* Card 3 */}
					<div className="bg-white rounded-lg shadow-md p-6 flex items-center">
						<div className="mr-4">
							<img src="https://via.placeholder.com/48" alt="Icon" className="h-12 w-12" />{' '}
							{/* Placeholder for icon */}
						</div>
						<div>
							<p className="text-3xl font-bold">10000</p>
							<p className="text-gray-600">Pengguna Terdaftar</p>
						</div>
					</div>

					{/* Card 4 */}
					<div className="bg-white rounded-lg shadow-md p-6 flex items-center">
						<div className="mr-4">
							<img src="https://via.placeholder.com/48" alt="Icon" className="h-12 w-12" />{' '}
							{/* Placeholder for icon */}
						</div>
						<div>
							<p className="text-3xl font-bold">10000</p>
							<p className="text-gray-600">Event Aktif</p>
						</div>
					</div>
				</div>

				{/* Event List */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex justify-end mb-4">
						<button className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center">
							<span className="mr-2">+</span> Event
						</button>
					</div>

					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Judul Event
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tanggal Event
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Sisa Tiket
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							<tr>
								<td className="px-6 py-4 whitespace-nowrap">
									<img
										src="https://via.placeholder.com/40"
										alt="Event Thumbnail"
										className="h-10 w-10"
									/>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">Event 001</td>
								<td className="px-6 py-4 whitespace-nowrap">1 Oktober 2025</td>
								<td className="px-6 py-4 whitespace-nowrap">200</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button className="bg-purple-600 text-white px-4 py-2 rounded-md">Detail</button>
								</td>
							</tr>
							<tr>
								<td className="px-6 py-4 whitespace-nowrap">
									<img
										src="https://via.placeholder.com/40"
										alt="Event Thumbnail"
										className="h-10 w-10"
									/>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">Event 002</td>
								<td className="px-6 py-4 whitespace-nowrap">5 Oktober 2025</td>
								<td className="px-6 py-4 whitespace-nowrap">HABIS!</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button className="bg-purple-600 text-white px-4 py-2 rounded-md">Detail</button>
								</td>
							</tr>
						</tbody>
					</table>

					{/* Pagination */}
					<div className="mt-4 flex justify-center">
						<span className="px-2 py-1">Page</span>
						<a href="#" className="px-2 py-1 font-bold text-purple-700">
							1
						</a>
						<a href="#" className="px-2 py-1 text-gray-600">
							2
						</a>
						<a href="#" className="px-2 py-1 text-gray-600">
							3
						</a>
						<a href="#" className="px-2 py-1 text-gray-600">
							4
						</a>
						<a href="#" className="px-2 py-1 text-gray-600">
							5
						</a>
					</div>
				</div>
			</main>
		</div>
	)
}

export default DashboardAdminPage
