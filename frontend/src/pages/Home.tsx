import Button from "../components/Button"
import Navbar from "../components/Navbar"

export default function Home() {
	return (
		<>
			<Navbar />
			<div className="bg-hero bg-cover bg-no-repeat h-screen w-screen">
				<div className="flex flex-col h-full w-full pl-36 items-center justify-center">
					<div className="flex flex-col h-fit w-fit gap-6">
						<div className="bg-gradient-to-b bg-clip-text from-text to-secondary font-bold text-transparent text-7xl drop-shadow-xl">Smart Supply.</div>
						<div className="font-bold text-text text-4xl drop-shadow-xl">Create It</div>
						<div className="font-bold text-text text-4xl drop-shadow-xl">Sell It</div>
						<div className="font-bold text-text text-4xl drop-shadow-xl">Check It</div>
						<div className="flex flex-row w-full  items-center justify-between relative">
							<div className="flex flex-row top-[55px] right-[550px] items-center justify-center absolute">
								<img src="./src/assets/ethereum.png" alt="ethereum logo" className="h-[64px] mr-4 w-[44px] " />
								<p className="text-text text-nowrap  text-2xl drop-shadow-xl ">
									Fighting against counterfeit products <br /> with Blockchain-powered solution.
								</p>
							</div>
							<Button text="Join Us" className="w-fit mt-16" />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
