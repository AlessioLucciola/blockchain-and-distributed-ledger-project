import { useNavigate } from "react-router-dom"
import { getRoleIcon } from "../utils/renderUtils"
import { Roles } from "../shared/constants"
import { getSellerById } from "../assets/api/apiCalls"
import { useSessionContext } from "../context/exportContext"
import { useEffect, useState } from "react"
import { Entity } from "../shared/types"

type Link = {
	name: string
	path?: string
	action?: () => void
}
interface NavbarProps {
	showLinks?: boolean
	overrideLinks?: Link[]
}
export default function Navbar({ showLinks = true, overrideLinks }: NavbarProps) {
	const navigate = useNavigate()
	const sessionContext = useSessionContext()
	const [entity, setEntity] = useState<Entity | undefined>()

	const getSellerByIdWrapper = async () => {
		if (!sessionContext.entityInfo) return
		const res = await getSellerById({ sellerId: sessionContext.entityInfo!.id! })
		setEntity(res.data.data)
	}
	const getEntityName = () => {
		if (sessionContext.entityInfo?.role === Roles.CUSTOMER) {
			return `${entity?.name} ${entity?.surname}`
		}
		return entity?.companyName
	}
	useEffect(() => {
		getSellerByIdWrapper()
	}, [sessionContext.entityInfo])

	return (
		<div className="flex flex-col align-center items-center">
			<div className="bg-background rounded-xl flex flex-row h-20   shadow-lg my-4 w-[98%] fixed justify-between items-center">
				<div className="flex flex-row gap-2 items-center">
					<img src="/src/assets/logo.png" alt="smartsupply logo" className="cursor-pointer h-16 w-18" onClick={() => navigate("/")} />
					<div className="bg-gradient-to-b bg-clip-text from-text to-secondary text-transparent text-2xl">Smart Supply.</div>
				</div>
				<div className="flex flex-row pr-10 gap-4 justify-center items-center">
					{sessionContext.entityInfo && (
						<div className="flex gap-4 items-center">
							{getRoleIcon(sessionContext.entityInfo?.role!)}
							<p className="text-primary text-2xl">{getEntityName()}</p>
						</div>
					)}
					{showLinks && !overrideLinks && (
						<>
							<div className="cursor-pointer text-primary hover:underline">About.</div>
							<div className="cursor-pointer text-primary hover:underline">Pricing.</div>
							<div className="cursor-pointer text-primary hover:underline" onClick={() => navigate("/login")}>
								Login.
							</div>
						</>
					)}
					{showLinks &&
						overrideLinks &&
						overrideLinks.map(({ name, path, action }) => (
							<div className="cursor-pointer text-primary hover:underline" onClick={path ? () => navigate(path!) : action}>
								{name}
							</div>
						))}
				</div>
			</div>
		</div>
	)
}
