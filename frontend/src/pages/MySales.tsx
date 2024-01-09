import { useEffect, useRef, useState } from "react"
import Button from "../components/Button"
import GradientText from "../components/GradientText"
import InputField from "../components/InputField"
import Navbar from "../components/Navbar"
import { ProductStage, Roles } from "../shared/constants"
import { Entity, ProductInstance } from "../shared/types"
import { useNavigate } from "react-router-dom"
import { getSellerById, getSoldProducts, shipProductToEntity } from "../assets/api/apiCalls"
import { useSessionContext } from "../context/exportContext"
import { getEntityRole } from "../assets/api/contractCalls"
import { getProductStageFromId } from "../utils/typeUtils"

export default function MySales() {
	const navigate = useNavigate()
	const sessionContext = useSessionContext()
	const searchRef = useRef<HTMLInputElement | null>(null)
    const [search, setSearch] = useState<string>("")
	const [salesList, setSalesList] = useState<ProductInstance[]>([])

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
        const res = await getSoldProducts( { id: parseInt(sessionContext.entityInfo?.id!)} )

        if (res.status === 200) {
            const products = res.data.data
            setSalesList(products)
        }
    }
	
	return (
		<div className="bg-background h-screen w-screen pb-20 overflow-y-scroll">
			<Navbar showLinks={false} />
			<div className="mt-36 px-10">
				<GradientText text="My Sales" className="text-4xl" />
				<div className="pt-5">
					<InputField name={"Product Name"} type={"text"} ref={searchRef} onChange={() => {setSearch(searchRef.current?.value!)}}/>
					<div className="flex flex-col gap-2 pt-10">
						{salesList.filter((instance => instance.product?.name.toLowerCase().includes(search.toLowerCase()))).map((instance) => (
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
	const [productStatus, setProductStatus] = useState<string>("")
	const [productShipped, setproductShipped] = useState<boolean>(false)
	const [newOwnerInfo, setNewOwnerInfo] = useState<Entity | undefined>()

	const productToShip = (product: ProductInstance): boolean => {
		if (product.previousOwner === sessionContext.entityInfo?.id! && getProductStageFromId(product.productState.toString()) === ProductStage.PURCHASED && !productShipped) {
			return true
		}
		return false
	}

	const getNewOwnerById = async (product: ProductInstance) => {
		const currentRole = await getEntityRole()
		let newOwnerId
		if (currentRole === "manufacturer") {
			newOwnerId = product.distributorId
		} else if (currentRole === "distributor") {
			newOwnerId = product.retailerId
		} else if (currentRole === "retailer") {
			newOwnerId = product.customerId
		}
		const res = await getSellerById({ sellerId: newOwnerId! })
		if (res.status === 200) {
			const entityInfo = res.data.data
			setNewOwnerInfo(entityInfo)
			return
		}
	}

	const getProductStatus = async (product: ProductInstance) => {
		if (newOwnerInfo === undefined) return "Unknown"
		const currentProductStatus = getProductStageFromId(product.productState.toString())
		const newOwnerName = newOwnerInfo.role === Roles.CUSTOMER ? newOwnerInfo.name + ' ' + newOwnerInfo.surname : newOwnerInfo.companyName
		if (product.previousOwner === sessionContext.entityInfo?.id! && currentProductStatus === ProductStage.PURCHASED) {
			setProductStatus(`Purchased from ${newOwnerName}. Waiting for shipping..`)
		} else {
			setProductStatus(`Shipped to ${newOwnerName}`)
		}
	}

	const shipProduct = async (productInstanceId: string, newOwner: Entity ) => {
		const res = await shipProductToEntity({ productInstanceId: parseInt(productInstanceId), newOwnerAddress: newOwner.metamaskAddress })
		if (res === undefined || res.status !== 200) {
			alert("Error changing product state")
			return
		} else {
			alert(`Product is now shipped to ${newOwner.role === Roles.CUSTOMER ? newOwner.name + ' ' + newOwner.surname : newOwner.companyName}`)
			setproductShipped(true)
			return
		}
	}

    useEffect(() => {
        getNewOwnerById(product)
    }, [])

	useEffect(() => {
		getProductStatus(product)
    }, [newOwnerInfo, productShipped])

	return (
		<div className="flex gap-5">
			<img src={image} alt="product image" className="h-fit w-[200px]" />
			<div className="flex flex-row gap-10 justify-between">
				<div className="flex flex-col h-full justify-around">
					<p className="font-semibold text-text text-xl drop-shadow-lg">{product.product?.name}</p>
                    <span className="flex gap-2 items-center">
                        <p className="font-semibold text-text text-xl drop-shadow-lg">Sold to</p>
                        <GradientText text={newOwnerInfo?.role === Roles.CUSTOMER && newOwnerInfo !== undefined ? newOwnerInfo.name + ' ' + newOwnerInfo.surname : newOwnerInfo?.companyName || 'Unknown'} className="text-xl" />
                    </span>
					<span className="flex gap-2 items-center">
						<p className="font-semibold text-text text-xl drop-shadow-lg">Status</p>
						<GradientText text={productStatus!} className="text-xl" />
					</span>
                    <span className="flex gap-2 items-center">
						<p className="font-semibold text-text text-xl drop-shadow-lg">Selling price</p>
						<GradientText text={"€"+product.price} className="text-xl" />
					</span>
				</div>
				<div className="flex flex-col gap-3 flex-end h-full justify-around">
                    <Button text="Details" className={`p-2 font-semibold`} onClick={() => navigate(`/product/${product.product?.uid}`)}/>
					{productToShip(product) ? (
						<Button text="Ship Product" className={`p-2 font-semibold`} onClick={() => shipProduct(product.id!, newOwnerInfo!)} />
					) : ""}
				</div>
			</div>
		</div>
	)
}
