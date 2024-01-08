import React, { useEffect, useRef, useState } from "react"
import Button from "../components/Button"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import { Roles } from "../shared/constants"
import { useNavigate } from "react-router-dom"
import { useSessionContext } from "../context/exportContext"
import { ProductInstance } from "../shared/types"
import { getProductOnSale, getSellerById, searchProduct } from "../assets/api/apiCalls"
import InputField from "../components/InputField"

export default function MyOrders() {
    const navigate = useNavigate()
	const sessionContext = useSessionContext()
    const nameRef = useRef<HTMLInputElement | null>(null)
    const [search, setSearch] = useState<string>("")
    const [productList, setProductList] = useState<ProductInstance[]>([])

	useEffect(() => {
		if (!sessionContext.entityInfo) {
			navigate("/")
		}
	}, [sessionContext])

    useEffect(() => {
        getProductList()
    }, [])
    
	const getProductList = async () => {
        const res = await getProductOnSale()
        console.log(res)

        if (res.status === 200) {
            const products = res.data.data
            setProductList(products)
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
                        <InputField name={"Product Name"} type={"text"} ref={nameRef} onChange={() => {setSearch(nameRef.current?.value!)}}/>
                        <div className="flex flex-col gap-2 pt-10">
                            {productList.filter((instance => instance.product?.name.toLowerCase().includes(search.toLowerCase()))).map((instance) => (
                                <div key={instance.id}>
                                    <PurchaseCard name={instance.product?.name} uid={instance.product?.uid} price={instance.price.toString()} owner={instance.previousOwner} image="/src/assets/placeholders/nike-dunk-low-diffused-taupe.png" />
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
	name: string | undefined
    uid?: string | undefined
    owner: string | undefined
	price: string | undefined
	image: string | undefined
}
function PurchaseCard({ name, uid, owner, price, image }: PurchaseCardProps) {
    const navigate = useNavigate()
    const [entityName, setEntityName] = useState<string | undefined>("")
    
    const getSellerByIdWrapper = async () => {
		if (owner === undefined) return
		const res = await getSellerById({ sellerId: owner })
        if (res.status === 200) {
            setEntityName(res.data.data.companyName)
            return
        }
	}

    useEffect(() => {
        getSellerByIdWrapper()
    }, [owner])

	return (
		<div className="flex gap-5">
			<img src={image} alt="product image" className="h-fit w-[200px]" />
			<div className="flex flex-row gap-10 justify-between">
				<div className="flex flex-col h-full justify-around">
					<p className="font-semibold text-text text-xl drop-shadow-lg">{name}</p>
                    <span className="flex gap-2 items-center">
                        <p className="font-semibold text-text text-xl drop-shadow-lg">Sold by</p>
                        <GradientText text={entityName !== undefined ? entityName : "Unknown"} className="text-xl" />
                    </span>
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
