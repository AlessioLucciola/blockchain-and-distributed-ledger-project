const config = {
	mode: "jit",
	purge: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	// darkMode: false,
	theme: {
		extend: {
			colors: {
				text: "#ECEEF4",
				background: "#0A0E18",
				primary: "#8DA5E0",
				secondary: "#17398C",
				accent: "#1756EF",
			},
			backgroundImage: {
				hero: "url('./src/assets/background.png')",
			},
			boxShadow: {
				lg: "0 10px 10px rgba(0, 0, 0, 0.5)",
			},
			dropShadow: {
				lg: "0 10px 10px rgba(0, 0, 0, 0.5)",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}

export default config
