/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{ts,tsx,jsx,js}"],
	theme: {
		fontFamily: {
			sans: ["Manrope", "sans-serif"],
		},
		extend: {
			spacing: {
				gutter: "var(--gutter)",
			},
		},
	},
	plugins: [],
};
