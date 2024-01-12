import React, { useEffect, useRef, useState } from "react"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import { ProductStage, Roles } from "../shared/constants"
import CreateProductModal from "../components/CreateProductModal"
import { useSessionContext } from "../context/exportContext"
import MessagePage from "./MessagePage"
import { useNavigate } from "react-router-dom"
import { Entity, ProductInstance } from "../shared/types"
import { changeProductOnSale, changeProductNotOnSale, getProductInstancesFromSeller, getSellerById, shipProductToEntity } from "../assets/api/apiCalls"
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
				{sessionContext.entityInfo?.role === Roles.MANUFACTURER ? (
					<>
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
					</>
				) : ""}
				<span className="flex flex-col w-full justify-between">
					<p className="font-semibold  text-text pt-5 text-3xl">Owned Products</p>
					<div className="pt-5">
                        <InputField name={"Product Name"} type={"text"} ref={searchRef} onChange={() => {setSearch(searchRef.current?.value!)}}/>
                        <div className="flex flex-col gap-2 pt-10">
                            {myProducts.filter((instance => instance.product?.name.toLowerCase().includes(search.toLowerCase()))).map((instance) => (
                                <div key={instance.id}>
									<OwnedProductCard product={instance} image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
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
	product: ProductInstance
	image: string
}
function OwnedProductCard({ product, image }: OwnedProductCardProps) {
    const navigate = useNavigate()
	const [updatedProductStage, setUpdatedProductStage] = useState<ProductStage>()
	const [newOwnerInfo, setNewOwnerInfo] = useState<Entity>()

	const changeOnSale = async (productInstanceId: string, onSale: boolean) => {
		if (onSale === true) {
			const res = await changeProductOnSale({ productInstanceId: parseInt(productInstanceId) })
			if (res === undefined || res.status !== 200) {
				alert("Error changing product state")
				return
			} else {
				alert("Product is now on sale")
				setUpdatedProductStage(ProductStage.ON_SALE)
				return
			}
		} else {
			const res = await changeProductNotOnSale({ productInstanceId: parseInt(productInstanceId) })
			if (res === undefined || res.status !== 200) {
				alert("Error changing product state")
				return
			} else {
				alert("Product is now NOT on sale")
				setUpdatedProductStage(ProductStage.NOT_ON_SALE)
				return
			}
		}
	}

	const getBuyerByIdWrapper = async (currentOwner: string) => {
		const res = await getSellerById({ sellerId: currentOwner })
        if (res.status === 200) {
            setNewOwnerInfo(res.data.data)
            return
        }
	}

	const shipProduct = async (productInstanceId: string, newOwner: Entity ) => {
		const res = await shipProductToEntity({ productInstanceId: parseInt(productInstanceId), newOwnerAddress: newOwner.metamaskAddress })
		if (res === undefined || res.status !== 200) {
			alert("Error changing product state")
			return
		} else {
			alert(`Product is now shipped to ${newOwner.role === Roles.CUSTOMER ? newOwner.name + ' ' + newOwner.surname : newOwner.companyName}`)
			setUpdatedProductStage(ProductStage.ON_SALE)
			return
		}
	}

	useEffect(() => {
        setUpdatedProductStage(getProductStageFromId(product.productState.toString()))
		getBuyerByIdWrapper(product.currentOwner)
    }, [])

	return (
		<div className="flex flex-row justify-between items-center">
			<div className="flex gap-10">
				<img src={image} alt="product image" className="h-fit w-[200px]" />
				<div className="flex flex-col justify-around">
					<p className="font-semibold text-text text-xl drop-shadow-lg">{product.product?.name}</p>
                    <span className="flex gap-2 items-center">
						<p className="font-semibold text-text text-xl drop-shadow-lg">Status:</p>
						<GradientText text={getStageNameString(updatedProductStage!)} className="text-xl" />
					</span>
                    <span className="flex gap-2 items-center">
						<p className="font-semibold text-text text-xl drop-shadow-lg">Price</p>
						<GradientText text={"€"+product.price} className="text-xl" />
					</span>
				</div>
			</div>
			<div className="flex flex-col justify-around">
				<Button text="Details" className={`p-2 font-semibold`} onClick={() => navigate(`/product/${product.product?.uid}`)}/>
				{product.productState !== undefined && (updatedProductStage === ProductStage.PRODUCED || updatedProductStage === ProductStage.RECEIVED || updatedProductStage === ProductStage.NOT_ON_SALE) ? (
					<Button text="Change on sale" className={`p-2 font-semibold`} onClick={() => changeOnSale(product.id!, true)}/>
				) : ""}
				{product.productState !== undefined && (updatedProductStage === ProductStage.ON_SALE) ? (
					<Button text="Remove from sale" className={`p-2 font-semibold`} onClick={() => changeOnSale(product.id!, false)}/>
				) : ""}
				{product !== undefined && updatedProductStage === ProductStage.PURCHASED ? (
					<Button text="Ship product" className={`p-2 font-semibold`} onClick={() => shipProduct(product.id!, newOwnerInfo!)}/>
				) : ""}
			</div>
		</div>
	)
}

