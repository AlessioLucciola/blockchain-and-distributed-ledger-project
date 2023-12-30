import { Entity, Products, Roles } from "@prisma/client"
import SmartSupplyRepository from "../repository/SmartSupply-repository"

class SmartSupplyService {
	repository: SmartSupplyRepository

	constructor() {
		this.repository = new SmartSupplyRepository()
	}
	async getEntities({ role }: { role?: Roles }): Promise<Entity[]> {
		return this.repository.getEntities({ role })
	}
	//Insert methods here
	async createEntity({
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
	}: {
		name: string
		surname?: string
		email: string
		password: string
		address_1: string
		address_2?: string
		companyName?: string
		shopName?: string
		metamaskAddress: string
		role: Roles
	}): Promise<Entity> {
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
	async searchProduct({ name }: { name: string }): Promise<Products[]> {
		return this.repository.searchProduct({ name })
	}
	async getProductInstanceInfo({ productInstanceId, productId }: { productId: number; productInstanceId: number }): Promise<any> {
		return this.repository.getProductInstanceInfo({ productInstanceId, productId })
	}
	async getProductInfo({ productId }: { productId: number }): Promise<Products | null> {
		return this.repository.getProductInfo({ productId })
	}
}

export default SmartSupplyService
