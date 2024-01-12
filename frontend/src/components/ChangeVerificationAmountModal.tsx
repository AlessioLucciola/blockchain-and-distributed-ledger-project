import React, { useEffect, useRef} from "react"
import { getVerificationAmount, changeVerificationAmount } from "../assets/api/contractCalls"
import Button from "./Button"
import InputField from "./InputField"
import { ethers } from "ethers"

interface ChangeVerificationAmountModalProps {
	showModal: boolean
	setShowModal: (showModal: boolean) => void
}
export default function ChangeVerificationAmountModal({ showModal, setShowModal }: ChangeVerificationAmountModalProps) {
	const priceRef = useRef<HTMLInputElement | null>(null)
	const [verificationAmount, setVerificationAmount] = React.useState(0);

	const fetchCurrentVerificationAmount = async () => {
		let currentAmount = await getVerificationAmount();
		currentAmount = ethers.formatUnits(currentAmount, "gwei");
		setVerificationAmount(currentAmount);
	};

	useEffect(() => {
		fetchCurrentVerificationAmount();
	}, []);
	

	const validateFields = async () => {
		const price = priceRef.current?.value

		if (price === undefined || parseFloat(price) <= 0) {
			alert("Please enter a valid price")
			return false
		}

		return true
	}

	const handleChangeAmountConfirmation = async () => {
		if (!(await validateFields())) {
			return
		}

		let price = priceRef.current?.value

		price = ethers.parseUnits(price!, "gwei").toString();

		try {
			const res = await changeVerificationAmount(parseFloat(price!))
			if (res) {
				setVerificationAmount(parseFloat(price!))
				console.log('Response from changeVerificationAmount:', res)
				alert("Successfully changed verification amount")
				setShowModal(false)
				fetchCurrentVerificationAmount();
			}
		} catch (error) {
			alert("Failed to change verification amount")
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
								<h3 className="font-semibold text-text pt-5 pl-5 text-2xl drop-shadow-lg">Change verification amount</h3>
                                {/*body*/}
                                <div>
                                    <p className="text-white p-1 px-2 pl-5">Current amount: {verificationAmount} ETH</p>
									<div className="flex flex-col items-center mt-5">
										<InputField name={"New amount"} type={"number"}  ref={priceRef}/>
									</div>
								</div>
								{/*footer*/}
                                <div className="flex gap-2 p-5 justify-end">
                                    <Button text="Cancel" onClick={() => setShowModal(false)} />
                                    <Button text="Change" onClick={() => handleChangeAmountConfirmation()} />
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