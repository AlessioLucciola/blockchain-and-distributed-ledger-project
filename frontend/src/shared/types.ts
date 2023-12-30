import { Roles } from "./constants"

export type SearchResult = {
	id: string
	name: string
	image: string
}

export type Entity = {
	id?: string
	name: string
	surname: string
	email: string
	password: string
	address_1: string
	address_2?: string
	companyName?: string
	shopName?: string
	metamaskAddress: string
	role: Roles
}

export type Product = {
	uid?: string
	name: string
	description: string
	productInstances: ProductInstance[]
}

export type ProductInstance = {
	id?: string
	productId: string
}
