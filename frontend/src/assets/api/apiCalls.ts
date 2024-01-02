import axios, { AxiosResponse } from "axios"
import { Entity, Product, ProductInstance } from "../../shared/types"
import { addManufacturer } from "../api/contractCalls"

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
    try {
        // Send the POST request to create the entity in the database
        const dbResponse = await api.post("/create-entity", {
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
        });

        switch (role) {
            case "manufacturer":
                const manufacturerAccount = await addManufacturer();

                if (manufacturerAccount) {
                    console.log('Manufacturer account:', manufacturerAccount);
                } else {
                    console.error('Error adding manufacturer');
                }
                break;

            case "customer":
                break;

            case "retailer":
                break;

            case "distributor":
                break;

            default:
                break;
        }

        // Return the response from the database operation
        return dbResponse;
    } catch (error) {
        console.error('Error creating entity:', error);
        throw error;
    }
};

export const deleteEntity = async ({ id }: { id: string }): Promise<AxiosResponse<{ message: string; data: Entity }>> => {
	const res = await api.delete("/delete-entity", { params: { id } })
	return res
}

export const addProduct = async ({ name, description }: { name: string; description: string }): Promise<AxiosResponse<{ message: string; data: Product }>> => {
	const res = await api.post("/add-product", { name, description })
	return res
}

export const addProductInstance = async ({
	productInstanceId,
	productId,
	soldBy,
}: {
	productInstanceId: string
	productId: string
	soldBy: number
}): Promise<AxiosResponse<{ message: string; data: any }>> => {
	//TODO: change any to correct type
	const res = await api.post("/add-product-instance", { productInstanceId, productId, soldBy })
	return res
}
export const searchProduct = async ({ name }: { name: string }): Promise<AxiosResponse<{ data: Product[] }>> => {
	const res = await api.get("/search-product", { params: { name } })
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

export const getEntityInfoFromToken = async (): Promise<AxiosResponse<{ data: Entity }>> => {
	const res = await api.get("/get-entity-info-from-token", { withCredentials: true })
	return res
}

export const login = async ({ email, password }: { email: string; password: string }): Promise<AxiosResponse<{ data: { entity: Entity; token: string } }>> => {
	const res = await api.post("/login", { email, password }, { withCredentials: true })
	return res
}
