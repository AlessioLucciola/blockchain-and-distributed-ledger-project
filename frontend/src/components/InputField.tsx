import React from "react"
interface InputFieldProps {
	name: string
	type: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const InputField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(({ name, type, onChange }, ref) => {
	return (
		<div className="relative">
			<p className="bg-background rounded-lg h-fit shadow-lg text-primary p-1 px-2 top-[-20px] left-2 absolute">{name}</p>
			{type === "textarea" ? (
				<textarea className="rounded-xl h-40 pt-4 pl-3 w-[300px]" ref={ref as React.RefObject<HTMLTextAreaElement>} onChange={onChange} />
			) : (
				<input type={type} className="rounded-xl h-10 pl-3 w-[300px]" ref={ref as React.RefObject<HTMLInputElement>} onChange={onChange} />
			)}
		</div>
	)
})

export default InputField
