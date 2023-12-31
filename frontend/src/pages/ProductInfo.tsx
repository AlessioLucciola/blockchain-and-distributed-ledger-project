import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { GRADIENTS, Roles } from "../shared/constants"
import Button from "../components/Button"
import { DistributorIcon, ManufacturerIcon, RetailerIcon, RightCaretIcon } from "../shared/icons"
import GradientText from "../components/GradientText"
import { Product, ProductInstance } from "../shared/types"
import { useEffect, useState } from "react"
import { getProductInfo } from "../assets/api/apiCalls"

export default function ProductInfo() {
	const { id: productId } = useParams()
	const [product, setProduct] = useState<Product>()
	const [productInstances, setProductInstances] = useState<ProductInstance[]>([])

	const getProductInfoWrapper = async () => {
		if (!productId) return
		const res = await getProductInfo({ productId: "1" })
		setProductInstances((_prev) => [...res.productInstances])
		setProduct(res)
	}

	useEffect(() => {
		getProductInfoWrapper()
	}, [productId])

	return (
		<div className="bg-background h-screen w-screen overflow-scroll">
			<Navbar role={Roles.CUSTOMER} showLinks={false} />
			<div className="flex flex-col px-10 pt-36">
				<p className="font-bold text-text text-4xl">Product Info</p>
				<div className="flex gap-10 justify-between">
					<div className="flex w-full justify-evenly">
						<img src="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" alt="product image" className="h-fit w-fit" />
						<div className="flex flex-col mx-3 gap-10">
							<p className="font-semibold text-text text-4xl">{product?.name}</p>
							<p className="text-text text-xl">{product?.description}</p>
							<div className="flex w-full gap-3 items-center justify-between">
								<GradientText text={`$${productInstances[0]?.price.toFixed(2)}`} className="text-5xl" />
								<Button text="Buy" className="w-fit" />
							</div>
						</div>
					</div>
					<div className={`rounded-xl p-4 bg-${GRADIENTS["div-gradient"]} flex items-center flex-col`}>
						<p className="font-semibold text-text text-nowrap pb-2 text-2xl">Other Products</p>
						<div className="flex flex-col gap-2">
							{productInstances?.splice(1).map((productInstance: ProductInstance) => (
								<OtherProductTab key={productInstance.id!} id={productInstance.id!} price={productInstance.price.toFixed(2)} />
							))}
						</div>
					</div>
				</div>
				<p className="font-bold text-text text-4xl">Product History</p>
				<div className="flex pt-2 gap-2 items-center">
					<GradientText text="Product ID" className="text-xl" />
					<p className="text-text text-xl">{product?.uid}</p>
				</div>
				<div className="flex pb-5 gap-2 items-center">
					<GradientText text="Model ID" className="text-xl" />
					<p className="text-text text-xl">{product?.productInstances[0].id}</p>
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
