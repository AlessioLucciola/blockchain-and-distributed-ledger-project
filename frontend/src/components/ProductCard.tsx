import { GRADIENTS } from "../shared/constants"

interface ProductCardProps {
	name: string
	id: string
	price: string
	image: string
	onClick?: () => void
}
export default function ProductCard({ name, image, onClick }: ProductCardProps) {
	return (
		<div
			className={`bg-${GRADIENTS["div-gradient"]} rounded-3xl flex flex-col pb-3 items-center justify-center shadow-lg hover:shadow-black px-3 cursor-pointer min-w-[300px] max-w-[300px]`}
			onClick={onClick}
		>
			<img src={image} alt="product image" className="h-fit w-[300px]" />
			<p className="text-text text-xl px-3 pb-3 drop-shadow-lg">{name}</p>
		</div>
	)
}
