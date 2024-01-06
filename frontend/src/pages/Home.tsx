import { useNavigate } from "react-router-dom"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import { Roles } from "../shared/constants"
import { CartIcon, StoreIcon, TagIcon } from "../shared/icons"
import { getRoleIcon } from "../utils/renderUtils"
import React, { useEffect } from "react"
import { useSessionContext } from "../context/exportContext"
import Button from "../components/Button"
import DeleteAccountModal from "../components/DeleteAccountModal"
import VerifyAccountModal from "../components/VerifyAccountModal"
import { getPendingVerifications, deleteVerification, updateVerificationGranted } from "../assets/api/apiCalls"
import { VerificationWithEntity } from "../shared/types"
export default function Home() {
	const navigate = useNavigate()
	const sessionContext = useSessionContext()
	const [showDeleteModal, setShowDeleteModal] = React.useState(false)
	const [showVerifyAccountModal, setShowVerifyAccountModal] = React.useState(false)
	const [verifications, setVerifications] = React.useState<VerificationWithEntity[]>([])

	useEffect(() => {
		if (!sessionContext.entityInfo) {
			navigate("/")
		}
	}, [sessionContext])

	useEffect(() => {
		retrievePendingVerifications()
	}, [])

	const retrievePendingVerifications = async () => {
		const res = await getPendingVerifications()
		if (res.status === 200) {
			setVerifications((prev) => [...res.data.data])
		}
	}

	const rejectVerification = async (id: string) => {
		const res = await deleteVerification({ id: id })
		if (res.status !== 200) {
			alert("Error revoking verification")
		} else {
			setVerifications((prevVerifications) => prevVerifications.filter((verification) => verification.id !== id))
		}
	}

	const acceptVerification = async (id: string, accountVerified: boolean, metamaskAddress: string) => {
		const res = await updateVerificationGranted({ id: id, accountVerified: accountVerified, metamaskAddress: metamaskAddress })
		if (res !== undefined && res.status !== 200) {
			alert("Error accepting verification")
		} else {
			alert("Verification accepted")
			setVerifications((prevVerifications) => prevVerifications.filter((verification) => verification.id !== id))
		}
	}

	return (
		<div className="bg-background h-screen w-screen overflow-y-scroll">
			<Navbar showLinks={true} overrideLinks={[{ name: "Logout", action: sessionContext.logout }]} />
			<div className="flex flex-col pt-36 items-center justify-center">
					<GradientText text="Welcome Back!" className="text-7xl" />
					<span className="flex pt-2 gap-2 items-center justify-center">
						{getRoleIcon((sessionContext.entityInfo?.role as Roles) || Roles.CUSTOMER)}
						<p className="font-semibold text-text text-2xl">
							{sessionContext.entityInfo?.name} {sessionContext.entityInfo?.surname}
						</p>
					</span>
			</div>
			{sessionContext.entityInfo?.role as Roles == Roles.ADMIN ? (
				<>
					<div className="flex p-5 m-5 bg-accent rounded-lg flex-col">
						<h3 className="font-semibold text-text pt-5 pl-5 text-3xl drop-shadow-lg">Verification Requests</h3>
						{verifications.length > 0 ? (
							<div className="">
								{verifications.map((verification) => (
									<div className="flex p-5 m-5 bg-accent rounded-lg bg-white" key={verification.id}>
										<div className="flex-col">
											<p className="font-semibold drop-shadow-lg text-2xl">Verification Request {verification.id}</p>
											{verification.entity.companyName !== null ? <p>Company name: {verification.entity.companyName}</p> : ""}
											{verification.entity.shopName !== null ? <p>Shop name: {verification.entity.shopName}</p> : ""}
											<p>Address: {verification.entity.metamaskAddress}</p>
											<p>VerificationID: {verification.verificationId}</p>
										</div>
										<div className="flex-col pl-5 ml-auto">
											<button className="bg-secondary rounded font-bold outline-none shadow text-text text-sm mr-1 mb-1 py-3 px-6 transition-all ease-linear duration-150 uppercase hover:shadow-lg focus:outline-none active:bg-emerald-600" type="button" onClick={() => acceptVerification(verification.id, true, verification.entity.metamaskAddress)}>
												Accept
											</button>
											<button className="bg-red-500 rounded font-bold outline-none shadow text-text text-sm mr-1 mb-1 py-3 px-6 transition-all ease-linear duration-150 uppercase hover:shadow-lg focus:outline-none active:bg-emerald-600" type="button" onClick={() => rejectVerification(verification.id)}>
												Reject
											</button>
										</div>
									</div>
								))}
							</div>
						) :
						(
							<p className="text-white p-1 px-2 pl-5">There are no pending verification requests.</p>
						)}
					</div>
				</>
			) : (
				<>
				
					<div className="flex pt-40 gap-5 items-center justify-center">
						{sessionContext.entityInfo?.role as Roles !== Roles.MANUFACTURER ? <Card title="My Sales" Icon={TagIcon} onClick={() => navigate("/sales")} /> : ""}
						<Card title="My Orders" Icon={CartIcon} onClick={() => navigate("/orders")} />
						<Card title="My Shop" Icon={StoreIcon} onClick={() => navigate("/shop")} />
					</div>
					<div className="flex flex-col pt-40 gap-5 items-center justify-center">
						<GradientText text="Account settings:" className="text-3xl" />
						<span className="flex pt-2 gap-2 items-center justify-center">
							<Button text="Delete Account" onClick={() => setShowDeleteModal(true)} />
							<Button text="Verify Account" onClick={() => setShowVerifyAccountModal(true)} />
						</span>
					</div>
					<DeleteAccountModal showModal={showDeleteModal} setShowModal={() => setShowDeleteModal(!showDeleteModal)} />
					<VerifyAccountModal showModal={showVerifyAccountModal} setShowModal={() => setShowVerifyAccountModal(!showVerifyAccountModal)} />
				</>
			)}
		</div>
	)
}

interface CardProps {
	title: string
	Icon: React.ComponentType<{ className?: string }>
	onClick?: () => void
}
function Card({ title, Icon, onClick }: CardProps) {
	return (
		<div className="bg-accent cursor-pointer flex rounded-2xl h-[180px] shadow-lg py-14 px-5 items-center justify-center hover:shadow-black " onClick={onClick}>
			<Icon className="h-fit fill-text w-14 drop-shadow-lg" />
			<p className="text-text px-3 pb-3 text-4xl drop-shadow-lg">{title}</p>
		</div>
	)
}
