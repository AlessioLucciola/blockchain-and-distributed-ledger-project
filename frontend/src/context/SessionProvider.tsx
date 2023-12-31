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
/**
 * This component is used to store the session information of the user.
 * In order to use it just initializea const sessionContext = useSessionContext() in any component as an hook,
 * and you will be able to access the information inside the sessionContext.entityInfo object
 */
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
		const fetchData = async () => {
			if (cookies.entityToken && !entityInfo) {
			try {
				const { data } = await getEntityInfoFromToken();
				setEntityInfo(data.data);
			} catch (error) {
				console.error("Error fetching entity info:", error);
			}
			}
		};
		
		fetchData(); // Call the async function
		
	}, [cookies.entityToken, entityInfo]);

	function logout() {
		removeCookie("entityToken")
		window.location.reload()
	}

	return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>
}
