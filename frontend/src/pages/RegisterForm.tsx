import { useEffect, useState } from "react"
import Button from "../components/Button"
import InputField from "../components/InputField"
import Navbar from "../components/Navbar"
import { ROLES } from "../shared/constants"
import { DistributorIcon, ManufacturerIcon, CustomerIcon, RetailerIcon } from "../shared/icons"
interface RegisterFormProps {
	role?: ROLES
}

export default function RegisterForm({ role }: RegisterFormProps) {
	const [roleState, setRoleState] = useState<ROLES | undefined>(role)
	const getRoleIcon = () => {
		console.log("Role state is " + roleState)
		switch (roleState?.toLowerCase()) {
			case ROLES.DISTRIBUTOR:
				return <DistributorIcon className="h-10 fill-primary w-10" />
			case ROLES.MANUFACTURER:
				return <ManufacturerIcon className="h-10 fill-primary w-10" />
			case ROLES.RETAILER:
				return <RetailerIcon className="h-10 fill-primary w-10" />
			case ROLES.CUSTOMER:
				return <CustomerIcon className="h-10 fill-primary w-10" />
			default:
				return <CustomerIcon className="h-10 fill-primary w-10" />
		}
	}
	const getQueryParams = () => {
		const params = new URLSearchParams(window.location.search)
		if (!params.has("role")) {
			return undefined
		}
		const role = params.get("role") as ROLES
		return role
	}

	useEffect(() => {
		// if (role === undefined && roleState === undefined) {
		// return
		// }
		const queryRole = getQueryParams()
		setRoleState(queryRole)
	}, [])

	if (roleState === undefined) {
		return (
			<div className="bg-hero bg-cover bg-no-repeat flex flex-col h-screen w-screen gap-10 items-center justify-center">
				<p className="bg-gradient-to-b bg-clip-text from-text to-secondary font-bold text-transparent text-7xl drop-shadow-lg">You didn't define a Role!</p>
				<Button text="Go Back" />
			</div>
		)
	}

	return (
		<>
			<Navbar />
			<div className="bg-hero bg-cover bg-no-repeat h-screen w-screen">
				<div className="flex flex-col h-full w-full pl-36 items-center justify-center">
					<div className="flex flex-col h-fit w-fit gap-6">
						<p className="bg-gradient-to-b bg-clip-text from-text to-secondary font-bold text-transparent text-7xl drop-shadow-lg">Welcome to the Club!</p>
						<div className="flex text-end w-full gap-3 items-center justify-end">
							<p className="text-primary text-xl">You are registering as a</p>
							{getRoleIcon()}
							<p className="text-primary text-xl">{roleState[0].toUpperCase() + roleState.slice(1)}</p>
						</div>
						<div className="grid gap-y-6 gap-x-2 grid-cols-2">
							<InputField name="Email" type="email" />
							<InputField name="Company Name" type="text" />
							<InputField name="Repeat Email" type="email" />
							<InputField name="Shop Name" type="text" />
							<InputField name="Password" type="password" />
							<InputField name="Address 1" type="text" />
							<InputField name="Repeat Password" type="password" />
							<InputField name="Address 2" type="text" />
							<Button text="Register" className="w-fit" />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
