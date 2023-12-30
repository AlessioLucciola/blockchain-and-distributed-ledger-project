import { useEffect, useState } from "react"
import GradientText from "../components/GradientText"
import Navbar from "../components/Navbar"
import { Roles } from "../shared/constants"
import { SearchIcon } from "../shared/icons"
import { SearchResult } from "../shared/types"
import React from "react"
import ProductCard from "../components/ProductCard"

export default function Search() {
	const [search, setSearch] = useState<string>("")
	const [results, setResults] = useState<SearchResult[]>([])

	const fakeResults: SearchResult[] = [
		{
			id: "00121289123",
			name: "Nike Air Force 1",
			image: "src/assets/placeholders/nike-dunk-low-diffused-taupe.png",
		},
		{
			id: "00121289123",
			name: "Nike Air Force 1",
			image: "src/assets/placeholders/nike-dunk-low-diffused-taupe.png",
		},
		{
			id: "00121289123",
			name: "Nike Air Force 1",
			image: "src/assets/placeholders/nike-dunk-low-diffused-taupe.png",
		},
		{
			id: "00121289123",
			name: "Nike Air Force 1",
			image: "src/assets/placeholders/nike-dunk-low-diffused-taupe.png",
		},
	]

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			event.preventDefault()
			setSearch((event.target as HTMLInputElement).value)
		}
	}

	useEffect(() => {
		const params = new URLSearchParams()
		params.set("search", search)
		window.history.replaceState(null, "", `?${params.toString()}`)
	}, [search])

	return (
		<div className="bg-background h-screen w-screen overflow-scroll">
			<Navbar role={Roles.CUSTOMER} showLinks={false} />
			<div className="flex flex-col mt-36 w-screen gap-10 items-center align-center ">
				<GradientText text={`What do you want to buy today?`} className="text-5xl" />
				<div className="w-[50%] relative">
					<SearchIcon className="h-fit my-auto top-[50%] left-3 w-7 translate-y-[-50%] absolute" />
					<input className="bg-text rounded-2xl text-xl w-full p-5 pl-12" placeholder="Air Force One" onKeyDown={handleKeyDown} />
				</div>
			</div>
			{search && (
				<div className="mx-10 pt-10">
					<span className="flex gap-2 items-center">
						<p className="font-semibold text-text text-4xl drop-shadow-lg">Results for: </p>
						<GradientText text={search} className="text-4xl" />
					</span>
					<div className="flex flex-wrap pt-10 gap-5">
						{fakeResults.map(({ name, id, image }) => (
							<ProductCard name={name} id={id} price={"100"} image={image} />
						))}
					</div>
				</div>
			)}
		</div>
	)
}
