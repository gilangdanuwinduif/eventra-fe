module.exports = {
	content: ['./dist/**/*.html', './src/**/*.{js,jsx,ts,tsx}', './*.html'],
	theme: {
		extend: {
			colors: {
				'even-tect-purple': '#7B57FE' // Custom color for EvenTect
			}
		}
	},
	plugins: [require('@tailwindcss/forms')],
	variants: {
		extend: {
			opacity: ['disabled']
		}
	}
}
