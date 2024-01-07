import {
    Entity,
    PrismaClient,
    ProductInstances,
    Products,
    Roles,
    Verifications,
} from "@prisma/client"

import { VerificationsWithEntity } from "../../shared/types"
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
    }: Omit<Entity, "id">): Promise<Entity> {
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
    async getEntityByAddress({
        address,
    }: {
        address: string
    }): Promise<Entity | null> {
        return prisma.entity.findUnique({
            where: {
                metamaskAddress: address,
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
    async addProduct({
        name,
        description,
    }: {
        name: string
        description: string
    }): Promise<Products> {
        return prisma.products.create({
            data: {
                name,
                description,
            },
        })
    }

    async addProductInstance({
        productId,
        soldBy,
        price,
    }: {
        productId: number
        soldBy: number
        price: number
    }): Promise<{
        productInstance: ProductInstances
        updatedProduct: Products
    }> {
        const productInstance = await prisma.productInstances.create({
            data: {
                productId: productId,
                currentOwner: soldBy,
                previousOwner: soldBy,
                manufacturerId: soldBy,
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
    async searchProduct({
        name,
        productId,
        includeInstances,
    }: {
        name?: string
        productId?: number
        includeInstances: boolean
    }): Promise<Products[]> {
        return prisma.products.findMany({
            where: {
                name: name
                    ? {
                          contains: name,
                      }
                    : undefined,
                uid: productId ? productId : undefined,
            },
            include: {
                productInstances: includeInstances,
            },
        })
    }
    async getProductsInstancesFromSeller({
        sellerId,
    }: {
        sellerId: number
    }): Promise<ProductInstances[]> {
        return prisma.productInstances.findMany({
            where: {
                OR: [
                    {
                        currentOwner: sellerId,
                        productState: {
                            in: [0, 1, 4],
                        },
                    },
                    {
                        previousOwner: sellerId,
                        productState: 2,
                    },
                ],
            },
            include: {
                product: true,
            },
        })
    }
    async getProductInstanceInfo({
        productId,
        productInstanceId,
    }: {
        productId: number
        productInstanceId: number
    }): Promise<ProductInstances | null> {
        return prisma.productInstances.findUnique({
            where: {
                id: productInstanceId,
                product: {
                    uid: productId,
                },
            },
        })
    }
    async getProductInfo({
        productId,
    }: {
        productId: number
    }): Promise<Products | null> {
        return prisma.products.findUnique({
            where: {
                uid: productId,
            },
            include: {
                productInstances: true,
            },
        })
    }
    async getEntityByEmail({
        email,
    }: {
        email: string
    }): Promise<Entity | null> {
        return prisma.entity.findUnique({
            where: {
                email,
            },
        })
    }
    async getSellerById({ id }: { id: number }): Promise<Entity | null> {
        return prisma.entity.findUnique({
            where: {
                id,
            },
        })
    }
    async addVerificationId({
        userID,
        verificationID,
    }: {
        userID: number
        verificationID: string
    }): Promise<Verifications> {
        return prisma.verifications.create({
            data: {
                entityId: userID,
                verificationId: verificationID,
            },
        })
    }
    async getVerificationInfoById({
        userID,
    }: {
        userID: number
    }): Promise<Verifications | null> {
        return prisma.verifications.findUnique({
            where: {
                entityId: userID,
            },
        })
    }
    async getVerifications(): Promise<VerificationsWithEntity[]> {
        return prisma.verifications.findMany({
            include: {
                entity: true,
            },
        })
    }

    async getPendingVerifications(): Promise<VerificationsWithEntity[]> {
        return prisma.verifications.findMany({
            where: {
                accountVerified: false,
            },
            include: {
                entity: true,
            },
        })
    }
    async updateVerificationPayment({
        id,
        verificationPaid,
    }: {
        id: number
        verificationPaid: boolean
    }): Promise<Verifications> {
        const dataToUpdate: {
            verificationPaid?: boolean
        } = {}
        dataToUpdate.verificationPaid = verificationPaid

        return prisma.verifications.update({
            where: {
              id: id,
            },
            data: dataToUpdate,
        })
    }
    async updateVerificationGranted({
        id,
        accountVerified,
    }: {
        id: number
        accountVerified: boolean
    }): Promise<Verifications> {
        const dataToUpdate: {
            accountVerified?: boolean
        } = {}
        dataToUpdate.accountVerified = accountVerified

        return prisma.verifications.update({
            where: {
              id: id,
            },
            data: dataToUpdate,
        })
    }
    async deleteVerification({ id }: { id: number }): Promise<Verifications> {
        return prisma.verifications.delete({
            where: {
                id: id,
            },
        })
    }
}
export default SmartSupplyRepository
