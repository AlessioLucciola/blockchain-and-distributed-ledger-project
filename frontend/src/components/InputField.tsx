import React from "react"
interface InputFieldProps {
	name: string
	type: string
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(({ name, type }, ref) => {
	return (
		<div className="relative">
			<p className="bg-background rounded-lg h-fit shadow-lg text-primary p-1 px-2 top-[-20px] left-2 absolute">{name}</p>
			<input type={type} className="rounded-xl h-10 pl-3 w-[300px]" ref={ref} />
		</div>
	)
})

export default InputField
