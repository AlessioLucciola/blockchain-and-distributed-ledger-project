import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import { GRADIENTS, Roles } from "../shared/constants"

export default function Shop() {
	return (
		<div className="bg-background h-screen w-screen pb-20 overflow-y-scroll">
			<Navbar showLinks={false} role={Roles.MANUFACTURER} />
			<div className="mt-36 px-10">
				<GradientText text="Your Products" className="text-4xl " />
				<p className="font-semibold  text-text pt-5 text-3xl">Recently Added Products</p>
				<div className="flex pt-5 gap-10 overflow-x-scroll">
					<div className={`bg-accent rounded-3xl flex flex-col p-10 items-center justify-center max-w-[300px] shadow-lg hover:shadow-black cursor-pointer`}>
						<p className="font-semibold text-text text-4xl drop-shadow-lg">Add a new product</p>
					</div>
					<ProductCard name="Nike Dunk Low Diffused Taupe" id="092839283" price="$108.99" image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
					<ProductCard name="Nike Dunk Low Diffused Taupe" id="092839283" price="$108.99" image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
					<ProductCard name="Nike Dunk Low Diffused Taupe" id="092839283" price="$108.99" image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
					<ProductCard name="Nike Dunk Low Diffused Taupe" id="092839283" price="$108.99" image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
					<ProductCard name="Nike Dunk Low Diffused Taupe" id="092839283" price="$108.99" image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
					<ProductCard name="Nike Dunk Low Diffused Taupe" id="092839283" price="$108.99" image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
				</div>
				<p className="font-semibold  text-text pt-5 text-3xl">Recent Sales</p>
				<div className="flex pt-5 gap-10 overflow-x-scroll">
					<ProductCard name="Nike Dunk Low Diffused Taupe" id="092839283" price="$108.99" image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
					<ProductCard name="Nike Dunk Low Diffused Taupe" id="092839283" price="$108.99" image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
				</div>
			</div>
		</div>
	)
}

interface ProductCardProps {
	name: string
	id: string
	price: string
	image: string
}
function ProductCard({ name, image }: ProductCardProps) {
	return (
		<div className={`bg-${GRADIENTS["div-gradient"]} rounded-3xl flex flex-col pb-3 items-center justify-center shadow-lg hover:shadow-black px-3 cursor-pointer min-w-[300px] max-w-[300px]`}>
			<img src={image} alt="product image" className="h-fit w-[300px]" />
			<p className="text-text text-xl px-3 pb-3 drop-shadow-lg">{name}</p>
		</div>
	)
}
