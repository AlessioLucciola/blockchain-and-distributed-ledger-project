import { useEffect, useRef, useState } from "react"
import Button from "../components/Button"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import { useSessionContext } from "../context/exportContext"
import { useNavigate } from "react-router-dom"
import { Entity, ProductInstance } from "../shared/types"
import { getOrders, getSellerById, receiveProductFromEntity } from "../assets/api/apiCalls"
import InputField from "../components/InputField"
import { getEntityRole } from "../assets/api/contractCalls"
import { ProductStage, Roles } from "../shared/constants"
import { getProductStageFromId } from "../utils/typeUtils"
import MessagePage from "./MessagePage"

export default function MyOrders() {
	const navigate = useNavigate()
	const sessionContext = useSessionContext()
	const [isAuthorized, setIsAuthorized] = useState<boolean>(true)
	const [ordersList, setOrdersList] = useState<ProductInstance[]>([])
	const searchRef = useRef<HTMLInputElement | null>(null)
    const [search, setSearch] = useState<string>("")

	useEffect(() => {
		if (!sessionContext.loading && sessionContext.entityInfo == undefined) {
			navigate("/login")
		}
		if (sessionContext.entityInfo?.role === Roles.MANUFACTURER) {
			setIsAuthorized(false)
		}
	}, [sessionContext])

	useEffect(() => {
        getProductList()
    }, [])

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
    
	const getProductList = async () => {
		if (!sessionContext.entityInfo?.id === undefined) return
		console.log(sessionContext.entityInfo?.id)
        const res = await getOrders( { id: parseInt(sessionContext.entityInfo?.id!)} )
        console.log(res)

        if (res.status === 200) {
            const products = res.data.data
            setOrdersList(products)
        }
    }

	return (
		<div className="bg-background h-screen w-screen pb-20 overflow-y-scroll">
			<Navbar showLinks={false} />
			<div className="mt-36 px-10">
				<Button text="+ Place a new order" onClick={() => navigate('/purchaseProduct')} />
			</div>
			<div className="mt-10 px-10">
				<GradientText text="My Orders" className="text-4xl" />
				<div className="pt-5">
					<InputField name={"Product Name"} type={"text"} ref={searchRef} onChange={() => {setSearch(searchRef.current?.value!)}}/>
					<div className="flex flex-col gap-2 pt-10">
						{ordersList.filter((instance => instance.product?.name.toLowerCase().includes(search.toLowerCase()))).map((instance) => (
							<div key={instance.id}>
								<OrderCard product={instance} image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
							</div>
						))}
                    </div>
                </div>
			</div>
		</div>
	)
}

interface OrderCardProps {
	product: ProductInstance
    image: string
}
function OrderCard({ product, image }: OrderCardProps) {
    const navigate = useNavigate()
	const sessionContext = useSessionContext()
    const [oldOwnerInfo, setOldOwnerInfo] = useState<Entity>()
	const [newOwnerInfo, setNewOwnerInfo] = useState<Entity>()
	const [productStatus, setProductStatus] = useState<ProductStage>()
	const [productStatusString, setProductStatusString] = useState<string>("")

    useEffect(() => {
        getOldOwnerByIdWrapper()
		if (product.currentOwner !== sessionContext.entityInfo?.id!) {
			getNewOwnerByIdWrapper()
		}
    }, [product])

	useEffect(() => {
		getProductStatus()
	}, [productStatus])
    
    const getOldOwnerByIdWrapper = async () => {
		const currentRole = await getEntityRole()
		let oldOwnerId
		if (currentRole === Roles.DISTRIBUTOR) {
			oldOwnerId = product.manufacturerId
		} else if (currentRole === Roles.RETAILER) {
			oldOwnerId = product.distributorId
		} else if (currentRole === Roles.CUSTOMER) {
			oldOwnerId = product.retailerId
		} else {
			return
		}

		const res = await getSellerById({ sellerId: oldOwnerId })
        if (res.status === 200) {
            setOldOwnerInfo(res.data.data)
            return
        }
	}

	const getNewOwnerByIdWrapper = async () => {
		const currentRole = await getEntityRole()
		let newOwnerId
		if (currentRole === Roles.MANUFACTURER) {
			newOwnerId = product.distributorId
		} else if (currentRole === Roles.DISTRIBUTOR) {
			newOwnerId = product.retailerId
		} else if (currentRole === Roles.RETAILER) {
			newOwnerId = product.customerId
		} else {
			return
		}

		const res = await getSellerById({ sellerId: newOwnerId })
        if (res.status === 200) {
            setNewOwnerInfo(res.data.data)
            return
        }
	}

	const waitingForProduct = (product: ProductInstance): boolean => {
		if (product.currentOwner === sessionContext.entityInfo?.id! && product.productState.toString() === "3") {
			return true
		}
		return false
	}

	const getProductStatus = async () => {
		let productStatusString = ""
		if (product.currentOwner === sessionContext.entityInfo?.id!) {
			const oldOwnerCompanyName = oldOwnerInfo?.companyName
			const currentProductState = getProductStageFromId(product.productState.toString())
			if (currentProductState === ProductStage.PURCHASED) {
				productStatusString = `Purchased from ${oldOwnerCompanyName}. Waiting for shipping..`
			} else if (currentProductState === ProductStage.SHIPPED) {
				productStatusString = `Shipped from ${oldOwnerCompanyName}. Your product is on the way..`
			} else {
				productStatusString = `Received from ${oldOwnerCompanyName}.`
			}
		} else {
			const newOwnerCompanyName = newOwnerInfo?.companyName
			productStatusString = `Sold to ${newOwnerCompanyName}`
		}
		setProductStatusString(productStatusString)
	}

	const receiveProduct = async (productInstanceId: string) => {
		const res = await receiveProductFromEntity({ productInstanceId: parseInt(productInstanceId) })
		if (res.status === 200) {
			alert(`Product received`)
			setProductStatus(ProductStage.RECEIVED)
			return
		} else {
			alert("Error changing product state")
			return
		}
	}

	return (
		<div className="flex gap-5">
			<img src={image} alt="product image" className="h-fit w-[200px]" />
			<div className="flex flex-row gap-10 justify-between">
				<div className="flex flex-col h-full justify-around">
					<p className="font-semibold text-text text-xl drop-shadow-lg">{product.product?.name}</p>
                    <span className="flex gap-2 items-center">
                        <p className="font-semibold text-text text-xl drop-shadow-lg">Purchased from</p>
                        <GradientText text={oldOwnerInfo?.companyName!} className="text-xl" />
                    </span>
					<span className="flex gap-2 items-center">
						<p className="font-semibold text-text text-xl drop-shadow-lg">Status</p>
						<GradientText text={productStatusString} className="text-xl" />
					</span>
                    <span className="flex gap-2 items-center">
						<p className="font-semibold text-text text-xl drop-shadow-lg">Price</p>
						<GradientText text={"€"+product.price} className="text-xl" />
					</span>
				</div>
				<div className="flex flex-col gap-3 flex-end h-full justify-around">
                    <Button text="Details" className={`p-2 font-semibold`} onClick={() => navigate(`/product/${product.product?.uid}`)}/>
					{waitingForProduct(product) ? (
						<Button text="Product Received" className={`p-2 font-semibold`} onClick={() => receiveProduct(product?.id!)} />
					) : ""}
				</div>
			</div>
		</div>
	)
}
