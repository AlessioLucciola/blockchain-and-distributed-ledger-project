import { Entity, ProductInstances, Products, Roles } from "@prisma/client"
import SmartSupplyRepository from "../repository/SmartSupply-repository"
import { generateToken, resolveToken } from "../../utils/authUtils"

class SmartSupplyService {
	repository: SmartSupplyRepository

	constructor() {
		this.repository = new SmartSupplyRepository()
	}
	async getEntities({ role }: { role?: Roles }): Promise<Entity[]> {
		return this.repository.getEntities({ role })
	}
	async createEntity({ name, surname, email, password, address_1, address_2, companyName, shopName, metamaskAddress, role }: Omit<Entity, "id">): Promise<Entity> {
		return this.repository.createEntity({ name, surname, email, password, address_1, address_2, companyName, shopName, metamaskAddress, role })
	}
	async deleteEntity({ id }: { id: number }): Promise<Entity> {
		return this.repository.deleteEntity({ id })
	}
	async addProduct({ name, description }: { name: string; description: string }): Promise<Products> {
		return this.repository.addProduct({ name, description })
	}
	async addProductInstance({ productId, soldBy, price }: { productId: number; soldBy: number; price: number }) {
		return this.repository.addProductInstance({ productId, soldBy, price })
	}
	async searchProduct({ name, productId, includeInstances }: { name?: string; productId?: number; includeInstances?: boolean }): Promise<Products[]> {
		if (includeInstances === undefined || includeInstances === null) includeInstances = false
		return this.repository.searchProduct({ name, productId, includeInstances })
	}
	async getProductInstanceInfo({ productInstanceId, productId }: { productId: number; productInstanceId: number }): Promise<any> {
		return this.repository.getProductInstanceInfo({ productInstanceId, productId })
	}
	async getProductInfo({ productId }: { productId: number }): Promise<Products | null> {
		return this.repository.getProductInfo({ productId })
	}
	async login({ email, password }: { email: string; password: string }): Promise<{ entity: Entity; token: string } | null> {
		const entity = await this.repository.getEntityByEmail({ email })
		if (!entity) throw new Error(`Entity with email ${email} not found`)
		if (entity.password !== password) throw new Error("Inserted password doesn't match the one in the database")
		const token = generateToken({
			payload: {
				...entity,
			},
		})
		return { entity, token }
	}
	async getEntityInfoFromToken({ token }: { token: string }): Promise<Entity> {
		const decoded = resolveToken({ token }) as { payload: Entity; iat: number; exp: number }
		if (!decoded) throw new Error(`Entity with token ${token} not found`)
		return decoded.payload as Entity
	}
	async getProductsInstancesFromSeller({ sellerId }: { sellerId: number }): Promise<ProductInstances[]> {
		return this.repository.getProductsInstancesFromSeller({ sellerId })
	}
}

export default SmartSupplyService
