import React, { useEffect, useRef, useState } from "react"
import Button from "../components/Button"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import { Roles } from "../shared/constants"
import { useNavigate } from "react-router-dom"
import { useSessionContext } from "../context/exportContext"
import { Product } from "../shared/types"
import { searchProduct } from "../assets/api/apiCalls"
import InputField from "../components/InputField"
import { isDistributorByAddress, isManufacturerByAddress, isRetailerByAddress } from "../assets/api/contractCalls"

export default function MyOrders() {
    const navigate = useNavigate()
	const sessionContext = useSessionContext()
    const nameRef = useRef<HTMLInputElement | null>(null)
    const [name, setName] = useState<string>("")
    const [productList, setProductList] = useState<Product[]>([])

	useEffect(() => {
		if (!sessionContext.entityInfo) {
			navigate("/")
		}
	}, [sessionContext])

    useEffect(() => {
        getProductList(name)
    }, [name])
    
	const getProductList = async (name: string) => {
        const res = await searchProduct({ name: name, includeInstances: true })
        console.log(res)

        if (res.status === 200) {
            const products = res.data.data;
            const updatedProducts = await Promise.all(products.map(async (product) => {
                const updatedInstances = await Promise.all(product.productInstances.map(async (instance) => {
                    let previousOwnerRole = Roles.MANUFACTURER
    
                    if (await isManufacturerByAddress(instance.previousOwner)) {
                        previousOwnerRole = Roles.MANUFACTURER
                    } else if (await isDistributorByAddress(instance.previousOwner)) {
                        previousOwnerRole = Roles.DISTRIBUTOR
                    } else if (await isRetailerByAddress(instance.previousOwner)) {
                        previousOwnerRole = Roles.RETAILER
                    }
                    return { ...instance, previousOwnerRole }
                }));
    
                return { ...product, productInstances: updatedInstances }
            }));
    
            setProductList(updatedProducts)
        }
    }

    const getPreviousOwner = () => {
        if (sessionContext.entityInfo?.role === Roles.DISTRIBUTOR) {
            return Roles.MANUFACTURER
        } else if (sessionContext.entityInfo?.role === Roles.RETAILER) {
            return Roles.DISTRIBUTOR
        } else if (sessionContext.entityInfo?.role === Roles.CUSTOMER) {
            return Roles.RETAILER
        }
    }
    
	return (
		<div className="bg-background h-screen w-screen overflow-y-scroll">
			<Navbar showLinks={false} />
			<div className="mt-36 px-10">
				<GradientText text="Product Purchase" className="text-4xl" />
                <div className="pt-5">
                    <p className="text-white">Purchase a certified product with SmartSupply. Find the product you like by typing the name:</p>
                    <div className="pt-5">
                        <InputField name={"Product Name"} type={"text"} ref={nameRef} onChange={() => {setName(nameRef.current?.value!)}}/>
                        <div className="flex flex-col gap-2 pt-10">
                            {productList.map((product, index) => (
                                <div key={product.uid+'_'+index}>
                                    {product.productInstances.filter((instance) => instance.previousOwnerRole === getPreviousOwner()).map((instance) => (
                                        <div key={instance.id}>
                                            <PurchaseCard name={product.name} uid={product.uid} price={instance.price.toString()} owner={instance.previousOwner} image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
                                        </div>
                                    ))}
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
	name: string
    uid?: string
    owner: string
	price: string
	image: string
}
function PurchaseCard({ name, uid, owner, price, image }: PurchaseCardProps) {
    const navigate = useNavigate()
    console.log(uid)

	return (
		<div className="flex gap-5">
			<img src={image} alt="product image" className="h-fit w-[200px]" />
			<div className="flex flex-row gap-10 justify-between">
				<div className="flex flex-col h-full justify-around">
					<p className="font-semibold text-text text-xl drop-shadow-lg">{name}</p>
                    <p className="font-semibold text-text text-xl drop-shadow-lg">{owner}</p>
                    <span className="flex gap-2 items-center">
						<p className="font-semibold text-text text-xl drop-shadow-lg">Price</p>
						<GradientText text={"€"+price} className="text-xl" />
					</span>
				</div>
				<div className="flex flex-col gap-3 flex-end h-full justify-around">
                    <Button text="Details" className={`p-2 font-semibold`} onClick={() => navigate(`/product/${uid}`)}/>
					<Button text="Buy Product" className={`p-2 font-semibold`} />
				</div>
			</div>
		</div>
	)
}
