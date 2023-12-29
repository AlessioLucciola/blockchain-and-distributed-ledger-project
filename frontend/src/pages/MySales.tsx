import Navbar from "../components/Navbar"
import { Roles } from "../shared/constants"

export default function MySales() {
	return (
		<div className="bg-background h-screen w-screen pb-20 overflow-y-scroll">
			<Navbar showLinks={false} role={Roles.MANUFACTURER} />
			<div className="mt-36 px-10"></div>
		</div>
	)
}
