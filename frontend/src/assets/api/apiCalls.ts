import axios, { AxiosResponse } from "axios"
import { Entity } from "../../shared/types"

export const api = axios.create({
	baseURL: "http://localhost:3000/api",
})

export const getEntities = async ({ role }: { role?: string }): Promise<AxiosResponse<{ message: string }>> => {
	const res = await api.get("/get-entities", { params: { role } })
	return res
}

export const createEntity = async ({ name, surname, email, password, address_1, address_2, companyName, shopName, metamaskAddress, role }: Entity): Promise<AxiosResponse<{ message: string }>> => {
	const res = await api.post("/create-entity", {
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
	return res
}
export const deleteEntity = async ({ id }: { id: string }): Promise<AxiosResponse<{ message: string }>> => {
	const res = await api.delete("/delete-entity", { params: { id } })
	return res
}

export const addProduct = async ({ name, description }: { name: string; description: string }): Promise<AxiosResponse<{ message: string }>> => {
	const res = await api.post("/add-product", { name, description })
	return res
}

export const addProductInstance = async ({ productInstanceId, productId, soldBy }: { productInstanceId: string; productId: string; soldBy: number }): Promise<AxiosResponse<{ message: string }>> => {
	const res = await api.post("/add-product-instance", { productInstanceId, productId, soldBy })
	return res
}
