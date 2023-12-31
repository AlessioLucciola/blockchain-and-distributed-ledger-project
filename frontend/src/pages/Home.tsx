import { useNavigate } from "react-router-dom"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import { Roles } from "../shared/constants"
import { CartIcon, StoreIcon, TagIcon } from "../shared/icons"
import { getRoleIcon } from "../utils/renderUtils"
import React, { useContext, useEffect } from "react"
import { SessionContext } from "../context/SessionProvider"
export default function Home() {
	const navigate = useNavigate()
	const sessionContext = useContext(SessionContext)

	useEffect(() => {
		console.log(sessionContext.entityInfo)
	}, [])

	return (
		<div className="bg-background h-screen w-screen overflow-y-scroll">
			<Navbar showLinks={true} overrideLinks={[{ name: "Logout", action: () => console.log("Logout!") }]} />
			<div className="flex flex-col pt-36 items-center justify-center">
				<GradientText text="Welcome Back!" className="text-7xl" />
				<span className="flex pt-2 gap-2 items-center justify-center">
					{getRoleIcon(Roles.CUSTOMER)}
					<p className="font-semibold text-text text-2xl">Domiziano scarcelli</p>
				</span>
			</div>
			<div className="flex pt-40 gap-5 items-center justify-center">
				<Card title="My Sales" Icon={TagIcon} onClick={() => navigate("/sales")} />
				<Card title="My Orders" Icon={CartIcon} onClick={() => navigate("/orders")} />
				<Card title="My Shop" Icon={StoreIcon} onClick={() => navigate("/shop")} />
			</div>
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
