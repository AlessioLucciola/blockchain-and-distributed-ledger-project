import { useRef } from "react"
import InputField from "./InputField"
import { changeBankTransactionID } from "../assets/api/contractCalls"

interface ChangeTransactionIdModalProps {
    productInstanceId: number
    transactionInfo: string | undefined
	showModal: boolean
	setShowModal: (showModal: boolean) => void
	onModalClose: () => void
}
export default function ChangeTransactionIdModal({ productInstanceId, transactionInfo, showModal, setShowModal, onModalClose }: ChangeTransactionIdModalProps) {
	const transactionIdRef = useRef<HTMLInputElement | null>(null)

	const addTransactionId = async () => {
		const newTransactionId = transactionIdRef.current?.value

		if (!(await validateFields())) {
			return
		}

		if (newTransactionId !== undefined) {
			const contract_res = await changeBankTransactionID(productInstanceId, parseInt(newTransactionId))
			if (parseInt(contract_res.productId) === productInstanceId) {
                alert("Transaction ID changed successfully")
				window.location.reload()
                setShowModal(false)
				return
            } else {
                const error = console.error("Error changing transactionID. Can't catch the contract event.")
                throw error
            }
		}
		return
	}

	const validateFields = async () => {
		const currentTransactionId = transactionIdRef.current?.value

		if (currentTransactionId === undefined || currentTransactionId === "" || currentTransactionId === "0" || isNaN(parseInt(currentTransactionId))) {
			alert("VerificationID is not valid.")
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
                                <h3 className="font-semibold text-text pt-5 pl-5 text-3xl drop-shadow-lg">Bank Transaction ID</h3>
								{transactionInfo !== undefined ? (
									<div className="p-5">
                                        <p className="text-white"> You already confirmed the payment by sending the bank transaction ID:</p>
                                        <p className="text-white">{transactionInfo} </p>
									</div>
								) : (
									<div className="p-5">
                                        <p className="text-white">Add the transaction ID of the payment to confirm it:</p>
									</div>
								)}
                                <div>
                                    <div className="rounded-t flex items-start justify-between">
                                        <div className="flex gap-2 justify-between">
                                            <div className="flex flex-col p-6 gap-10 relative">
                                                <InputField name={"Bank Transaction ID"} type={"textarea"} ref={transactionIdRef} />
                                            </div>
                                        </div>
                                    </div>
                                    {/*footer*/}
                                    <div className="rounded-b flex p-6 items-center justify-end">
                                        <button
                                            className="bg-secondary rounded font-bold outline-none shadow text-text text-sm mr-1 mb-1 py-3 px-6 transition-all ease-linear duration-150 uppercase hover:shadow-lg focus:outline-none active:bg-emerald-600"
                                            type="button"
                                            onClick={() => addTransactionId()}
                                        >
                                            {transactionInfo === undefined ? "Add Transaction ID" : "Change Transaction ID"}
                                        </button>
                                        <button
                                            className="bg-secondary rounded font-bold outline-none shadow text-text text-sm mr-1 mb-1 py-3 px-6 transition-all ease-linear duration-150 uppercase hover:shadow-lg focus:outline-none active:bg-emerald-600"
                                            type="button"
                                            onClick={() => {setShowModal(false); onModalClose()}}
                                        >
                                            Close
                                        </button>
                                    </div>
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