import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { GRADIENTS, Roles } from "../shared/constants"
import Button from "../components/Button"
import { DistributorIcon, ManufacturerIcon, RetailerIcon, RightCaretIcon } from "../shared/icons"
import GradientText from "../components/GradientText"
import { Entity, Product, ProductInstance } from "../shared/types"
import { useEffect, useState } from "react"
import { getProductInfo, getSellerById } from "../assets/api/apiCalls"

export default function ProductInfo() {
	const { productId, instanceId } = useParams()
	const [product, setProduct] = useState<Product>()
	const [productInstances, setProductInstances] = useState<ProductInstance[]>([])
	const [currentInstance, setCurrentInstance] = useState<ProductInstance>()
	const [seller, setSeller] = useState<Entity | undefined>()
	const navigate = useNavigate()

	const getSellerByIdWrapper = async () => {
		if (!currentInstance) return
		const res = await getSellerById({ sellerId: currentInstance!.soldById.toString() })
		setSeller(res.data.data)
	}
	useEffect(() => {
		getSellerByIdWrapper()
	}, [currentInstance])

	const getProductInfoWrapper = async () => {
		if (!productId) return

		const res = await getProductInfo({ productId: "1" })
		setProductInstances((_prev) => [...res.productInstances.filter((instance) => instance.id!.toString() !== instanceId?.toString())])
		if (!instanceId) {
			const firstInstanceId = res.productInstances[0].id
			navigate(`/product/${productId}/${firstInstanceId}`)
			return
		}
		setCurrentInstance(res.productInstances.filter((instance) => instance.id!.toString() === instanceId.toString())[0])
		setProduct(res)
	}

	useEffect(() => {
		getProductInfoWrapper()
	}, [productId, instanceId])

	return (
		<div className="bg-background h-screen w-screen overflow-scroll">
			<Navbar showLinks={false} />
			<div className="flex flex-col px-10 pt-36">
				<p className="font-bold text-text text-4xl">Product Info</p>
				<div className="flex gap-10 justify-between">
					<div className="flex w-full justify-evenly">
						<img src="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" alt="product image" className="h-fit w-fit" />
						<div className="flex flex-col mx-3 gap-10">
							<span className="flex flex-col gap-2">
								<p className="font-semibold text-text text-4xl">{product?.name}</p>
								<GradientText text={`Sold by ${seller?.companyName}`} className="text-xl" />
							</span>
							<p className="text-text text-xl">{product?.description}</p>
							<div className="flex w-full gap-3 items-center justify-between">
								<GradientText text={`$${currentInstance?.price.toFixed(2)}`} className="text-5xl" />
								<Button text="Buy" className="w-fit" />
							</div>
						</div>
					</div>
					<div className={`rounded-xl p-4 bg-${GRADIENTS["div-gradient"]} flex items-center flex-col`}>
						<p className="font-semibold text-text text-nowrap pb-2 text-2xl">Other Products</p>
						<div className="flex flex-col gap-2">
							<div className="bg-background rounded-xl cursor-pointer grid py-1 px-3 gap-5 grid-cols-[1fr_3fr_2fr_1fr] box-shadow-lg place-items-center">
								<p className="font-semibold text-text text-md text-nowrap">Id</p>
								<p className="font-semibold text-text text-md text-nowrap">Sold By</p>
								<p className="font-semibold text-text text-md text-nowrap">Price</p>
								<RightCaretIcon className="h-4 fill-text text-nowrap w-4 invisible" />
							</div>
							{productInstances?.map((productInstance: ProductInstance) => (
								<OtherProductTab soldById={productInstance.soldById!} key={productInstance.id!} id={productInstance.id!} price={productInstance.price.toFixed(2)} />
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
					<p className="text-text text-xl">{currentInstance?.id}</p>
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
	soldById: string
}
const OtherProductTab = ({ id, price, soldById }: OtherProductTabProps) => {
	const navigate = useNavigate()
	const [seller, setSeller] = useState<Entity | undefined>()

	const getSellerByIdWrapper = async () => {
		const res = await getSellerById({ sellerId: soldById })
		setSeller(res.data.data)
	}
	useEffect(() => {
		getSellerByIdWrapper()
	}, [soldById])

	return (
		<div
			className="bg-background rounded-xl cursor-pointer grid py-1 px-3 gap-5 grid-cols-[1fr_3fr_2fr_1fr] box-shadow-lg place-items-center"
			onClick={() => {
				navigate(`/product/1/${id}`)
			}}
		>
			<p className="font-semibold text-text text-md text-nowrap">{id}</p>
			<p className="font-semibold text-text text-md text-nowrap">{seller?.companyName}</p>
			<GradientText text={`$${price}`} className="text-md text-nowrap" />
			<RightCaretIcon className="h-4 fill-text text-nowrap w-4" />
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
