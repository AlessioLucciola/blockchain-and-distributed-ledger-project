import Button from "../components/Button"
import { addManufacturer } from "../assets/api/contractCalls"
import { addProductForDemo, registerEntities } from "../scripts/addProductForDemo"

export default function Home() {
	return (
		<>
			<div className="bg-hero bg-cover bg-no-repeat h-screen w-screen">
				<div className="flex flex-col h-full w-full pl-36 items-center justify-center">
					<div className="flex flex-col h-fit w-fit gap-6">
						<Button text="Send request to Blockchain" onClick={() => addManufacturer()} />
                        <Button text="Register Entities" onClick={() => registerEntities()} />
                        <Button text="Add Product" onClick={() => addProductForDemo()} />
					</div>
				</div>
			</div>
		</>
	)
}