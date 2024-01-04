import { deleteEntity } from "../assets/api/apiCalls"
import { useSessionContext } from "../context/exportContext"
import Button from "./Button"

interface DeleteAccountModalProps {
	showModal: boolean
	setShowModal: (showModal: boolean) => void
}
export default function DeleteAccountModal({ showModal, setShowModal }: DeleteAccountModalProps) {
	const sessionContext = useSessionContext()

    const handleDeleteConfirmation = async () => {
        try {
            console.log(sessionContext.entityInfo!.id!)
            const res = await deleteEntity({ id: sessionContext.entityInfo!.id! })
            if (res.status === 200) {
                setShowModal(false)
                sessionContext.logout()
            }
        } catch (error) {
          console.error("Error deleting account:", error);
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
								<h3 className="font-semibold text-text pt-5 pl-5 text-3xl drop-shadow-lg">Delete the account</h3>
                                {/*body*/}
                                <div>
                                    <p className="text-white p-1 px-2 pl-5">Are you sure?</p>
								</div>
								{/*footer*/}
                                <div className="flex gap-2 p-5 justify-end">
                                    <Button text="Cancel" onClick={() => setShowModal(false)} />
                                    <Button text="Yes" onClick={() => handleDeleteConfirmation()} />
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