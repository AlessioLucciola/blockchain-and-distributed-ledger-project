import Navbar from "../components/Navbar"
import { GRADIENTS } from "../shared/constants"
import { DistributorIcon, ManufacturerIcon, CustomerIcon, RetailerIcon } from "../shared/icons"

export default function Register() {
	return (
		<>
			<Navbar />
			<div className="bg-background h-screen w-screen">
				<div className="flex flex-col h-full w-full pl-36 items-center justify-center">
					<div className="flex flex-col h-fit w-fit gap-6 justify-center items-center">
						<div className="bg-gradient-to-b bg-clip-text from-text to-secondary font-semibold text-transparent text-7xl drop-shadow-lg">Register as a</div>
						<div className="flex flex-row gap-20 ">
							<div className={`bg-${GRADIENTS["div-gradient"]} px-8 py-10 rounded-3xl flex flex-col items-center justify-between shadow-lg `}>
								<ManufacturerIcon className="h-[200px] fill-primary shadow-red-400 w-[200px] drop-shadow-lg" />
								<p className="font-semibold text-text text-xl pt-2">Manufacturer</p>
							</div>
							<div className={`bg-${GRADIENTS["div-gradient"]} px-8 py-10 rounded-3xl flex flex-col items-center justify-between shadow-lg `}>
								<DistributorIcon className="h-[200px] fill-primary w-[200px] drop-shadow-lg" />
								<p className="font-semibold text-text text-xl pt-2">Distributor</p>
							</div>
							<div className={`bg-${GRADIENTS["div-gradient"]} px-8 py-10 rounded-3xl flex flex-col items-center justify-between shadow-lg `}>
								<RetailerIcon className="h-[200px]  fill-primary w-[200px] drop-shadow-lg" />
								<p className="font-semibold text-text text-xl pt-2">Retailer</p>
							</div>
							<div className={`bg-${GRADIENTS["div-gradient"]} px-8 py-10 rounded-3xl flex flex-col items-center justify-between shadow-lg `}>
								<CustomerIcon className="h-[200px] fill-primary w-[200px] drop-shadow-lg" />
								<p className="font-semibold text-text text-xl pt-2">Customer</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
