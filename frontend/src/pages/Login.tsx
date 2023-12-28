import Button from "../components/Button"
import InputField from "../components/InputField"
import Navbar from "../components/Navbar"

export default function Login() {
	return (
		<>
			<Navbar />
			<div className="bg-hero bg-cover bg-no-repeat h-screen w-screen">
				<div className="flex flex-col h-full w-full pl-36 items-center justify-center">
					<div className="flex flex-col h-fit w-fit gap-6">
						<p className="bg-gradient-to-b bg-clip-text from-text to-secondary font-bold text-transparent text-7xl drop-shadow-lg">Who are you?</p>
						<InputField name="Email" type="email" />
						<InputField name="Password" type="password" />
						<p className="cursor-pointer font-bold text-primary pt-1 hover:underline">I forgot my password :(</p>
						<Button text="Log In" className="w-fit" />
						{/* <div className="flex flex-row w-full  items-center justify-between relative">
							<div className="flex flex-row top-[55px] right-[550px] items-center justify-center absolute">
								<img src="./src/assets/ethereum.png" alt="ethereum logo" className="h-[64px] mr-4 w-[44px] drop-shadow-lg " />
								<p className="text-text text-nowrap  text-2xl drop-shadow-lg">
									Fighting against counterfeit products <br /> with Blockchain-powered solution.
								</p>
							</div>
							<Button text="Join Us" className="w-fit mt-16" />
						</div> */}
					</div>
				</div>
			</div>
		</>
	)
}
