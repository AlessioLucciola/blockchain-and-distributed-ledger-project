import { useContext } from "react"
import { SessionContext } from "./SessionProvider"

//This should be needed otherwise this warning:
// Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.eslint(react-refresh/only-export-components)

export function useSessionContext() {
	return useContext(SessionContext)
}
