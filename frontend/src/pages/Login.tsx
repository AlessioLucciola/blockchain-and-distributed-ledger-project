import { useRef } from "react"
import { login } from "../assets/api/apiCalls"
import Button from "../components/Button"
import GradientText from "../components/GradientText"
import InputField from "../components/InputField"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

export default function Login() {
	const navigate = useNavigate()
	const emailRef = useRef<HTMLInputElement>(null)
	const passwordRef = useRef<HTMLInputElement>(null)
	const performLogin = async () => {
		try {
			const res = await login({ email: emailRef.current!.value, password: passwordRef.current!.value })
			navigate("/home")
		} catch {
			alert("Error")
		}
	}
	return (
		<>
			<Navbar />
			<div className="bg-hero bg-cover bg-no-repeat h-screen w-screen">
				<div className="flex flex-col h-full w-full pl-36 items-center justify-center">
					<div className="flex flex-col h-fit w-fit gap-6">
						<GradientText text="Who are you?" className="text-7xl" />
						<InputField name="Email" type="email" ref={emailRef} />
						<InputField name="Password" type="password" ref={passwordRef} />
						<p className="cursor-pointer font-bold text-primary pt-1 hover:underline">I forgot my password :(</p>
						<Button text="Log In" className="w-fit" onClick={performLogin} />
					</div>
				</div>
			</div>
		</>
	)
}
