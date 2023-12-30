import Button from "../components/Button"
import GradientText from "../components/GradientText"
import InputField from "../components/InputField"
import Navbar from "../components/Navbar"
import { useState } from "react"


import { isMetamaskInstalled, getMetamaskAddress } from '../utils/metamaskUtils';

export default function Login() {
	const [walletAddress, setWalletAddress] = useState<string | null>(null); // Added state for wallet address

	return (
		<>
			<Navbar />
			<div className="bg-hero bg-cover bg-no-repeat h-screen w-screen">
				<div className="flex flex-col h-full w-full pl-36 items-center justify-center">
					<div className="flex flex-col h-fit w-fit gap-6">
						<GradientText text="Who are you?" className="text-7xl" />
						<InputField name="Email" type="email" />
						<InputField name="Password" type="password" />
						<p className="cursor-pointer font-bold text-primary pt-1 hover:underline">I forgot my password :(</p>
						{isMetamaskInstalled() === true ? (
							<Button
								onClick={() => {
									getMetamaskAddress().then((walletAddress) => {
										setWalletAddress(walletAddress);
									});
								}}
								text="Connect Metamask"
								className="w-fit"
							/>		
						) : (
							<Button
								onClick={() => {
									window.location.href = 'https://metamask.io/download/';
								}}
								text="Install Metamask"
								className="w-fit"
							/>							
						)}
						{walletAddress && (
							<p className="text-white">Wallet Address: {walletAddress}</p>
						)}
						{walletAddress && (
							<Button text="Log In" className="w-fit" />
						)}
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
