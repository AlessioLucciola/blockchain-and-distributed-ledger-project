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
	async addProductInstance({ productInstanceId, productId, soldBy }: { productInstanceId: number; productId: number; soldBy: number }) {
		return this.repository.addProductInstance({ productInstanceId, productId, soldBy })
	}
	async searchProduct({ name }: { name: string }): Promise<Products[]> {
		return this.repository.searchProduct({ name })
	}
}

export default SmartSupplyService
