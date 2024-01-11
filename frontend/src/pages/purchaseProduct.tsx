import React, { useEffect, useRef, useState } from "react"
import Button from "../components/Button"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import { useSessionContext } from "../context/exportContext"
import { ProductInstance } from "../shared/types"
import { getProductsOnSale, getSellerById, purchaseProductByEntity } from "../assets/api/apiCalls"
import InputField from "../components/InputField"
import { Roles } from "../shared/constants"
import MessagePage from "./MessagePage"

export default function MyOrders() {
    const navigate = useNavigate()
	const sessionContext = useSessionContext()
    const [isAuthorized, setIsAuthorized] = useState<boolean>(true)
    const nameRef = useRef<HTMLInputElement | null>(null)
    const [search, setSearch] = useState<string>("")
    const [productList, setProductList] = useState<ProductInstance[]>([])

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
    
	const getProductList = async () => {
        const res = await getProductsOnSale()
        console.log(res)

        if (res.status === 200) {
            const products = res.data.data
            setProductList(products)
        }
    }

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
		<div className="bg-background h-screen w-screen overflow-y-scroll">
			<Navbar showLinks={false} />
			<div className="mt-36 px-10">
				<GradientText text="Product Purchase" className="text-4xl" />
                <div className="pt-5">
                    <p className="text-white">Purchase a certified product with SmartSupply. Find the product you like by typing the name:</p>
                    <div className="pt-5">
                        <InputField name={"Product Name"} type={"text"} ref={nameRef} onChange={() => {setSearch(nameRef.current?.value!)}}/>
                        <div className="flex flex-col gap-2 pt-10">
                            {productList.filter((instance => instance.product?.name.toLowerCase().includes(search.toLowerCase()))).map((instance) => (
                                <div key={instance.id}>
                                    <PurchaseCard product={instance} buyer={sessionContext.entityInfo?.id!} image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
			</div>
		</div>
	)
}

interface PurchaseCardProps {
	product: ProductInstance
    buyer?: string
    image: string
}
function PurchaseCard({ product, buyer, image }: PurchaseCardProps) {
    const navigate = useNavigate()
    const [entityName, setEntityName] = useState<string | undefined>("")
    
    const getSellerByIdWrapper = async () => {
		const res = await getSellerById({ sellerId: product.currentOwner })
        if (res.status === 200) {
            setEntityName(res.data.data.companyName)
            return
        }
	}

    const purchaseProduct = async (instance: ProductInstance) => {
        if (buyer === undefined || instance.id === undefined) return
        const res = await purchaseProductByEntity({ productInstanceId: parseInt(instance.id), buyerId: parseInt(buyer), oldOwnerId: parseInt(instance.currentOwner!) })
        if (res.status === 200) {
            alert(`Product ${instance.product?.name} purchased successfully from ${entityName}!`)
            navigate('/orders')
            return
        } else {
            alert(`Something went wrong while purchasing product ${instance.product?.name} from ${entityName}!`)
            return
        }
    }

    useEffect(() => {
        getSellerByIdWrapper()
    }, [product])

	return (
		<div className="flex flex-row justify-between items-center">
            <div className="flex gap-10">
                <img src={image} alt="product image" className="h-fit w-[200px]" />
                <div className="flex flex-col justify-around">
                    <p className="font-semibold text-text text-xl drop-shadow-lg">{product.product?.name}</p>
                    <span className="flex gap-2 items-center">
                        <p className="font-semibold text-text text-xl drop-shadow-lg">Sold by</p>
                        <GradientText text={entityName !== undefined ? entityName : "Unknown"} className="text-xl" />
                    </span>
                    <span className="flex gap-2 items-center">
                        <p className="font-semibold text-color-black text-text text-xl drop-shadow-lg">Price</p>
                        <GradientText text={"€"+product.price} className="text-xl" />
                    </span>
                    <span className="cursor-pointer select-none" onClick={() => navigate(`/product/${product.product?.uid}`)}>
                        <GradientText text={"Details >"} className="text-xl" />
                    </span>
                </div>
            </div>
            <div>
                <div className="flex flex-col gap-3 justify-around">
                    <Button text="Buy Product" className={`p-2 font-semibold`} onClick={() => purchaseProduct(product)} />
                </div>
            </div>
        </div>
	)
}
