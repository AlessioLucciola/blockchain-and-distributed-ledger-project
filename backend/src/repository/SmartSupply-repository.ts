import { Entity, PrismaClient, ProductInstances, Products, Roles } from "@prisma/client"

const prisma: PrismaClient = new PrismaClient()

class SmartSupplyRepository {
	//Put db methods here
	async getEntities({ role }: { role?: Roles }): Promise<Entity[]> {
		return prisma.entity.findMany({
			where: {
				role,
			},
		})
	}
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
		return prisma.entity.create({
			data: {
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
			},
		})
	}
	async deleteEntity({ id }: { id: number }): Promise<Entity> {
		return prisma.entity.delete({
			where: {
				id,
			},
		})
	}
	async addProduct({ name, description }: { name: string; description: string }): Promise<Products> {
		return prisma.products.create({
			data: {
				name,
				description,
			},
		})
	}

	async addProductInstance({ productId, soldBy, price }: { productId: number; soldBy: number; price: number }): Promise<{ productInstance: ProductInstances; updatedProduct: Products }> {
		const productInstance = await prisma.productInstances.create({
			data: {
				productId: productId,
				soldById: soldBy,
				price,
			},
		})
		const updatedProduct = await prisma.products.update({
			where: {
				uid: productId,
			},
			data: {
				productInstances: {
					connect: {
						id: (await productInstance).id,
					},
				},
			},
		})
		return { productInstance, updatedProduct }
	}
	async searchProduct({ name }: { name: string }): Promise<Products[]> {
		return prisma.products.findMany({
			where: {
				name: {
					contains: name,
				},
			},
			include: {
				productInstances: true,
			},
		})
	}
	async getProductInstanceInfo({ productId, productInstanceId }: { productId: number; productInstanceId: number }): Promise<ProductInstances | null> {
		return prisma.productInstances.findUnique({
			where: {
				id: productInstanceId,
				product: {
					uid: productId,
				},
			},
		})
	}
	async getProductInfo({ productId }: { productId: number }): Promise<Products | null> {
		return prisma.products.findUnique({
			where: {
				uid: productId,
			},
			include: {
				productInstances: true,
			},
		})
	}
}
export default SmartSupplyRepository
