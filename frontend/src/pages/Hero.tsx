import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import Navbar from "../components/Navbar"
import GradientText from "../components/GradientText"
import { useSessionContext } from "../context/exportContext"
import { useEffect } from "react"
import { addManufacturer, removeDistributor } from "../assets/api/contractCalls"

export default function Home() {
	const navigate = useNavigate()
	const sessionContext = useSessionContext()

	useEffect(() => {
		if (sessionContext.entityInfo) {
			navigate("/home")
		}
	}, [sessionContext])
	return (
		<>
			<Navbar />
			<div className="bg-hero bg-cover bg-no-repeat h-screen w-screen">
				<div className="flex flex-col h-full w-full pl-36 items-center justify-center">
					<div className="flex flex-col h-fit w-fit gap-6">
						<GradientText text="Smart Supply." className="text-7xl" />
						<div className="font-bold text-text text-4xl drop-shadow-lg">Create It</div>
						<div className="font-bold text-text text-4xl drop-shadow-lg">Sell It</div>
						<div className="font-bold text-text text-4xl drop-shadow-lg">Check It</div>
						<div className="flex flex-row w-full  items-center justify-between relative">
							<div className="flex flex-row top-[55px] right-[550px] items-center justify-center absolute">
								<img src="./src/assets/ethereum.png" alt="ethereum logo" className="h-[64px] mr-4 w-[44px] drop-shadow-lg " />
								<p className="text-text text-nowrap  text-2xl drop-shadow-lg">
									Fighting against counterfeit products <br /> with Blockchain-powered solution.
								</p>
							</div>
							<Button text="test" onClick={() => addManufacturer()} />
							<Button text="Join Us" className="w-fit mt-16" onClick={() => navigate("/register")} />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
