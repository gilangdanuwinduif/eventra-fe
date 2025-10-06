import React from 'react'

const LandingPage: React.FC = () => {
	return (
		<div>
			<section className="bg-[#d1c4e9] py-[100px] px-[50px] text-center text-[#4a148c] min-h-[500px] flex flex-col justify-center items-center">
				<h1 className="text-[48px] font-bold mb-[20px] max-w-[800px] leading-[1.2]">
					Temukan EventTech Terbaik di EventTeh Eventra
				</h1>
				<p className="text-[18px] font-normal mb-[40px] max-w-[600px] text-[#6a1b9a]">
					Jelajahi berbagai event musik, olahraga, seni, dan banyak lagi. Dapat pengalaman tak terlupakan
					bersama kami.
				</p>
				<div className="w-full max-w-[600px] relative">
					<span className="absolute left-[20px] top-1/2 -translate-y-1/2 text-[#999] pointer-events-none text-[18px]">
						🔍
					</span>
					<input
						type="text"
						className="w-full py-[15px] pr-[25px] pl-[50px] border-none rounded-[30px] text-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] outline-none"
						placeholder="Search"
					/>
				</div>
			</section>

			<main className="py-[60px] px-[80px] text-center">
				<h2 className="text-[32px] font-bold mb-[50px] text-[#4a148c]">Event Terbaru dan Terpopuler</h2>

				<div className="flex justify-center gap-[30px] flex-wrap">
					<div className="w-[280px] bg-white rounded-[10px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.1)] text-left transition-transform duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
						<div className="relative">
							<img
								src="https://via.placeholder.com/280x180/7e57c2/ffffff?text=EVENT+DRIVE+IN"
								alt="Event Drive In Senja"
								className="w-full h-[180px] object-cover block"
							/>
							<span className="absolute top-[15px] right-[15px] bg-[#8c5dff] text-white py-[4px] px-[10px] rounded-[4px] text-[12px] font-semibold">
								Kategori
							</span>
						</div>
						<div className="p-[15px]">
							<p className="text-[14px] text-[#8c5dff] font-medium mb-[5px]">Movies | Drive-In</p>
							<h3 className="text-[18px] font-semibold mb-[10px] leading-[1.4] text-[#333]">
								Drive In Senja Back to the...
							</h3>
							<div className="flex items-center mb-[5px] text-[14px] text-[#666]">
								<i className="far fa-calendar-alt mr-[8px] text-[#8c5dff]"></i>
								<span className="date">22 SEP</span>
							</div>
							<div className="flex items-center mb-[5px] text-[14px] text-[#666]">
								<i className="fas fa-money-bill-wave mr-[8px] text-[#8c5dff]"></i>
								<span className="price-range">Rp 200.000 - 550.000</span>
							</div>
							<div className="flex items-center mb-[5px] text-[14px] text-[#666]">
								<i className="fas fa-map-marker-alt mr-[8px] text-[#8c5dff]"></i>
								<span className="location">Parkiran Utama Mall @ Alam...</span>
							</div>
						</div>
					</div>

					<div className="w-[280px] bg-white rounded-[10px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.1)] text-left transition-transform duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
						<div className="relative">
							<img
								src="https://via.placeholder.com/280x180/7e57c2/ffffff?text=EVENT+DRIVE+IN"
								alt="Event Drive In Senja"
								className="w-full h-[180px] object-cover block"
							/>
							<span className="absolute top-[15px] right-[15px] bg-[#8c5dff] text-white py-[4px] px-[10px] rounded-[4px] text-[12px] font-semibold">
								Kategori
							</span>
						</div>
						<div className="p-[15px]">
							<p className="text-[14px] text-[#8c5dff] font-medium mb-[5px]">Movies | Drive-In</p>
							<h3 className="text-[18px] font-semibold mb-[10px] leading-[1.4] text-[#333]">
								Drive In Senja Back to the...
							</h3>
							<div className="flex items-center mb-[5px] text-[14px] text-[#666]">
								<i className="far fa-calendar-alt mr-[8px] text-[#8c5dff]"></i>
								<span className="date">22 SEP</span>
							</div>
							<div className="flex items-center mb-[5px] text-[14px] text-[#666]">
								<i className="fas fa-money-bill-wave mr-[8px] text-[#8c5dff]"></i>
								<span className="price-range">Rp 200.000 - 550.000</span>
							</div>
							<div className="flex items-center mb-[5px] text-[14px] text-[#666]">
								<i className="fas fa-map-marker-alt mr-[8px] text-[#8c5dff]"></i>
								<span className="location">Parkiran Utama Mall @ Alam...</span>
							</div>
						</div>
					</div>

					<div className="w-[280px] bg-white rounded-[10px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.1)] text-left transition-transform duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
						<div className="relative">
							<img
								src="https://via.placeholder.com/280x180/7e57c2/ffffff?text=EVENT+DRIVE+IN"
								alt="Event Drive In Senja"
								className="w-full h-[180px] object-cover block"
							/>
							<span className="absolute top-[15px] right-[15px] bg-[#8c5dff] text-white py-[4px] px-[10px] rounded-[4px] text-[12px] font-semibold">
								Kategori
							</span>
						</div>
						<div className="p-[15px]">
							<p className="text-[14px] text-[#8c5dff] font-medium mb-[5px]">Movies | Drive-In</p>
							<h3 className="text-[18px] font-semibold mb-[10px] leading-[1.4] text-[#333]">
								Drive In Senja Back to the...
							</h3>
							<div className="flex items-center mb-[5px] text-[14px] text-[#666]">
								<i className="far fa-calendar-alt mr-[8px] text-[#8c5dff]"></i>
								<span className="date">22 SEP</span>
							</div>
							<div className="flex items-center mb-[5px] text-[14px] text-[#666]">
								<i className="fas fa-money-bill-wave mr-[8px] text-[#8c5dff]"></i>
								<span className="price-range">Rp 200.000 - 550.000</span>
							</div>
							<div className="flex items-center mb-[5px] text-[14px] text-[#666]">
								<i className="fas fa-map-marker-alt mr-[8px] text-[#8c5dff]"></i>
								<span className="location">Parkiran Utama Mall @ Alam...</span>
							</div>
						</div>
					</div>

					<div className="w-[280px] bg-white rounded-[10px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.1)] text-left transition-transform duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
						<div className="relative">
							<img
								src="https://via.placeholder.com/280x180/7e57c2/ffffff?text=EVENT+DRIVE+IN"
								alt="Event Drive In Senja"
								className="w-full h-[180px] object-cover block"
							/>
							<span className="absolute top-[15px] right-[15px] bg-[#8c5dff] text-white py-[4px] px-[10px] rounded-[4px] text-[12px] font-semibold">
								Kategori
							</span>
						</div>
						<div className="p-[15px]">
							<p className="text-[14px] text-[#8c5dff] font-medium mb-[5px]">Movies | Drive-In</p>
							<h3 className="text-[18px] font-semibold mb-[10px] leading-[1.4] text-[#333]">
								Drive In Senja Back to the...
							</h3>
							<div className="flex items-center mb-[5px] text-[14px] text-[#666]">
								<i className="far fa-calendar-alt mr-[8px] text-[#8c5dff]"></i>
								<span className="date">22 SEP</span>
							</div>
							<div className="flex items-center mb-[5px] text-[14px] text-[#666]">
								<i className="fas fa-money-bill-wave mr-[8px] text-[#8c5dff]"></i>
								<span className="price-range">Rp 200.000 - 550.000</span>
							</div>
							<div className="flex items-center mb-[5px] text-[14px] text-[#666]">
								<i className="fas fa-map-marker-alt mr-[8px] text-[#8c5dff]"></i>
								<span className="location">Parkiran Utama Mall @ Alam...</span>
							</div>
						</div>
					</div>
				</div>
			</main>

			<footer className="bg-gray-900 text-white py-12 px-8">
				<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Column 1: Logo and Description */}
					<div>
						<h3 className="text-2xl font-bold mb-4">EventTech Eventra</h3>
						<p className="text-gray-400 text-sm">
							Temukan event terbaik di EventTech Eventra. Jelajahi berbagai event musik, olahraga, seni,
							dan banyak lagi.
						</p>
					</div>

					{/* Column 2: Quick Links */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<a href="#" className="text-gray-400 hover:text-white transition-colors">
									Events
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-400 hover:text-white transition-colors">
									Categories
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-400 hover:text-white transition-colors">
									About Us
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-400 hover:text-white transition-colors">
									Contact
								</a>
							</li>
						</ul>
					</div>

					{/* Column 3: Contact & Social */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Contact Us</h3>
						<p className="text-gray-400 text-sm mb-2">Email: info@eventra.com</p>
						<p className="text-gray-400 text-sm mb-4">Phone: +62 123 4567 890</p>
						<div className="flex space-x-4">
							<a href="#" className="text-gray-400 hover:text-white transition-colors">
								<i className="fab fa-facebook-f"></i>
							</a>
							<a href="#" className="text-gray-400 hover:text-white transition-colors">
								<i className="fab fa-twitter"></i>
							</a>
							<a href="#" className="text-gray-400 hover:text-white transition-colors">
								<i className="fab fa-instagram"></i>
							</a>
							<a href="#" className="text-gray-400 hover:text-white transition-colors">
								<i className="fab fa-linkedin-in"></i>
							</a>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
					<p>&copy; 2025 EventTech Eventra. All rights reserved.</p>
				</div>
			</footer>
		</div>
	)
}

export default LandingPage
