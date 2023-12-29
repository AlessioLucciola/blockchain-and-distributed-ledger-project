import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import { Roles } from "../shared/constants"
import { SearchIcon } from "../shared/icons"

export default function Search() {
	return (
		<div className="bg-background h-screen w-screen overflow-scroll">
			<Navbar role={Roles.CUSTOMER} showLinks={false} />
			<div className="flex flex-col mt-36 w-screen gap-10 items-center align-center ">
				<GradientText text={`What do you want to buy today?`} className="text-5xl" />
				<Searchbar />
			</div>
		</div>
	)
}

function Searchbar() {
	return (
		<div className="w-[50%] relative">
			<SearchIcon className="h-fit my-auto top-[50%] left-3 w-7 translate-y-[-50%] absolute" />
			<input className="bg-text rounded-2xl text-xl w-full p-5 pl-12" placeholder="Air Force One" />
		</div>
	)
}
