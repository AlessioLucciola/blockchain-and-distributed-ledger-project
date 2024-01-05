import { useRef, useState, useEffect } from "react"
import InputField from "./InputField"
import { addVerificationID, getVerificationInfoById, updateVerificationPayment } from "../assets/api/apiCalls"
import { useSessionContext } from "../context/exportContext"
import { Verifications } from "../shared/types"

interface VerifyAccountModalProps {
	showModal: boolean
	setShowModal: (showModal: boolean) => void
}
export default function VerifyAccountModal({ showModal, setShowModal }: VerifyAccountModalProps) {
	const verificationRef = useRef<HTMLInputElement | null>(null)
	const [verificationDetails, setVerificationsDetails] = useState<Verifications | undefined>()
	const sessionContext = useSessionContext()

	const getVerificationDetails = async () => {
		const userID = sessionContext.entityInfo?.id!.toString()
		if (userID !== undefined) {
			const res = await getVerificationInfoById({ userID: userID })
			console.log(res)
			if (res.status === 200) {
				setVerificationsDetails(res.data.data)
			}
		}
	}

	useEffect(() => {
		getVerificationDetails()
	}, [showModal])

	const addVerification = async () => {
		const verificationID = verificationRef.current?.value

		if (!(await validateFields())) {
			return
		}

		const userID = sessionContext.entityInfo?.id!.toString()
		if (userID !== undefined) {
			const res = await addVerificationID({ userID: userID, verificationID: verificationID!.toString() })
			if (res.status !== 200) {
				alert("Failed to add verificationID")
				return
			}
			alert("Successfully added verificationID")
			setShowModal(false)
		}
		return
	}

	const payBadge = async (id: string, verificationPaid: boolean) => {
		const res = await updateVerificationPayment({ id: id, verificationPaid: verificationPaid })
		if (res !== undefined && res.status !== 200) {
			alert("Error in the verification payment")
		} else {
			alert("Payment accepted")
			getVerificationDetails()
		}
	}

	const validateFields = async () => {
		const verificationID = verificationRef.current?.value

		if (verificationID === undefined || verificationID === "" || verificationID.length !== 11) {
			alert("VerificationID is not valid. It must be a number of 11 digits.")
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
								{verificationDetails?.verificationId !== undefined ? (
									<div>
										<h3 className="font-semibold text-text pt-5 pl-5 text-3xl drop-shadow-lg">Verification Status</h3>
										<div className="p-5">
											<p className="text-white"> Business ID: {verificationDetails.verificationId} </p>
											<p className="text-white"> Verification Status: {verificationDetails.accountVerified ? (
												<>
													{verificationDetails.verificationPaid ? (
														<>
															<p>Your account is verified and you have the badge</p>
															<div className="rounded-b flex p-6 items-center justify-end">
																<button
																	className="bg-secondary rounded font-bold outline-none shadow text-text text-sm mr-1 mb-1 py-3 px-6 transition-all ease-linear duration-150 uppercase hover:shadow-lg focus:outline-none active:bg-emerald-600"
																	type="button"
																	onClick={() => setShowModal(false)}
																>
																	Close
																</button>
															</div>
														</>
													) : (
														<>
															<p>Account Verified. You can know get the badge.</p>
															<div className="rounded-b flex p-6 items-center justify-end">
																<button
																	className="bg-secondary rounded font-bold outline-none shadow text-text text-sm mr-1 mb-1 py-3 px-6 transition-all ease-linear duration-150 uppercase hover:shadow-lg focus:outline-none active:bg-emerald-600"
																	type="button"
																	onClick={() => payBadge(verificationDetails.id, true)}
																>
																	Make the payment
																</button>
																<button
																	className="bg-secondary rounded font-bold outline-none shadow text-text text-sm mr-1 mb-1 py-3 px-6 transition-all ease-linear duration-150 uppercase hover:shadow-lg focus:outline-none active:bg-emerald-600"
																	type="button"
																	onClick={() => setShowModal(false)}
																>
																	Close
																</button>
															</div>
														</>
													)}
												</>
											) : (
												<>
													<p>Waiting for SmartSupply to verify your account</p>
													<div className="rounded-b flex p-6 items-center justify-end">
														<button
															className="bg-secondary rounded font-bold outline-none shadow text-text text-sm mr-1 mb-1 py-3 px-6 transition-all ease-linear duration-150 uppercase hover:shadow-lg focus:outline-none active:bg-emerald-600"
															type="button"
															onClick={() => setShowModal(false)}
														>
															Close
														</button>
													</div>
												</>
											)} </p>
										</div>
									</div>
								) : (
									<div>
										<h3 className="font-semibold text-text pt-5 pl-5 text-3xl drop-shadow-lg">Verification Status</h3>
										<div>
											<p className="text-white pl-5"> "Send your VerificationID (e.g. Partita IVA)" </p>
										</div>
										<div className="rounded-t flex items-start justify-between">
											<div className="flex gap-2 justify-between">
												<div className="flex flex-col p-6 gap-10 relative">
													<InputField name={"VerificationID"} type={"textarea"} ref={verificationRef} />
												</div>
											</div>
										</div>
										{/*footer*/}
										<div className="rounded-b flex p-6 items-center justify-end">
											<button
												className="bg-secondary rounded font-bold outline-none shadow text-text text-sm mr-1 mb-1 py-3 px-6 transition-all ease-linear duration-150 uppercase hover:shadow-lg focus:outline-none active:bg-emerald-600"
												type="button"
												onClick={() => addVerification()}
											>
												Add Verification
											</button>
											<button
												className="bg-secondary rounded font-bold outline-none shadow text-text text-sm mr-1 mb-1 py-3 px-6 transition-all ease-linear duration-150 uppercase hover:shadow-lg focus:outline-none active:bg-emerald-600"
												type="button"
												onClick={() => setShowModal(false)}
											>
												Close
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
					<div className="bg-black opacity-25 inset-0 z-40 fixed"></div>
				</>
			) : null}
		</>
	)
}