import React, { useEffect, useRef} from "react"
import { getCertificationPercentage, changeCertificationPercentage } from "../assets/api/contractCalls"
import Button from "./Button"
import InputField from "./InputField"

interface ChangeCertificationPercentageModalProps {
	showModal: boolean
	setShowModal: (showModal: boolean) => void
}
export default function ChangeCertificationPercentageModal({ showModal, setShowModal }: ChangeCertificationPercentageModalProps) {
	const percentageRef = useRef<HTMLInputElement | null>(null)
	const [certificationPercentage, setCertificationPercentage] = React.useState(0);

	const fetchCurrentCertificationPercentage = async () => {
		let currentPercentage = await getCertificationPercentage();
		setCertificationPercentage(currentPercentage);
	};

	useEffect(() => {
		fetchCurrentCertificationPercentage();
	}, []);
	

	const validateFields = async () => {
		const percentage = percentageRef.current?.value

		if (percentage === undefined || parseFloat(percentage) <= 0 || parseFloat(percentage) > 100) {
			alert("Please enter a valid percentage")
			return false
		}

		return true
	}

	const handleChangePercentageConfirmation = async () => {
		if (!(await validateFields())) {
			return
		}

		let percentage = percentageRef.current?.value

		try {
			const res = await changeCertificationPercentage(parseInt(percentage!))
			if (res) {
				setCertificationPercentage(parseInt(percentage!))
				console.log('Response from setCertificationPercentage:', res)
				alert("Successfully changed certification percentage")
				setShowModal(false)
				fetchCurrentCertificationPercentage();
			}
		} catch (error) {
			alert("Failed to change certification percentage")
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
								<h3 className="font-semibold text-text pt-5 pl-5 text-2xl drop-shadow-lg">Change certification percentage</h3>
                                {/*body*/}
                                <div>
                                    <p className="text-white p-1 px-2 pl-5">Current percentage: {certificationPercentage} %</p>
									<div className="flex flex-col items-center mt-5">
										<InputField name={"New percentage"} type={"number"}  ref={percentageRef}/>
									</div>
								</div>
								{/*footer*/}
                                <div className="flex gap-2 p-5 justify-end">
                                    <Button text="Cancel" onClick={() => setShowModal(false)} />
                                    <Button text="Change" onClick={() => handleChangePercentageConfirmation()} />
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