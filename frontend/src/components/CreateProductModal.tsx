import { useEffect, useRef, useState } from "react"
import InputField from "./InputField"
import { addProduct, addProductInstance, getSellerById, searchProduct } from "../assets/api/apiCalls"
import { Entity, Product } from "../shared/types"
import GradientText from "./GradientText"
import { RightCaretIcon } from "../shared/icons"
import { useSessionContext } from "../context/exportContext"

interface CreateProductModalProps {
	showModal: boolean
	setShowModal: (showModal: boolean) => void
}
export default function CreateProductModal({ showModal, setShowModal }: CreateProductModalProps) {
	const nameRef = useRef<HTMLInputElement | null>(null)
	const descriptionRef = useRef<HTMLTextAreaElement | null>(null)
	const priceRef = useRef<HTMLInputElement | null>(null)
	const sessionContext = useSessionContext()
	const [name, setName] = useState<string>("")
	const [uid, setUid] = useState<number | undefined>(undefined)

	const createProduct = async () => {
		const description = descriptionRef.current?.value
		const price = priceRef.current?.value
		let productId = uid

		if (!(await validateFields())) {
			return
		}

		//const existingProductRes = await searchProduct({ productId: productId })
		if (!productId) {
			const res = await addProduct({ name: name!, description: description! })
			if (res.status !== 200) {
				alert("Failed to add product")
				return
			}
			productId = parseInt(res.data.data.uid!)
			console.log(productId)
		}
		const sellerId = sessionContext.entityInfo!.id
		const res = await addProductInstance({ productId: productId!.toString(), soldBy: parseInt(sellerId!), price: parseFloat(price!) })
		if (res.status !== 200) {
			alert("Failed to add product instance")
			return
		}
		setShowModal(false)
		alert("Successfully added product")
		return
	}

	const validateFields = async () => {
		const description = descriptionRef.current?.value
		const price = priceRef.current?.value

		if (name === undefined || name === "") {
			alert("Please enter a name")
			return false
		}

		if (description === undefined || description === "") {
			alert("Please enter a description")
			return false
		}

		if (price === undefined || parseFloat(price) <= 0) {
			alert("Please enter a valid price")
			return false
		}

		return true
	}
	return (
		<>
			{showModal ? (
				<>
					<div className="flex outline-none inset-0 z-50 justify-center items-center overflow-x-hidden overflow-y-auto fixed focus:outline-none">
						<div className="mx-auto my-6 w-auto max-w-3xl relative">
							{/*content*/}
							<div className="bg-accent flex flex-col rounded-3xl shadow-lg w-full relative focus:outline-none">
								{/*header*/}
								<h3 className="font-semibold text-text pt-5 pl-5 text-3xl drop-shadow-lg">Add a new Product</h3>
								<div className="rounded-t flex p-5 items-start justify-between">
									<div className="flex gap-2 justify-between">
										{/*Left col*/}
										<ProductList name={name} uid={uid} setUid={setUid} setName={setName} />
										{/*Right col*/}
										<div className="flex flex-col p-6 gap-10 relative">
											{uid ? (
												<div className="flex gap-2 items-center">
													<p className="bg-background rounded-lg h-fit shadow-lg text-primary p-1 px-2">Name</p>
													<p className="font-bold text-text text-lg box-shadow-lg">{name}</p>
												</div>
											) : (
												<InputField
													name={"Name"}
													type={"text"}
													ref={nameRef}
													onChange={() => {
														setName(nameRef.current?.value!)
													}}
												/>
											)}
											{uid && (
												<div className="flex gap-2 items-center">
													<p className="bg-background rounded-lg h-fit shadow-lg text-primary p-1 px-2">Product ID</p>
													<p className="font-bold text-text text-lg box-shadow-lg">{uid}</p>
													<p
														className="bg-background rounded-xl cursor-pointer font-semibold shadow-lg text-text py-1 px-3 selecto-none"
														onClick={() => {
															setUid(undefined)
															setName("")
														}}
													>
														Reset
													</p>
												</div>
											)}
											<InputField name={"Description"} type={"textarea"} ref={descriptionRef} />
											<InputField name={"Price"} type={"number"} ref={priceRef} />
										</div>
									</div>
								</div>
								{/*footer*/}
								<div className="rounded-b flex p-6 items-center justify-end">
									<button
										className="font-bold outline-none text-sm mr-1 text-background mb-1 py-2 px-6 transition-all ease-linear duration-150 background-transparent uppercase focus:outline-none"
										type="button"
										onClick={() => setShowModal(false)}
									>
										Close
									</button>
									<button
										className="bg-secondary rounded font-bold outline-none shadow text-text text-sm mr-1 mb-1 py-3 px-6 transition-all ease-linear duration-150 uppercase hover:shadow-lg focus:outline-none active:bg-emerald-600"
										type="button"
										onClick={() => createProduct()}
									>
										Add Product
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-black opacity-25 inset-0 z-40 fixed"></div>
				</>
			) : null}
		</>
	)
}

interface ProductListProps {
	name?: string
	uid?: number
	setUid: (uid: number) => void
	setName: (name: string) => void
}
const ProductList = ({ name, uid, setUid, setName }: ProductListProps) => {
	const [productList, setProductList] = useState<Product[]>([])
	const [details, setDetails] = useState<Product | undefined>()
	const getProductList = async () => {
		const res = await searchProduct({ name: name, productId: uid, includeInstances: false })
		if (res.status === 200) {
			setProductList((prev) => [...res.data.data])
		}
	}
	const toggleDetails = async (uid: number) => {
		if (details && parseInt(details.uid!) === uid) {
			setDetails((prev) => undefined)
			return
		}
		const res = await searchProduct({ name: name, productId: uid, includeInstances: true })

		if (res.status === 200) {
			setDetails((prev) => [...res.data.data][0])
		}
	}
	useEffect(() => {
		console.log("New name or uid", name, uid)
		getProductList()
	}, [name, uid])
	return (
		<div className="flex flex-col w-full gap-2">
			<p className="font-bold text-text text-lg drop-shadow-lg">Similar Products</p>
			<div className="bg-background rounded-xl grid p-3 gap-2 grid-cols-[1fr_3fr_3fr_3fr] drop-shadow-lg place-items-center ">
				<GradientText text={"ID"} className="text-md" />
				<p className="font-semibold text-text text-md">Name</p>
				<p className="font-semibold text-text text-md invisible">Name</p>
			</div>
			{productList.map(({ name, uid }, index) => {
				return (
					<div key={index} className="bg-background rounded-xl flex flex-col shadow-lg gap-2">
						<div className="grid p-3 gap-2 grid-cols-[1fr_3fr_3fr_3fr] place-items-center">
							<GradientText text={uid?.toString()!} className="text-md" />
							<p className="font-semibold text-text text-md text-nowrap">{name}</p>
							<p
								className="bg-accent rounded-lg cursor-pointer font-semibold shadow-lg text-nowrap text-text py-1 px-3 select-none"
								onClick={() => {
									setUid(parseInt(uid!))
									setName(name)
								}}
							>
								Sell this
							</p>
							<div className="flex gap-1 items-center" onClick={() => toggleDetails(parseInt(uid!))}>
								<p className="rounded-lg cursor-pointer font-semibold shadow-lg text-text select-none hover:underline">Details</p>
								<RightCaretIcon className={`h-4 fill-text w-4 ${details && uid == details.uid! && "rotate-90"}`} />
							</div>
						</div>
						{details && uid === details.uid! && (
							<div className="max-h-[500px] pb-5 overflow-y-auto ">
								<div className="grid pl-10 grid-cols-[1fr_5fr_3fr]">
									<GradientText text="Id" className="text-md" />
									<GradientText text="Sold By" className="text-md" />
									<GradientText text="Price" className="text-md" />
								</div>
								{details.productInstances.map(({ currentOwner, price, id }) => (
									<DetailsCard instanceId={parseInt(id!)} soldById={currentOwner} price={price} />
								))}
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}
interface DetailsCardProps {
	instanceId: number
	soldById: string
	price: number
}
const DetailsCard = ({ instanceId, soldById, price }: DetailsCardProps) => {
	const [seller, setSeller] = useState<Entity | undefined>()

	const getSellerByIdWrapper = async () => {
		const res = await getSellerById({ sellerId: soldById })
		setSeller(res.data.data)
	}
	useEffect(() => {
		getSellerByIdWrapper()
	}, [soldById])

	return (
		<div className="grid py-1 pl-10 grid-cols-[1fr_5fr_3fr]">
			<p className="font-semibold text-text text-md drop-shadow-lg">{instanceId}</p>
			<p className="font-semibold text-text text-md drop-shadow-lg">{seller?.companyName}</p>
			<p className="font-semibold text-text text-md drop-shadow-lg">${price.toFixed(2)}</p>
		</div>
	)
}
