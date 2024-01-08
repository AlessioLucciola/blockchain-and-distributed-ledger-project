import React, { useEffect, useRef, useState } from "react"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import { ProductStage, Roles } from "../shared/constants"
import CreateProductModal from "../components/CreateProductModal"
import { useSessionContext } from "../context/exportContext"
import MessagePage from "./MessagePage"
import { useNavigate } from "react-router-dom"
import { ProductInstance } from "../shared/types"
import { changeProductOnSale, getProductInstancesFromSeller } from "../assets/api/apiCalls"
import Button from "../components/Button"
import InputField from "../components/InputField"
import { getProductStageFromId, getStageNameString } from "../utils/typeUtils"

export default function Shop() {
	const [showCreateProductModal, setShowCreateProductModal] = useState(false)
	const navigate = useNavigate()
	const sessionContext = useSessionContext()
	const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(undefined)
	const [myProducts, setMyProducts] = useState<ProductInstance[]>([])
	const searchRef = useRef<HTMLInputElement | null>(null)
    const [search, setSearch] = useState<string>("")

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
		console.log(res)
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
		if (sessionContext.entityInfo?.role === Roles.CUSTOMER) {
			setIsAuthorized(false)
		}

		if (sessionContext.entityInfo?.id) {
			getMyProducts()
		}
	}, [sessionContext, showCreateProductModal===false])

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
					{sessionContext.entityInfo?.role === Roles.MANUFACTURER ? (
						<div className={`bg-accent rounded-3xl flex flex-col p-10 items-center justify-center max-w-[300px] shadow-lg hover:shadow-black cursor-pointer`}>
							<p className="font-semibold text-text text-4xl drop-shadow-lg" onClick={() => setShowCreateProductModal(true)}>
								Add a new product
							</p>
						</div>
					) : ""}

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
				<span className="flex flex-col w-full justify-between">
					<p className="font-semibold  text-text pt-5 text-3xl">Owned Products</p>
					<div className="pt-5">
                        <InputField name={"Product Name"} type={"text"} ref={searchRef} onChange={() => {setSearch(searchRef.current?.value!)}}/>
                        <div className="flex flex-col gap-2 pt-10">
                            {myProducts.filter((instance => instance.product?.name.toLowerCase().includes(search.toLowerCase()))).map((instance) => (
                                <div key={instance.id}>
                                	<OwnedProductCard name={instance.product?.name} id={instance.id} uid={instance.product?.uid} price={instance.price.toString()} productStage={instance.productState.toString()} owner={instance.previousOwner} image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
								</div>
							))}
                        </div>
                    </div>
				</span>
			</div>
		</div>
	)
}

interface OwnedProductCardProps {
	name: string | undefined
	uid: string | undefined
    id: string | undefined
    owner: string | undefined
	productStage: string | undefined
	price: string | undefined
	image: string
}
function OwnedProductCard({ name, id, uid, productStage, owner, price, image }: OwnedProductCardProps) {
    const navigate = useNavigate()
	const [updatedProductStage, setUpdatedProductStage] = useState<ProductStage>()

	const changeOnSale = async (productInstanceId: string | undefined) => {
		if (productInstanceId === undefined) return
		const res = await changeProductOnSale({ productInstanceId: Number(productInstanceId) })
		if (res === undefined || res.status !== 200) {
			alert("Error fetching products")
			return
		} else {
			alert("Product is now on sale")
			setUpdatedProductStage(ProductStage.ON_SALE)
			return
		}
	}

	useEffect(() => {
		if (productStage === undefined) return
        setUpdatedProductStage(getProductStageFromId(productStage))
    }, [])

	return (
		<div className="flex gap-5">
			<img src={image} alt="product image" className="h-fit w-[200px]" />
			<div className="flex flex-row gap-10 justify-between">
				<div className="flex flex-col h-full justify-around">
					<p className="font-semibold text-text text-xl drop-shadow-lg">{name}</p>
                    <span className="flex gap-2 items-center">
						<p className="font-semibold text-text text-xl drop-shadow-lg">Status:</p>
						<GradientText text={getStageNameString(updatedProductStage!) ?? "Unknown"} className="text-xl" />
					</span>
                    <span className="flex gap-2 items-center">
						<p className="font-semibold text-text text-xl drop-shadow-lg">Price</p>
						<GradientText text={"€"+price} className="text-xl" />
					</span>
				</div>
				<div className="flex flex-col gap-3 flex-end h-full justify-around">
                    <Button text="Details" className={`p-2 font-semibold`} onClick={() => navigate(`/product/${uid}`)}/>
					{productStage !== undefined && (updatedProductStage === ProductStage.PRODUCED || updatedProductStage === ProductStage.RECEIVED) ? (
						<Button text="Change on sale" className={`p-2 font-semibold`} onClick={() => changeOnSale(id)}/>
					) : ""}
					{productStage !== undefined && updatedProductStage === ProductStage.PURCHASED ? (
						<Button text="Ship product" className={`p-2 font-semibold`} />
					) : ""}
				</div>
			</div>
		</div>
	)
}

