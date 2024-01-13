import { Entity, ProductInstances, Products, Roles, Verifications } from "@prisma/client"
import SmartSupplyRepository from "../repository/SmartSupply-repository"
import { generateToken, resolveToken } from "../../utils/authUtils"
import { VerificationsWithEntity } from "../../shared/types"

class SmartSupplyService {
	repository: SmartSupplyRepository

	constructor() {
		this.repository = new SmartSupplyRepository()
	}
	async getEntities({ role }: { role?: Roles }): Promise<Entity[]> {
		return this.repository.getEntities({ role })
	}
	async getEntityByAddress({ address }: { address: string }): Promise<Entity | null> {
		return this.repository.getEntityByAddress({ address })
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
	async addProductInstance({ productId, soldBy, manufacturerPrice }: { productId: number; soldBy: number; manufacturerPrice: number }) {
		return this.repository.addProductInstance({ productId, soldBy, manufacturerPrice })
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
	async login({ email, password, metamaskAddress }: { email: string; password: string, metamaskAddress: string }): Promise<{ entity: Entity; token: string } | null> {
		const entity = await this.repository.getEntityByEmail({ email })
		if (!entity) throw new Error(`Entity with email ${email} not found`)
		if (entity.password !== password) throw new Error("Inserted password doesn't match the one in the database")
		if (entity.metamaskAddress.toString() !== metamaskAddress.toString()) throw new Error("Inserted metamask address doesn't match the one in the database")
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
	async getSellerById({ id }: { id: number }): Promise<Entity | null> {
		return this.repository.getSellerById({ id })
	}
	async addVerificationID({ userID, verificationID }: { userID: number; verificationID: string }): Promise<Verifications> {
		return this.repository.addVerificationId({ userID, verificationID })
	}
	async getVerificationInfoById({ userID }: { userID: number }): Promise<Verifications | null> {
		return this.repository.getVerificationInfoById({ userID })
	}
	async getVerifications(): Promise<VerificationsWithEntity[]> {
		return this.repository.getVerifications()
	}
	async getPendingVerifications(): Promise<VerificationsWithEntity[]> {
		return this.repository.getPendingVerifications()
	}
	async deleteVerification({ id }: { id: number }): Promise<Verifications> {
		return this.repository.deleteVerification({ id })
	}
	async updateVerificationPayment({ id, verificationPaid }: { id: number; verificationPaid: boolean }): Promise<Verifications> {
		return this.repository.updateVerificationPayment({ id, verificationPaid })
	}
	async updateVerificationGranted({ id, accountVerified }: { id: number; accountVerified: boolean }): Promise<Verifications> {
		return this.repository.updateVerificationGranted({ id, accountVerified })
	}
	async productChangeOnSaleManufacturer({ productInstanceId, manufacturerPrice }: { productInstanceId: number, manufacturerPrice: number }): Promise<ProductInstances> {
		return this.repository.productChangeOnSaleManufacturer({ productInstanceId, manufacturerPrice })
	}
	async productChangeOnSaleDistributor({ productInstanceId, distributorPrice }: { productInstanceId: number, distributorPrice: number }): Promise<ProductInstances> {
		return this.repository.productChangeOnSaleDistributor({ productInstanceId, distributorPrice })
	}
	async productChangeOnSaleRetailer({ productInstanceId, retailerPrice }: { productInstanceId: number, retailerPrice: number }): Promise<ProductInstances> {
		return this.repository.productChangeOnSaleRetailer({ productInstanceId, retailerPrice })
	}
	async productChangeNotOnSale({ productInstanceId  }: { productInstanceId: number }): Promise<ProductInstances> {
		return this.repository.productChangeNotOnSale({ productInstanceId })
	}
	async getProductsOnSale({ role }: { role: Roles }): Promise<ProductInstances[]> {
		return this.repository.getProductsOnSale({ role })
	}
	async purchaseProduct({ productInstanceId, buyerId, oldOwnerId, currentRole }: { productInstanceId: number; buyerId: number, oldOwnerId: number, currentRole: Roles }): Promise<ProductInstances> {
		return this.repository.purchaseProduct({ productInstanceId, buyerId, oldOwnerId, currentRole })
	}
	async getOrders({ id, role }: { id: number, role: Roles }): Promise<ProductInstances[]> {
		return this.repository.getOrders({ id, role })
	}
	async shipProduct({ productInstanceId }: { productInstanceId: number }): Promise<ProductInstances> {
		return this.repository.shipProduct({ productInstanceId })
	}
	async getSoldProducts({ id, role }: { id: number, role: Roles }): Promise<ProductInstances[]> {
		return this.repository.getSoldProducts({ id, role })
	}
	async receiveProduct({ productInstanceId, role }: { productInstanceId: number, role: Roles }): Promise<ProductInstances> {
		return this.repository.receiveProduct({ productInstanceId, role })
	}
}

export default SmartSupplyService
