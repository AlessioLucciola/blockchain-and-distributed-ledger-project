import { useNavigate } from "react-router-dom"

export default function Navbar() {
	const navigate = useNavigate()
	return (
		<div className="flex flex-col align-center items-center">
			<div className="bg-background rounded-xl flex flex-row h-20   shadow-lg my-4 w-[98%] fixed justify-between items-center">
				<div className="flex flex-row gap-2 items-center">
					<img src="./src/assets/logo.png" alt="smartsupply logo" className="cursor-pointer h-16 w-18" onClick={() => navigate("/")} />
					<div className="bg-gradient-to-b bg-clip-text from-text to-secondary text-transparent text-2xl">Smart Supply.</div>
				</div>
				<div className="flex flex-row pr-10 gap-4 justify-center items-center">
					<div className="cursor-pointer text-primary hover:underline">About.</div>
					<div className="cursor-pointer text-primary hover:underline">Pricing.</div>
					<div className="cursor-pointer text-primary hover:underline" onClick={() => navigate("/login")}>
						Login.
					</div>
				</div>
			</div>
		</div>
	)
}
