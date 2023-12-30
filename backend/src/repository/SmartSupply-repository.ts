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
		surname: string
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

	async addProductInstance({ productInstanceId, productId }: { productInstanceId: number; productId: number }): Promise<{ productInstance: ProductInstances; updatedProduct: Products }> {
		const productInstance = await prisma.productInstances.create({
			data: {
				productId: productInstanceId,
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
}
export default SmartSupplyRepository
