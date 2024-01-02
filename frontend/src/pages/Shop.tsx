import React, { useEffect, useState } from "react"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import { Roles } from "../shared/constants"
import CreateProductModal from "../components/CreateProductModal"
import { useSessionContext } from "../context/exportContext"
import MessagePage from "./MessagePage"
import { useNavigate } from "react-router-dom"
import { Product, ProductInstance } from "../shared/types"
import { getProductInstancesFromSeller } from "../assets/api/apiCalls"

export default function Shop() {
	const [showCreateProductModal, setShowCreateProductModal] = useState(false)
	const navigate = useNavigate()
	const sessionContext = useSessionContext()
	const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(undefined)
	const [myProducts, setMyProducts] = useState<ProductInstance[]>([])
	const [mySales, setMySales] = useState<Product[]>([])

	const recentlySoldProductRef = React.useRef<HTMLDivElement | null>(null)
	const recentlyAddedProductRef = React.useRef<HTMLDivElement | null>(null)

	const scroll = (ref: React.MutableRefObject<HTMLDivElement | null>, direction: "left" | "right") => {
		if (!ref.current) return
		if (direction === "left") {
			ref.current.scrollLeft -= 500 // Change 300 to the amount you want to scroll
		} else {
			ref.current.scrollLeft += 500 // Change 300 to the amount you want to scroll
		}
	}

	const getMyProducts = async () => {
		const res = await getProductInstancesFromSeller({ sellerId: sessionContext.entityInfo?.id! })
		if (res.status !== 200) {
			alert("Error fetching products")
			return
		}
		setMyProducts(res.data.data)
	}

	useEffect(() => {
		if (!sessionContext.loading && sessionContext.entityInfo == undefined) {
			navigate("/login")
		}
		console.log(sessionContext)
		if (sessionContext.entityInfo?.role === Roles.CUSTOMER) {
			setIsAuthorized(false)
		}
		getMyProducts()
	}, [sessionContext])

	if (isAuthorized === false) {
		return (
			<MessagePage
				message="You are not authorized to view this page"
				buttons={[
					{
						text: "Go to Home",
						onClick: () => navigate("/"),
					},
				]}
			/>
		)
	}

	return (
		<div className="bg-background h-screen w-screen pb-20 overflow-y-scroll">
			<Navbar
				role={Roles.MANUFACTURER}
				overrideLinks={[
					{
						name: "Logout",
						action: sessionContext.logout,
					},
				]}
			/>
			<CreateProductModal showModal={showCreateProductModal} setShowModal={setShowCreateProductModal} />
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
						<p className="font-semibold text-text text-4xl drop-shadow-lg" onClick={() => setShowCreateProductModal(true)}>
							Add a new product
						</p>
					</div>

					{myProducts.map(({ product, price }) => (
						<ProductCard
							name={product!.name}
							id={product!.uid!}
							price={price.toFixed(2)}
							image={"/src/assets/placeholders/nike-dunk-low-diffused-taupe.png"}
							key={product!.uid!}
							onClick={() => navigate(`/product/${product!.uid!}`)}
						/>
					))}
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
