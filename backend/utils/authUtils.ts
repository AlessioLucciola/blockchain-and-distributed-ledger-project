import jwt from "jsonwebtoken"

export function generateToken({ payload }: { payload: Object }): string {
	const token = jwt.sign({ payload }, process.env.JWT_SECRET as string, { expiresIn: "1h" })
	return token
}

export function resolveToken({ token }: { token: string }): Object {
	const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
	return decoded
}
