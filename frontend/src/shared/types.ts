import { ProductStage, ProductLocation, Roles } from "./constants"

export type SearchResult = {
    id: string
    name: string
    image: string
}

export type Entity = {
    id?: string
    name: string
    surname?: string
    email: string
    password: string
    address_1: string
    address_2?: string
    companyName?: string
    shopName?: string
    metamaskAddress: string
    verificationID: string
    accountVerified: boolean
    role: Roles
}

export type Product = {
    uid?: string
    name: string
    description: string
    productInstances: ProductInstance[]
}

export type ProductInstance = {
    id?: string
    productId: string
    manufacturerPrice: number
    distributorPrice: number
    retailerPrice: number
    product?: Product
    currentOwner: string
    previousOwner: string
    creationDate: string
    productState: ProductStage
    productLocation: ProductLocation
    manufacturerId: string
    distributorId: string
    retailerId: string
    customerId: string
    bankTransaction: BankTransaction
    rewards: GivenRewards
}

export type ProductOwnership = {
    manufacturer: string
    distributor: string
    retailer: string
    customer: string
}

export type Verifications = {
    id: string
    entityId: string
    verificationId: string
    accountVerified: boolean
    verificationPaid: boolean
}

export type VerificationWithEntity = {
    id: string
    entityId: string
    verificationId: string
    accountVerified: boolean
    verificationPaid: boolean
    entity: Entity
}

export type BankTransaction = {
    distributorBankTransactionID: string
    retailerBankTransactionID: string
}

export type GivenRewards = {
    manufacturerRewarded: boolean
    distributorRewarded: boolean
    retailerRewarded: boolean
}
