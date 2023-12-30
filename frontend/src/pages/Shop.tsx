import React from "react"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import { Roles } from "../shared/constants"

export default function Shop() {
	const scroll = (ref: React.MutableRefObject<HTMLDivElement | null>, direction: "left" | "right") => {
		if (!ref.current) return
		if (direction === "left") {
			ref.current.scrollLeft -= 500 // Change 300 to the amount you want to scroll
		} else {
			ref.current.scrollLeft += 500 // Change 300 to the amount you want to scroll
		}
	}
	const recentlyAddedProductRef = React.useRef<HTMLDivElement | null>(null)
	const recentlySoldProductRef = React.useRef<HTMLDivElement | null>(null)
	return (
		<div className="bg-background h-screen w-screen pb-20 overflow-y-scroll">
			<Navbar showLinks={false} role={Roles.MANUFACTURER} />
			<div className="mt-36 px-10">
				<GradientText text="Your Products" className="text-4xl " />
				<span className="flex w-full justify-between items-center">
					<p className="font-semibold  text-text pt-5 text-3xl">Recently Added Products</p>
					<span className="flex gap-5 items-center">
						<p className="cursor-pointer text-text text-3xl select-none" onClick={() => scroll(recentlyAddedProductRef, "left")}>
							{"<"}
						</p>
						<p className="cursor-pointer text-text text-3xl select-none" onClick={() => scroll(recentlyAddedProductRef, "right")}>
							{">"}
						</p>
					</span>
				</span>
				<div className="flex py-10 pt-5 gap-10 overflow-x-scroll scrollbar-none scroll-smooth  " ref={recentlyAddedProductRef}>
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
				<span className="flex w-full justify-between items-center">
					<p className="font-semibold  text-text pt-5 text-3xl">Recent Sales</p>
					<span className="flex gap-5 items-center">
						<p className="cursor-pointer text-text text-3xl select-none" onClick={() => scroll(recentlySoldProductRef, "left")}>
							{"<"}
						</p>
						<p className="cursor-pointer text-text text-3xl select-none" onClick={() => scroll(recentlySoldProductRef, "right")}>
							{">"}
						</p>
					</span>
				</span>
				<div className="flex py-10 pt-5 gap-10 overflow-x-scroll scrollbar-none scroll-smooth" ref={recentlySoldProductRef}>
					<ProductCard name="Nike Dunk Low Diffused Taupe" id="092839283" price="$108.99" image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
					<ProductCard name="Nike Dunk Low Diffused Taupe" id="092839283" price="$108.99" image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
				</div>
			</div>
		</div>
	)
}
