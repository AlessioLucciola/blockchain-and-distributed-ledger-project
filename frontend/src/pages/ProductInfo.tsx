import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { GRADIENTS, Roles } from "../shared/constants"
import Button from "../components/Button"
import { DistributorIcon, ManufacturerIcon, RetailerIcon, RightCaretIcon } from "../shared/icons"
import GradientText from "../components/GradientText"

export default function ProductInfo() {
	const { id } = useParams()
	return (
		<div className="bg-background h-screen w-screen overflow-scroll">
			<Navbar role={Roles.CUSTOMER} showLinks={false} />
			<div className="flex flex-col px-10 pt-36">
				<p className="font-bold text-text text-4xl">Product Info</p>
				<div className="flex gap-10">
					<div className="flex">
						<img src="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" alt="product image" className="h-fit w-fit" />
						<div className="flex flex-col mx-3 gap-10">
							<p className="font-semibold text-text text-4xl">Nike Dunk Low Diffused Taupe</p>
							<p className="text-text text-xl">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
								exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
							</p>
							<div className="flex w-full gap-3 items-center justify-between">
								<GradientText text="$108.99" className="text-5xl" />
								<Button text="Buy" className="w-fit" />
							</div>
						</div>
					</div>
					<div className={`rounded-xl p-4 bg-${GRADIENTS["div-gradient"]} flex items-center flex-col`}>
						<p className="font-semibold text-text text-nowrap pb-2 text-2xl">Other Products</p>
						<div className="flex flex-col gap-2">
							<OtherProductTab id="098201928390823" price="108.99" />
							<OtherProductTab id="098201928390823" price="108.99" />
							<OtherProductTab id="098201928390823" price="108.99" />
							<OtherProductTab id="098201928390823" price="108.99" />
							<OtherProductTab id="098201928390823" price="108.99" />
						</div>
					</div>
				</div>
				<p className="font-bold text-text text-4xl">Product History</p>
				<div className="flex pt-2 gap-2 items-center">
					<GradientText text="Product ID" className="text-xl" />
					<p className="text-text text-xl">093826692722638</p>
				</div>
				<div className="flex pb-5 gap-2 items-center">
					<GradientText text="Model ID" className="text-xl" />
					<p className="text-text text-xl">093826692722638</p>
				</div>
				<HistoryChain />
				<div className="pb-20"></div>
			</div>
		</div>
	)
}
interface OtherProductTabProps {
	id: string
	price: string
}
const OtherProductTab = ({ id, price }: OtherProductTabProps) => {
	return (
		<div className="bg-background rounded-xl cursor-pointer flex py-1 px-3 gap-2 box-shadow-lg justify-between items-center">
			<p className="font-semibold text-text text-md">{id}</p>
			<GradientText text={`$${price}`} className="text-md" />
			<RightCaretIcon className="h-4 fill-text w-4" />
		</div>
	)
}

const HistoryChain = () => {
	return (
		<div className="flex gap-3 items-center">
			<div className="bg-secondary flex flex-col rounded-3xl shadow-lg py-5 px-10 gap-3 items-center">
				<ManufacturerIcon className="h-fit fill-primary w-20" />
				<p className="font-semibold text-text text-2xl">Nike</p>
			</div>
			<span className="bg-secondary rounded-lg h-1 w-20"></span>
			<div className="bg-secondary flex flex-col rounded-3xl shadow-lg py-5 px-10 gap-3 items-center">
				<DistributorIcon className="h-fit fill-primary w-20" />
				<p className="font-semibold text-text text-2xl">Kicks Over Coffee</p>
			</div>
			<span className="bg-secondary rounded-lg h-1 w-20"></span>
			<div className="bg-secondary flex flex-col rounded-3xl shadow-lg py-5 px-10 gap-3 items-center">
				<RetailerIcon className="h-fit fill-primary w-20" />
				<p className="font-semibold text-text text-2xl">Foot Locker</p>
			</div>
		</div>
	)
}
