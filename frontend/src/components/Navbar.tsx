export default function Navbar() {
	return (
		<div className="bg-background rounded-xl flex flex-row h-20 m-2 w-screen p-4 shadow-3xl fixed justify-between items-center">
			<div className="flex flex-row gap-2 items-center">
				<img src="./src/assets/logo.png" alt="smartsupply logo" className="h-16 w-18" />
				<div className="bg-gradient-to-b bg-clip-text from-text to-secondary text-transparent text-2xl">Smart Supply.</div>
			</div>
			<div className="flex flex-row pr-10 gap-4 justify-center items-center">
				<div className="text-primary">About.</div>
				<div className="text-primary">Pricing.</div>
				<div className="text-primary">Login.</div>
			</div>
		</div>
	)
}
