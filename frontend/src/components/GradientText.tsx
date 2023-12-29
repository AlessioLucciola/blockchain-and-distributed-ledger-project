import { twJoin } from "tailwind-merge"
interface GradientTextProps {
	text: string
	className?: string
}
export default function GradientText({ text, className }: GradientTextProps) {
	return <p className={twJoin("bg-gradient-to-b bg-clip-text from-text to-secondary font-bold text-transparent drop-shadow-lg", className)}>{text}</p>
}
