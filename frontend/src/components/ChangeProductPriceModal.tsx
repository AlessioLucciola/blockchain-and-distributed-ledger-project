import { useRef} from "react"
import { changeProductOnSale } from "../assets/api/apiCalls"
import Button from "./Button"
import InputField from "./InputField"

interface ChangeProductPriceModalProps {
	showModal: boolean
	productId: string
	currentPrice: number
	setShowModal: (showModal: boolean) => void
	onPriceChange: () => void;
}
export default function ChangeProductPriceModal({ showModal, productId, currentPrice, setShowModal }: ChangeProductPriceModalProps) {
	const priceRef = useRef<HTMLInputElement | null>(null)

	const validateFields = async () => {
		const newPrice = priceRef.current?.value

		if (newPrice === undefined || parseFloat(newPrice) <= 0 || parseFloat(newPrice) <= currentPrice) {
			alert("Please enter a valid price")
			return false
		}

		return true
	}
		
	// const changeOnSale = async (productInstanceId: string) => {
	// 	const res = await changeProductOnSale({ productInstanceId: parseInt(productInstanceId) })
	// 	if (res === undefined || res.status !== 200) {
	// 		alert("Error changing product state")
	// 		return
	// 	} else {
	// 		alert("Product is now on sale")
	// 		return
	// 	}
	// }

	const handleChangeAmount = async () => {
		if (!(await validateFields())) {
			return
		}

		try {
			// changeOnSale(productId)
			setShowModal(false)
			return
		} catch (error) {
			alert("Failed to change certification amount")
		}
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
								<h3 className="font-semibold text-text pt-5 pl-5 text-2xl drop-shadow-lg">Change product price</h3>
                                {/*body*/}
                                <div>
                                    <p className="text-white p-1 px-2 pl-5">Current price: {currentPrice} €</p>
									<div className="flex flex-col items-center mt-5">
										<InputField name={"New amount"} type={"number"}  ref={priceRef}/>
									</div>
								</div>
								{/*footer*/}
                                <div className="flex gap-2 p-5 justify-end">
                                    <Button text="Cancel" onClick={() => setShowModal(false)} />
                                    <Button text="Change" onClick={() => handleChangeAmount()} />
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