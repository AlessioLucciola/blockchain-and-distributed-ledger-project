import { useEffect, useRef, useState } from "react"
import Button from "../components/Button"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import { useSessionContext } from "../context/exportContext"
import { useNavigate } from "react-router-dom"
import { ProductInstance } from "../shared/types"
import { getOrders, getSellerById, receiveProductFromEntity } from "../assets/api/apiCalls"
import InputField from "../components/InputField"
import { getEntityRole, receiveProduct } from "../assets/api/contractCalls"

export default function MyOrders() {
	const navigate = useNavigate()
	const sessionContext = useSessionContext()
	const [ordersList, setOrdersList] = useState<ProductInstance[]>([])
	const searchRef = useRef<HTMLInputElement | null>(null)
    const [search, setSearch] = useState<string>("")

	useEffect(() => {
		if (!sessionContext.entityInfo) {
			navigate("/")
		}
	}, [sessionContext])

	useEffect(() => {
        getProductList()
    }, [])
    
	const getProductList = async () => {
		if (!sessionContext.entityInfo?.id === undefined) return
        const res = await getOrders( { entityId: parseInt(sessionContext.entityInfo?.id!)} )
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
    const [oldOwnerName, setOldOwnerName] = useState<string | undefined>("")
	const [productStatus, setProductStatus] = useState<string | undefined>("")
    
    const getOldOwnerByIdWrapper = async () => {
		const currentRole = await getEntityRole()
		let oldOwnerId
		if (currentRole === "distributor") {
			oldOwnerId = product.manufacturerId
		} else if (currentRole === "retailer") {
			oldOwnerId = product.distributorId
		} else if (currentRole === "customer") {
			oldOwnerId = product.retailerId
		} else {
			return
		}

		const res = await getSellerById({ sellerId: oldOwnerId })
        if (res.status === 200) {
            setOldOwnerName(res.data.data.companyName)
            return
        }
	}

	const waitingForProduct = (product: ProductInstance): boolean => {
		if (product.currentOwner === sessionContext.entityInfo?.id! && product.productState.toString() === "3") {
			return true
		}
		return false
	}

	const getOldOwner = async (product: ProductInstance): Promise<string> => {
		const currentRole = await getEntityRole()
		let oldOwnerId
		if (currentRole === "distributor") {
			oldOwnerId = product.manufacturerId
		} else if (currentRole === "retailer") {
			oldOwnerId = product.distributorId
		} else if (currentRole === "customer") {
			oldOwnerId = product.retailerId
		}
		return oldOwnerId!
	}

	const getNewOwner = async (product: ProductInstance): Promise<string> => {
		const currentRole = await getEntityRole()
		let newOwnerId
		if (currentRole === "manufacturer") {
			newOwnerId = product.distributorId
		} else if (currentRole === "distributor") {
			newOwnerId = product.retailerId
		} else if (currentRole === "retailer") {
			newOwnerId = product.customerId
		}
		return newOwnerId!
	}


	const getProductStatus = async (product: ProductInstance): Promise<string> => {
		if (product.currentOwner === sessionContext.entityInfo?.id!) {
			const oldOwnerId = await getOldOwner(product)
			const res = await getSellerById({ sellerId: oldOwnerId! })
			if (res.status === 200) {
				const oldOwnerName = res.data.data.companyName
				if (product.productState.toString() === "2") {
					return `Purchased from ${oldOwnerName}. Waiting for shipping..`
				} else if (product.productState.toString() === "3") {
					return `Shipped from ${oldOwnerName}. Your product is on the way..`
				} else {
					return `Received from ${oldOwnerName}.`
				}
			}
			return "Unknown"
		} else {
			const newOwnerId = await getNewOwner(product)
			const res = await getSellerById({ sellerId: newOwnerId! })
			if (res.status === 200) {
				const newOwnerName = res.data.data.companyName
				return `Sold to ${newOwnerName}`
			}
			return "Unknown"
		}
	}

	const receiveProduct = async (productInstanceId: string) => {
		const res = await receiveProductFromEntity({ productInstanceId: parseInt(productInstanceId) })
		if (res.status === 200) {
			alert(`Product received`)
			getProductStatus(product).then((status) => setProductStatus(status))
			return
		} else {
			alert("Error changing product state")
			return
		}
	}

    useEffect(() => {
        getOldOwnerByIdWrapper()
		getProductStatus(product).then((status) => setProductStatus(status))
    }, [product])

	return (
		<div className="flex gap-5">
			<img src={image} alt="product image" className="h-fit w-[200px]" />
			<div className="flex flex-row gap-10 justify-between">
				<div className="flex flex-col h-full justify-around">
					<p className="font-semibold text-text text-xl drop-shadow-lg">{product.product?.name}</p>
                    <span className="flex gap-2 items-center">
                        <p className="font-semibold text-text text-xl drop-shadow-lg">Purchased from</p>
                        <GradientText text={oldOwnerName !== undefined ? oldOwnerName : "Unknown"} className="text-xl" />
                    </span>
					<span className="flex gap-2 items-center">
						<p className="font-semibold text-text text-xl drop-shadow-lg">Status</p>
						<GradientText text={productStatus!} className="text-xl" />
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
