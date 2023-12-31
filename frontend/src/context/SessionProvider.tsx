import React, { useEffect } from "react"
import { createContext, useState } from "react"
import { useCookies } from "react-cookie"
import { getEntityInfoFromToken } from "../assets/api/apiCalls"
import { Entity } from "../shared/types"

export const SessionContext = createContext({
	entityInfo: undefined as Entity | undefined,
	logout: () => {},
})

interface Props {
	children: React.ReactNode
}
export function SessionProvider({ children }: Props) {
	const [cookies, removeCookie] = useCookies()
	const [entityInfo, setEntityInfo] = useState<Entity>()
	const contextValue = {
		logout,
		entityInfo,
	}

	async function getUserIdFromJWT() {
		const { data } = await getEntityInfoFromToken()
		console.log(data)
		setEntityInfo(data.data)
	}

	useEffect(() => {
		if (cookies.entityToken && !entityInfo) {
			getUserIdFromJWT()
		}
	}, [entityInfo])

	function logout() {
		removeCookie("entityToken")
	}

	return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>
}
