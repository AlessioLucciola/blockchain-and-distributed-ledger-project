import React from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { GRADIENTS, Roles } from "../shared/constants"
import { DistributorIcon, ManufacturerIcon, CustomerIcon, RetailerIcon } from "../shared/icons"
import { useEffect, useRef, useState } from "react"
import Button from "../components/Button"
import InputField from "../components/InputField"
import { getRoleIcon } from "../utils/renderUtils"
import GradientText from "../components/GradientText"
import { createEntity } from "../assets/api/apiCalls"
import { Entity } from "../shared/types"

export default function Register() {
	const [role, setRole] = useState<Roles | undefined>(undefined)
	const getQueryParams = () => {
		const params = new URLSearchParams(window.location.search)
		if (!params.has("role")) {
			return undefined
		}
		const role = params.get("role") as Roles
		return role
	}

	useEffect(() => {
		const queryRole = getQueryParams()
		setRole(queryRole)
	}, [])
	return role !== undefined ? <RegisterForm role={role} /> : <RegisterAs />
}

function RegisterAs() {
	const navigate = useNavigate()
	const navigateToRegisterForm = (role: Roles) => {
		navigate(`/register?role=${role}`)
		window.location.reload()
	}
	return (
		<>
			<Navbar />
			<div className="bg-background h-screen w-screen">
				<div className="flex flex-col h-full w-full items-center justify-center">
					<div className="flex flex-col gap-6 justify-center items-center">
						<GradientText text="Register as a" className="text-7xl" />
						<div className="flex flex-row gap-20 ">
							<div
								className={`bg-${GRADIENTS["div-gradient"]} px-8 py-10 rounded-3xl flex flex-col items-center justify-between shadow-lg cursor-pointer hover:shadow-black`}
								onClick={() => navigateToRegisterForm(Roles.MANUFACTURER)}
							>
								<ManufacturerIcon className="h-[200px] fill-primary shadow-red-400 w-[200px] drop-shadow-lg" />
								<p className="font-semibold text-text text-xl pt-2">Manufacturer</p>
							</div>
							<div
								className={`bg-${GRADIENTS["div-gradient"]} px-8 py-10 rounded-3xl flex flex-col items-center justify-between shadow-lg cursor-pointer hover:shadow-black `}
								onClick={() => navigateToRegisterForm(Roles.DISTRIBUTOR)}
							>
								<DistributorIcon className="h-[200px] fill-primary w-[200px] drop-shadow-lg" />
								<p className="font-semibold text-text text-xl pt-2">Distributor</p>
							</div>
							<div
								className={`bg-${GRADIENTS["div-gradient"]} px-8 py-10 rounded-3xl flex flex-col items-center justify-between shadow-lg cursor-pointer hover:shadow-black`}
								onClick={() => navigateToRegisterForm(Roles.RETAILER)}
							>
								<RetailerIcon className="h-[200px]  fill-primary w-[200px] drop-shadow-lg" />
								<p className="font-semibold text-text text-xl pt-2">Retailer</p>
							</div>
							<div
								className={`bg-${GRADIENTS["div-gradient"]} px-8 py-10 rounded-3xl flex flex-col items-center justify-between shadow-lg cursor-pointer hover:shadow-black`}
								onClick={() => navigateToRegisterForm(Roles.CUSTOMER)}
							>
								<CustomerIcon className="h-[200px] fill-primary w-[200px] drop-shadow-lg" />
								<p className="font-semibold text-text text-xl pt-2">Customer</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

interface RegisterFormProps {
	role?: Roles
}

function RegisterForm({ role }: RegisterFormProps) {
	const [roleState, setRoleState] = useState<Roles | undefined>(role)
	const inputRefs = useRef<{ [key: string]: React.RefObject<HTMLInputElement> }>({})
	const getQueryParams = () => {
		const params = new URLSearchParams(window.location.search)
		if (!params.has("role")) {
			return undefined
		}
		const role = params.get("role") as Roles
		return role
	}

	const registerEntity = async () => {
		const fields = getFields()
		if (fields === undefined) {
			return
		}
		const values: { [key: string]: string } = {}
		Object.entries(fields).forEach(([key, _value]) => {
			values[key] = inputRefs.current[key].current?.value as string
		})
		if (!validateFields()) {
			return
		}
		let entity: Entity
		if (roleState == Roles.CUSTOMER) {
			entity = {
				name: values["Full Name"].split(" ")[0],
				surname: values["Full Name"].split(" ")[1],
				address_1: values["Address"],
				email: values["Email"],
				password: values["Password"],
				metamaskAddress: "0x0000000000",
				role: roleState,
			}
		} else {
			entity = {
				name: values["Company Name"],
				address_1: values["Address 1"],
				address_2: values["Address 2"],
				email: values["Email"],
				password: values["Password"],
				companyName: values["Company Name"],
				shopName: values["Shop Name"],
				metamaskAddress: "0x0000000000",
				role: roleState!,
			}
		}
		//TODO: add error handling
		await createEntity(entity)
	}

	const validateFields = () => {
		const sanitizedEmail = inputRefs.current["Email"].current?.value?.trim().toLowerCase()
		const sanitizedRepeatEmail = inputRefs.current["Repeat Email"].current?.value?.trim().toLowerCase()

		if (sanitizedEmail !== sanitizedRepeatEmail) {
			alert("Emails don't match!")
			return false
		}

		const password = inputRefs.current["Password"].current?.value
		const repeatPassword = inputRefs.current["Repeat Password"].current?.value

		if (password !== repeatPassword) {
			alert("Passwords don't match!")
			return false
		}
		return true
	}
	const fields = {
		seller: {
			Email: "email",
			"Repeat Email": "email",
			Password: "password",
			"Repeat Password": "password",
			"Address 1": "text",
			"Address 2": "text",
			"Company Name": "text",
			"Shop Name": "text",
		},
		buyer: {
			"Full Name": "text",
			Address: "text",
			Email: "email",
			"Repeat Email": "email",
			Password: "password",
			"Repeat Password": "password",
		},
	}
	const getFields = () => {
		if (roleState === undefined) {
			return undefined
		}
		return roleState === Roles.CUSTOMER ? fields.buyer : fields.seller
	}
	useEffect(() => {
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
						<GradientText text={`Welcome to the Club!`} className="text-7xl" />
						<div className="flex text-end w-full gap-3 items-center justify-end">
							<p className="text-primary text-xl">You are registering as a</p>
							{getRoleIcon(roleState)}
							<p className="text-primary text-xl">{roleState[0].toUpperCase() + roleState.slice(1)}</p>
						</div>
						<div className="grid gap-y-6 gap-x-2 grid-cols-2">
							{Object.entries(getFields()!).map(([key, value]) => {
								if (!inputRefs.current[key]) {
									inputRefs.current[key] = React.createRef()
								}
								return <InputField ref={inputRefs.current[key]} key={key} name={key} type={value} />
							})}
							<Button text="Register" className="w-fit" onClick={registerEntity} />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
