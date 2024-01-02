import axios, { AxiosResponse } from "axios"
import { Entity, Product, ProductInstance } from "../../shared/types"

export const api = axios.create({
	baseURL: "http://localhost:3000/api",
})

export const getEntities = async ({ role }: { role?: string }): Promise<AxiosResponse<{ message: string }>> => {
	const res = await api.get("/get-entities", { params: { role } })
	return res
}

export const createEntity = async ({
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
}: Entity): Promise<AxiosResponse<{ message: string; data: Entity }>> => {
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
export const deleteEntity = async ({ id }: { id: string }): Promise<AxiosResponse<{ message: string; data: Entity }>> => {
	const res = await api.delete("/delete-entity", { params: { id } })
	return res
}

export const addProduct = async ({ name, description }: { name: string; description: string }): Promise<AxiosResponse<{ message: string; data: Product }>> => {
	const res = await api.post("/add-product", { name, description })
	return res
}

export const addProductInstance = async ({ productId, soldBy, price }: { productId: string; soldBy: number; price: number }): Promise<AxiosResponse<{ message: string; data: any }>> => {
	//TODO: change any to correct type
	const res = await api.post("/add-product-instance", { productId, soldBy, price })
	return res
}
export const searchProduct = async ({ name, productId, includeInstances }: { name?: string; productId?: number; includeInstances?: boolean }): Promise<AxiosResponse<{ data: Product[] }>> => {
	const res = await api.get("/search-product", { params: { name, productId, includeInstances } })
	return res
}

export const getProductInstanceInfo = async ({ productInstanceId, productId }: { productInstanceId: string; productId: string }): Promise<AxiosResponse<{ data: ProductInstance }>> => {
	const res = await api.get("/get-product-instance-info", { params: { productInstanceId, productId } })
	return res
}

export const getProductInfo = async ({ productId }: { productId: string }): Promise<Product> => {
	const res = await api.get("/get-product-info", { params: { productId } })
	return res.data.data
}

export const getProductInstancesFromSeller = async ({ sellerId }: { sellerId: string }): Promise<AxiosResponse<{ data: ProductInstance[] }>> => {
	const res = await api.get("/get-product-instances-from-seller", { params: { sellerId } })
	return res
}
export const getSellerById = async ({ sellerId }: { sellerId: string }): Promise<AxiosResponse<{ data: Entity }>> => {
	const res = await api.get("/get-seller-by-id", { params: { sellerId } })
	return res
}
export const getEntityInfoFromToken = async (): Promise<AxiosResponse<{ data: Entity }>> => {
	const res = await api.get("/get-entity-info-from-token", { withCredentials: true })
	return res
}

export const login = async ({ email, password }: { email: string; password: string }): Promise<AxiosResponse<{ data: { entity: Entity; token: string } }>> => {
	const res = await api.post("/login", { email, password }, { withCredentials: true })
	return res
}
