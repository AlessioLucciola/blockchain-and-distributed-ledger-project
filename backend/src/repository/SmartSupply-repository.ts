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
        manufacturerPrice,
    }: {
        productId: number
        soldBy: number
        manufacturerPrice: number
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
                manufacturerPrice,
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
                            in: [-1, 0, 1, 4],
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
    async productChangeOnSaleManufacturer({
        productInstanceId,
        manufacturerPrice,
    }: {
        productInstanceId: number
        manufacturerPrice: number
    }): Promise<ProductInstances> {
        return prisma.productInstances.update({
            where: {
                id: productInstanceId,
            },
            data: {
                productState: 1,
                manufacturerPrice: manufacturerPrice,
            }
        })
    }
    async productChangeOnSaleDistributor({
        productInstanceId,
        distributorPrice,
    }: {
        productInstanceId: number
        distributorPrice: number
    }): Promise<ProductInstances> {
        return prisma.productInstances.update({
            where: {
                id: productInstanceId,
            },
            data: {
                productState: 1,
                distributorPrice: distributorPrice,
            }
        })
    }
    async productChangeOnSaleRetailer({
        productInstanceId,
        retailerPrice,
    }: {
        productInstanceId: number
        retailerPrice: number
    }): Promise<ProductInstances> {
        return prisma.productInstances.update({
            where: {
                id: productInstanceId,
            },
            data: {
                productState: 1,
                retailerPrice: retailerPrice,
            }
        })
    }
    async productChangeNotOnSale({
        productInstanceId,
    }: {
        productInstanceId: number
    }): Promise<ProductInstances> {
        return prisma.productInstances.update({
            where: {
                id: productInstanceId,
            },
            data: {
                productState: -1,
            }
        })
    }
    async getProductsOnSale({ role }: { role: Roles }): Promise<ProductInstances[]> {
        return prisma.productInstances.findMany({
            where: {
                productState: 1,
                owner: {
                    role: role
                }
            },
            include: {
                product: true,
            },
        })
    }
    async purchaseProduct({ productInstanceId, price, buyerId, oldOwnerId, currentRole }: { productInstanceId: number; price: number, buyerId: number, oldOwnerId: number, currentRole: Roles }): Promise<ProductInstances> {
        let updateData: Record<string, any> = {
            productState: 2,
            currentOwner: buyerId,
            previousOwner: oldOwnerId,
        }

        switch (currentRole) {
            case Roles.manufacturer:
                updateData = { ...updateData, manufacturerId: buyerId }
                break
            case Roles.distributor:
                updateData = { ...updateData, distributorPrice: price, distributorId: buyerId }
                break
            case Roles.retailer:
                updateData = { ...updateData, retailerPrice: price, retailerId: buyerId }
                break
            case Roles.customer:
                updateData = { ...updateData, customerId: buyerId }
                break
            default:
                break
        }
        
        return prisma.productInstances.update({
            where: {
                id: productInstanceId,
            },
            data: updateData,
        })
    }
    async getOrders({ id, role }: { id: number, role: Roles }): Promise<ProductInstances[]> {
        let whereClause: any = {}

        if (role === Roles.distributor) {
            whereClause = {
                distributorId: {
                    equals: id,
                    not: null,
                },
            }
        } else if (role === Roles.retailer) {
            whereClause = {
                retailerId: {
                    equals: id,
                    not: null,
                },
            }
        } else if (role === Roles.customer) {
            whereClause = {
                customerId: {
                    equals: id,
                    not: null,
                },
            }
        }

        return prisma.productInstances.findMany({
            where: {
                ...whereClause,
            },
            include: {
                product: true,
            },
        })
    }
    async shipProduct({ productInstanceId }: { productInstanceId: number }): Promise<ProductInstances> {
        return prisma.productInstances.update({
            where: {
                id: productInstanceId,
            },
            data: {
                productState: 3,
                productLocation: 4
            }
        })
    }
    async getSoldProducts({ id, role }: { id: number, role: Roles }): Promise<ProductInstances[]> {
        let whereClause: any = {}

        if (role === Roles.manufacturer) {
            whereClause = {
                AND: [
                    {
                        manufacturerId: {
                            equals: id,
                        },
                    },
                    {
                        distributorId: {
                            not: null,
                        },
                    },
                ],
            }
        } else if (role === Roles.distributor) {
            whereClause = {
                AND: [
                    {
                        distributorId: {
                            equals: id,
                        },
                    },
                    {
                        retailerId: {
                            not: null,
                        },
                    },
                ],
            }
        } else if (role === Roles.retailer) {
            whereClause = {
                AND: [
                    {
                        retailerId: {
                            equals: id,
                        },
                    },
                    {
                        customerId: {
                            not: null,
                        },
                    },
                ],
            }
        }

        return prisma.productInstances.findMany({
            where: {
                ...whereClause,
            },
            include: {
                product: true,
            },
        })
    }
    async receiveProduct({ productInstanceId, role }: { productInstanceId: number, role: Roles }): Promise<ProductInstances> {
        let updateData: Record<string, any> = {
            productState: 4,
        }

        switch (role) {
            case Roles.distributor:
                updateData = { ...updateData, productLocation: 1 }
                break
            case Roles.retailer:
                updateData = { ...updateData, productLocation: 2 }
                break
            case Roles.customer:
                updateData = { ...updateData, productLocation: 3 }
                break
            default:
                break
        }
        
        return prisma.productInstances.update({
            where: {
                id: productInstanceId,
            },
            data: updateData,
        })
    }
}
export default SmartSupplyRepository
