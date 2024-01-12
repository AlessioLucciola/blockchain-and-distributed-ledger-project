import Button from "../components/Button"
import GradientText from "../components/GradientText"

interface Props {
	message: string
	buttons: {
		text: string
		onClick: () => void
	}[]
	className?: string
}
export default function MessagePage({ message, buttons, className }: Props) {
	return (
		<div className="bg-background h-screen w-screen overflow-y-scroll">
			<div className={`flex flex-col h-screen text-center w-full gap-10 justify-center items-center ${className}`}>
				<GradientText text={message} className="text-3xl" />
				<span className="flex flex-col gap-10 sm:flex-row">
					{buttons.map(({ text, onClick }, index) => (
						<div key={index}>
							<Button text={text} className="h-14" onClick={onClick} />
						</div>
					))}
				</span>
			</div>
		</div>
	)
}
