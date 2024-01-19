import React, { useEffect, useRef, useState } from "react"
import Button from "../components/Button"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import { useSessionContext } from "../context/exportContext"
import { Entity, ProductInstance } from "../shared/types"
import { getProductsOnSale, getSellerById, purchaseProductByEntity } from "../assets/api/apiCalls"
import { getCertificationPercentage } from "../assets/api/contractCalls"
import InputField from "../components/InputField"
import { Roles } from "../shared/constants"
import { fetchETHPrice } from "../utils/fetchETHPrice"
import MessagePage from "./MessagePage"
import { getProductPriceByIdentity } from "../utils/typeUtils"
import { getProductImage } from "../utils/renderUtils"

export default function MyOrders() {
    const navigate = useNavigate()
    const [isAuthorized, setIsAuthorized] = useState<boolean>(true)
    const nameRef = useRef<HTMLInputElement | null>(null)
    const [search, setSearch] = useState<string>("")
    const [productList, setProductList] = useState<ProductInstance[]>([])
    const sessionContext = useSessionContext()

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
                                    <PurchaseCard product={instance} buyer={sessionContext?.entityInfo!} image={getProductImage(instance.product?.uid!)} />
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
    buyer: Entity
    image: string
}
function PurchaseCard({ product, buyer, image }: PurchaseCardProps) {
    const navigate = useNavigate()
    const [entityInfo, setEntityInfo] = useState<Entity>()
    const [certificationPrice, setCertificationPrice] = useState<string>()
    const [productPrice, setProductPrice] = useState<string>()

    useEffect(() => {
        getSellerByIdWrapper()
        getPrice()
    }, [product])

    useEffect(() => {
        getCertificationAmount()
    }, [productPrice])

    const getCertificationAmount = async () => {
        let certificationPercentage = await getCertificationPercentage()
        let certificationPrice = (parseInt(productPrice!) * certificationPercentage) / 100

        // Get current eth price in dollars
        let ethPrice = await fetchETHPrice()
        certificationPrice = (certificationPrice / ethPrice.USD)
        setCertificationPrice(certificationPrice.toFixed(5))
    }
    
    const getSellerByIdWrapper = async () => {
		const res = await getSellerById({ sellerId: product.currentOwner })
        if (res.status === 200) {
            const entity = res.data.data
            setEntityInfo(entity)
            return
        }
	}

    const getPrice = async () => {
        const role = buyer?.role
        if (role === Roles.DISTRIBUTOR) {
            const productPrice = getProductPriceByIdentity(product, Roles.MANUFACTURER)
            setProductPrice(productPrice?.toString())
        } else if (role === Roles.RETAILER) {
            const productPrice = getProductPriceByIdentity(product, Roles.DISTRIBUTOR)
            setProductPrice(productPrice?.toString())
        } else if (role === Roles.CUSTOMER) {
            const productPrice = getProductPriceByIdentity(product, Roles.RETAILER)
            setProductPrice(productPrice?.toString())
        }
    }

    const purchaseProduct = async (instance: ProductInstance) => {
        if (buyer !== undefined && instance.id !== undefined) {
            console.log(buyer.id)
            const res = await purchaseProductByEntity({ productInstanceId: parseInt(instance.id), productPrice: parseFloat(productPrice!), certificationPrice: parseFloat(certificationPrice ?? ''), buyerId: parseInt(buyer?.id!), oldOwnerId: parseInt(instance.currentOwner!) })
            if (res.status === 200) {
                alert(`Product ${instance.product?.name} purchased successfully from ${entityInfo!.companyName}!`)
                navigate('/orders')
                return
            } else {
                alert(`Something went wrong while purchasing product ${instance.product?.name} from ${entityInfo!.companyName}!`)
                return
            }
        }
    }

	return (
		<div className="flex flex-row justify-between items-center">
            <div className="flex gap-10">
                <img src={image} alt="product image" className="h-[200px] w-[200px] p-5" />
                <div className="flex flex-col justify-around">
                    <p className="font-semibold text-text text-xl drop-shadow-lg">{product.product?.name}</p>
                    <span className="flex gap-2 items-center">
                        <p className="font-semibold text-text text-xl drop-shadow-lg">Sold by</p>
                        <GradientText text={entityInfo?.companyName!} className="text-xl" />
                    </span>
                    <span className="flex gap-2 items-center">
                        <p className="font-semibold text-color-black text-text text-xl drop-shadow-lg">Price</p>
                        <GradientText text={"$"+productPrice} className="text-xl" />
                    </span>
                    {buyer?.role as Roles === Roles.CUSTOMER && (
                            <span className="flex gap-2 items-center">
                                <p className="font-semibold text-color-black text-text text-xl drop-shadow-lg">Certification price</p>
                                <GradientText text={"ETH"+certificationPrice} className="text-xl" />
                            </span>

                    )}
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
