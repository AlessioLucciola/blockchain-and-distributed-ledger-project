import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { GRADIENTS, Roles } from "../shared/constants"
import Button from "../components/Button"
import { RightCaretIcon } from "../shared/icons"

export default function ProductInfo() {
	const { id } = useParams()
	return (
		<div className="bg-background h-screen w-screen">
			<Navbar role={Roles.CUSTOMER} showLinks={false} />
			<div className="px-10 pt-36">
				<p className="font-bold text-text text-4xl">Product Info</p>
				<div className="flex justify-between">
					<div className="flex gap-2">
						<img src="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" alt="product image" className="h-fit w-[2000px]" />
						<div className="flex flex-col px-10 gap-10">
							<p className="font-semibold text-text text-4xl">Nike Dunk Low Diffused Taupe</p>
							<p className="text-text text-xl">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
								exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
							</p>
							<div className="flex w-full justify-between">
								<div className="bg-gradient-to-b bg-clip-text from-text to-secondary font-semibold text-transparent text-5xl drop-shadow-lg">$108.99</div>
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
			<p className="bg-gradient-to-b bg-clip-text from-text to-secondary font-semibold text-transparent text-md drop-shadow-lg">${price}</p>
			<RightCaretIcon className="h-4 fill-text w-4" />
		</div>
	)
}
