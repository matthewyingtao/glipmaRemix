/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{ts,tsx,jsx,js}"],
	theme: {
		extend: {
			spacing: {
				gutter: "var(--gutter)",
			},
		},
	},
	plugins: [],
};
