import { twJoin } from "tailwind-merge"

interface ButtonProps {
	text: string
	className?: string
}
export default function Button({ text, className }: ButtonProps) {
	return (
		<div
			className={twJoin(
				"shadow-lg bg-gradient-to-b from-secondary to-background rounded-xl flex flex-col text-text text-bold text-xl p-4 px-14 justify-center items-center font-bold",
				className
			)}
		>
			{text}
		</div>
	)
}
