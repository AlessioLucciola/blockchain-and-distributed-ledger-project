import axios from "axios"
import { Entity } from "../../shared/types"

export const api = axios.create({
	baseURL: "http://localhost:3000/api",
})

export const getEntities = async ({ role }: { role?: string }) => {
	const { data } = await api.get("/get-entities", { params: { role } })
	return data
}

export const createEntity = async ({ name, surname, email, password, address_1, address_2, companyName, shopName, metamaskAddress, role }: Entity) => {
	const { data } = await api.post("/create-entity", {
		name,
		surname,
		email,
		password,
		address_1,
		address_2,
		companyName,
		shopName,
		metamaskAddress,
		role,
	})
	return data
}
export const deleteEntity = async ({ id }: { id: string }) => {
	const { data } = await api.delete("/delete-entity", { params: { id } })
	return data
}

export const addProduct = async ({ name, description }: { name: string; description: string }) => {
	const { data } = await api.post("/add-product", { name, description })
	return data
}

export const addProductInstance = async ({ productInstanceId, productId, soldBy }: { productInstanceId: string; productId: string; soldBy: number }) => {
	const { data } = await api.post("/add-product-instance", { productInstanceId, productId, soldBy })
	return data
}
