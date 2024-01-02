import Button from "../components/Button"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import { ProductStage, Roles } from "../shared/constants"
import { RightCaretIcon } from "../shared/icons"

export default function MyOrders() {
	return (
		<div className="bg-background h-screen w-screen pb-20 overflow-y-scroll">
			<Navbar showLinks={false} />
			<div className="mt-36 px-10">
				<GradientText text="My Orders" className="text-4xl" />
				<div className="flex flex-col gap-2">
					<OrderCard name="Nike Dunk Low Diffused Taupe" price="100.43" status={ProductStage.PURCHASED} image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
					<OrderCard name="Nike Dunk Low Diffused Taupe" price="100.43" status={ProductStage.SHIPPED} image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
				</div>
			</div>
		</div>
	)
}

interface OrderCardProps {
	name: string
	price: string
	status: ProductStage
	image: string
}
function OrderCard({ name, status, image }: OrderCardProps) {
	return (
		<div className="flex gap-5">
			<img src={image} alt="product image" className="h-fit w-[200px]" />
			<div className="flex gap-10 items-center justify-between">
				<div className="flex flex-col h-full justify-around">
					<p className="font-semibold text-text text-xl drop-shadow-lg">{name}</p>
					<span className="flex gap-2 items-center">
						<GradientText text="Details" className="text-xl" />
						<RightCaretIcon className="h-4 fill-text w-4" />
					</span>
				</div>
				<div className="flex flex-col h-full justify-around">
					<span className="flex gap-2 items-center">
						<p className="font-semibold text-text text-xl drop-shadow-lg">Status</p>
						<GradientText text={status[0].toUpperCase() + status.slice(1)} className="text-xl" />
					</span>
					<Button text="I received the product" className={`p-2 font-semibold ${status === ProductStage.SHIPPED ? "visible" : "invisible"}`} />
				</div>
			</div>
		</div>
	)
}
