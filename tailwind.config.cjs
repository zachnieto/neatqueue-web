/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			transitionProperty: {
				width: "width",
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"],
				rajdhani: ["Rajdhani", "sans-serif"],
				"jetbrains-mono": ["JetBrains Mono", "monospace"],
				inter: ["Inter", "sans-serif"],
			},
			colors: {
				gaming: {
					accent: "#00b4ff",
					success: "#39d98a",
					danger: "#ff4757",
					warning: "#ffa502",
					muted: "#5a6078",
					"muted-light": "#7a8099",
					"muted-lighter": "#9aa0b4",
					"text-light": "#e8eaf0",
					"text-mid": "#c8cad8",
					"text-dim": "#3d4258",
				},
			},
		},
	},
	plugins: [],
};
