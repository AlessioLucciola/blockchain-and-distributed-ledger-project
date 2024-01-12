import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { GRADIENTS } from "../shared/constants"
import Button from "../components/Button"
import { CustomerIcon, DistributorIcon, ManufacturerIcon, RetailerIcon, RightCaretIcon } from "../shared/icons"
import GradientText from "../components/GradientText"
import { Entity, Product, ProductInstance } from "../shared/types"
import { useEffect, useState } from "react"
import { getProductInfo, getSellerById, getVerificationInfoById } from "../assets/api/apiCalls"

export default function ProductInfo() {
	const { productId, instanceId } = useParams()
	const [product, setProduct] = useState<Product>()
	const [productInstances, setProductInstances] = useState<ProductInstance[]>([])
	const [currentInstance, setCurrentInstance] = useState<ProductInstance>()
	const [seller, setSeller] = useState<Entity | undefined>()
	const navigate = useNavigate()

	const getSellerByIdWrapper = async () => {
		if (!currentInstance) return
		const res = await getSellerById({ sellerId: currentInstance!.currentOwner })
		setSeller(res.data.data)
	}

	const getProductInfoWrapper = async () => {
		if (!productId) return

		const res = await getProductInfo({ productId: productId })
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

	useEffect(() => {
		getSellerByIdWrapper()
	}, [currentInstance])

	return (
		<div className="bg-background h-screen w-screen overflow-scroll">
			<Navbar showLinks={false} />
			<div className="flex flex-col px-10 pt-36">
				<p className="font-bold text-text text-4xl">Product Info</p>
				<div className="flex gap-10">
					<div className="flex w-full">
						<img src="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" alt="product image" className="h-fit w-fit" />
						<div className="flex flex-col mx-3 gap-10">
							<span className="flex flex-col gap-2">
								<p className="font-semibold text-text text-4xl">{product?.name}</p>
							</span>
							<p className="text-text text-xl">{product?.description}</p>
							<div className="flex w-full gap-3 items-center justify-between">
								<GradientText text={`$${currentInstance?.price.toFixed(2)}`} className="text-4xl" />
								{/*<Button text="Buy" className="w-fit" />*/}
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
								<OtherProductTab soldById={productInstance.currentOwner!} key={productInstance.id!} id={productInstance.id!} price={productInstance.price.toFixed(2)} />
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
				<HistoryChain manufacturer={currentInstance?.manufacturerId!} distributor={currentInstance?.distributorId!} retailer={currentInstance?.retailerId!} customer={currentInstance?.customerId!}/>
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

interface HistoryChainProps {
	manufacturer: string
	distributor: string
	retailer: string
	customer: string
}
const HistoryChain = ({ manufacturer, distributor, retailer, customer } : HistoryChainProps) => {
	const [manufacturerName, setManufacturerName] = useState<string>()
	const [retailerName, setRetailerName] = useState<string>()
	const [distributorName, setDistributorName] = useState<string>()
	const [customerName, setCustomerName] = useState<string>()
	const [manufacturerVerificationInfo, setManufacturerVerificationInfo] = useState<boolean>()
	const [distributorVerificationInfo, setDistributorVerificationInfo] = useState<boolean>()
	const [retailerVerificationInfo, setRetailerVerificationInfo] = useState<boolean>()

	const getVerificationDetails = async (userID: string) => {
		if (userID !== undefined) {
			const res = await getVerificationInfoById({ userID: userID })
			if (res.status === 200) {
				return res.data.data
			}
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			if (manufacturer !== undefined && manufacturer !== null) {
				const entity_res = await getSellerById({sellerId: manufacturer})
				if (entity_res.status === 200) {
					setManufacturerName(entity_res.data.data.companyName)
					const ver_res = await getVerificationDetails(entity_res.data.data.id!.toString())
					setManufacturerVerificationInfo(ver_res?.verificationPaid)
				}
			}
			if (retailer !== undefined && retailer !== null) {
				const entity_res = await getSellerById({sellerId: retailer})
				setRetailerName(entity_res.data.data.companyName)
				if (entity_res.status === 200) {
					setRetailerName(entity_res.data.data.companyName)
					const ver_res = await getVerificationDetails(entity_res.data.data.id!.toString())
					setRetailerVerificationInfo(ver_res?.verificationPaid)
				}
			}
			if (distributor !== undefined && distributor !== null) {
				const entity_res = await getSellerById({sellerId: distributor})
				if (entity_res.status === 200) {
					setDistributorName(entity_res.data.data.companyName)
					const ver_res = await getVerificationDetails(entity_res.data.data.id!.toString())
					setDistributorVerificationInfo(ver_res?.verificationPaid)
				}
			}
			if (customer !== undefined && customer !== null) {
				const entity_res = await getSellerById({sellerId: customer})
				if (entity_res.status === 200) {
					setCustomerName(entity_res.data.data.name + ' ' + entity_res.data.data.surname)
				}
			}

		}
		fetchData()
	}, [manufacturer, distributor, retailer, customer])

	return (
		<div className="flex gap-3 items-center">
			{manufacturer !== undefined && manufacturer !== null ? (
				<div className="bg-secondary flex flex-col rounded-3xl shadow-lg py-5 px-10 gap-3 items-center">
					<ManufacturerIcon className="h-fit fill-primary w-20" />
					<p className="font-semibold text-text text-2xl">{manufacturerName}</p>
					{manufacturerVerificationInfo && (
						<div className="badge bg-green text-white">Verified</div>
					)}
				</div>
			) : (
				""
			)}
			{distributor !== undefined && distributor !== null ? (
				<>
					<span className="bg-secondary rounded-lg h-1 w-20"></span>
					<div className="bg-secondary flex flex-col rounded-3xl shadow-lg py-5 px-10 gap-3 items-center">
						<DistributorIcon className="h-fit fill-primary w-20" />
						<p className="font-semibold text-text text-2xl">{distributorName}</p>
						{distributorVerificationInfo && (
							<div className="badge bg-green text-white">Verified</div>
						)}
					</div>
				</>
			) : (
				""
			)}
			{retailer !== undefined && retailer !== null ? (
				<>
					<span className="bg-secondary rounded-lg h-1 w-20"></span>
					<div className="bg-secondary flex flex-col rounded-3xl shadow-lg py-5 px-10 gap-3 items-center">
						<RetailerIcon className="h-fit fill-primary w-20" />
						<p className="font-semibold text-text text-2xl">{retailerName}</p>
						{retailerVerificationInfo && (
							<div className="badge bg-green text-white">Verified</div>
						)}
					</div>
				</>
			) : (
				""
			)}
			{customer !== undefined && customer !== null ? (
				<>
					<span className="bg-secondary rounded-lg h-1 w-20"></span>
					<div className="bg-secondary flex flex-col rounded-3xl shadow-lg py-5 px-10 gap-3 items-center">
						<CustomerIcon className="h-fit fill-primary w-20" />
						<p className="font-semibold text-text text-2xl">{customerName}</p>
					</div>
				</>
			) : (
				""
			)}
		</div>
	)
}
