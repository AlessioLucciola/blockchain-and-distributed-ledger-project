import axios, { AxiosResponse } from "axios"
import { Entity, Product, ProductInstance, VerificationWithEntity, Verifications } from "../../shared/types"
import { getProductStageFromId, getProductLocationFromId, formatUnixTimestampToDatetime } from "../../utils/typeUtils"
import { addCustomer, addDistributor, addManufacturer, addRetailer, getContractProductInfo, getEntityRole, grantVerificationPermission, isManufacturer, produceProduct, removeCustomer, removeDistributor, removeManufacturer, removeRetailer, verifyEntity } from "../api/contractCalls"

export const api = axios.create({
	baseURL: "http://localhost:3000/api",
})

export const getEntities = async ({ role }: { role?: string }): Promise<AxiosResponse<{ message: string }>> => {
	const res = await api.get("/get-entities", { params: { role } })
	return res
}

export const getEntityByAddress = async ({ address }: { address: string }): Promise<AxiosResponse<{ data: Entity }>> => {
	const res = await api.get("/get-entity-by-address", { params: { address } })
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
}: Entity): Promise<AxiosResponse<{ message: string; data: Entity }, any> | undefined> => {
    try {
        switch (role) {
            case "manufacturer":
                const manufacturerAccount = await addManufacturer()

                if (manufacturerAccount) {
					console.log('Manufacturer account:', manufacturerAccount)
                    metamaskAddress = manufacturerAccount
                } else {
                    const error = console.error('Error adding manufacturer')
					throw error
                }
				break
            case "customer":
				const customerAccount = await addCustomer()

                if (customerAccount) {
					console.log('Customer account:', customerAccount)
                    metamaskAddress = customerAccount
                } else {
                    const error = console.error('Error adding customer')
					throw error
                }
                break
            case "retailer":
				const retailerAccount = await addRetailer()

                if (retailerAccount) {
					console.log('Retailer account:', retailerAccount)
                    metamaskAddress = retailerAccount
                } else {
                    const error = console.error('Error adding retailer')
					throw error
                }
                break
            case "distributor":
                const distributorAccount = await addDistributor()

                if (distributorAccount) {
					console.log('Distributor account:', distributorAccount)
                    metamaskAddress = distributorAccount
                } else {
                    const error = console.error('Error adding distributor')
					throw error
                }
                break
            default:
				const error = console.error('Error adding entity. Specified role not valid.')
				throw error
        }

		console.log(metamaskAddress)
		if (metamaskAddress !== null) {
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
			})

			return dbResponse
		} else {
			const error = console.error("Error creating entity. Can't catch the contract event.")
			throw error
		}
    } catch (error) {
        console.error('Error creating entity:', error)
        throw error
    }
}

export const deleteEntity = async ({ id }: { id: string }): Promise<AxiosResponse<{ message: string; data: Entity }>> => {
	try {
		const entityRole = await getEntityRole()
		console.log(entityRole)
		let metamaskAddress
		
		switch (entityRole) {
            case "manufacturer":
                const manufacturerAccount = await removeManufacturer()

                if (manufacturerAccount) {
					console.log('Manufacturer account:', manufacturerAccount)
                    metamaskAddress = manufacturerAccount
                } else {
                    const error = console.error('Error deleting manufacturer')
					throw error
                }
				break
            case "customer":
				const customerAccount = await removeCustomer()

                if (customerAccount) {
					console.log('Customer account:', customerAccount)
                    metamaskAddress = customerAccount
                } else {
                    const error = console.error('Error deleting customer')
					throw error
                }
                break
            case "retailer":
				const retailerAccount = await removeRetailer()

                if (retailerAccount) {
					console.log('Retailer account:', retailerAccount)
                    metamaskAddress = retailerAccount
                } else {
                    const error = console.error('Error deleting retailer')
					throw error
                }
                break
            case "distributor":
                const distributorAccount = await removeDistributor()

                if (distributorAccount) {
					console.log('Distributor account:', distributorAccount)
                    metamaskAddress = distributorAccount
                } else {
                    const error = console.error('Error deleting distributor')
					throw error
                }
                break
            default:
				const error = console.error('Error deleting entity. Role of the entity is not valid.')
				throw error
        }

		if (metamaskAddress !== null) {
			const res = await api.delete("/delete-entity", { params: { id } })
			return res
		} else {
			const error = console.error("Error creating entity. Can't catch the contract event.")
			throw error
		}
	} catch (error) {
        console.error('Error deleting entity:', error)
        throw error
    }
}

export const addProduct = async ({ name, description }: { name: string; description: string }): Promise<AxiosResponse<{ message: string; data: Product }>> => {
	const res = await api.post("/add-product", { name, description })
	return res
}

export const addProductInstance = async ({ productId, soldBy, price }: { productId: string; soldBy: number; price: number }): Promise<AxiosResponse<{ message: string; data: any }>> => {
	//TODO: change any to correct type
	try {
		if (await isManufacturer()) {
			const res: AxiosResponse = await api.post("/add-product-instance", { productId, soldBy, price })
			const id: number = res.data['data']['productInstance']['id']
			const uid: number = res.data['data']['productInstance']['productId']

			await produceProduct(id, uid)
			return res
		} else {
			const error = console.error("Error adding a new product: Entity is not a manufacturer")
			throw error
		}
	} catch (error) {
		console.error('Error adding a new product:', error)
        throw error
	}
}
export const searchProduct = async ({ name, productId, includeInstances }: { name?: string; productId?: number; includeInstances?: boolean }): Promise<AxiosResponse<{ data: Product[] }>> => {
	const res = await api.get("/search-product", { params: { name, productId, includeInstances } })
	return res
}

export const getProductInstanceInfo = async ({ productInstanceId, productId }: { productInstanceId: string; productId: string }): Promise<AxiosResponse<{ data: ProductInstance }>> => {
	const res = await api.get("/get-product-instance-info", { params: { productInstanceId, productId } })
	return res
}

export const getProductInfo = async ({ productId }: { productId: string }): Promise<Product> => {
	const res = await api.get("/get-product-info", { params: { productId } })

	const product: Product = res.data.data
	for (const productInstances of product.productInstances) {
		if (productInstances.id !== undefined) {
			const proxyResult = await getContractProductInfo(parseInt(productInstances.id))

			// Assign the values from ProxyResult to ProductInstance
			productInstances.currentOwner = proxyResult[2].toString()
			productInstances.previousOwner = proxyResult[3].toString()
			productInstances.creationDate = formatUnixTimestampToDatetime(parseInt(proxyResult[4].toString()))
			productInstances.productState = getProductStageFromId(proxyResult[5].toString())
			productInstances.productLocation = getProductLocationFromId(proxyResult[6].toString())
			const ownershipProxy = proxyResult[7]
			productInstances.ownership = {
				manufacturer: ownershipProxy[0].toString(),
				distributor: ownershipProxy[1].toString(),
				retailer: ownershipProxy[2].toString(),
				customer: ownershipProxy[3].toString(),
			}
			const distributorBankTransactionProxy = proxyResult[8];
			productInstances.bankTransaction = {
				distributorBankTransactionID: distributorBankTransactionProxy[0].toString(),
				retailerBankTransactionID: distributorBankTransactionProxy[1].toString(),
			};

			const rewardsProxy = proxyResult[9];
			productInstances.rewards = {
				manufacturerRewarded: rewardsProxy[0].toString(),
				distributorRewarded: rewardsProxy[1].toString(),
				retailerRewarded: rewardsProxy[2].toString(),
			};
			console.log(product)
		} else {
			console.error("Product instance has undefined id:", productInstances)
		}
	}

	return product
}

export const getProductInstancesFromSeller = async ({ sellerId }: { sellerId: string }): Promise<AxiosResponse<{ data: ProductInstance[] }>> => {
	const res = await api.get("/get-product-instances-from-seller", { params: { sellerId } })
	return res
}
export const getSellerById = async ({ sellerId }: { sellerId: string }): Promise<AxiosResponse<{ data: Entity }>> => {
	const res = await api.get("/get-seller-by-id", { params: { sellerId } })
	return res
}
export const getEntityInfoFromToken = async (): Promise<AxiosResponse<{ data: Entity }>> => {
	const res = await api.get("/get-entity-info-from-token", { withCredentials: true })
	return res
}
export const login = async ({ email, password }: { email: string; password: string }): Promise<AxiosResponse<{ data: { entity: Entity; token: string } }>> => {
	const res = await api.post("/login", { email, password }, { withCredentials: true })
	return res
}
export const addVerificationID = async ({ userID, verificationID }: { userID: string; verificationID: string }): Promise<AxiosResponse<{ data: { message: string } }>> => {
	const res = await api.post("/add-verification-id", { userID, verificationID }, { withCredentials: true })
	return res
}
export const getVerificationInfoById = async ({ userID }: { userID: string }): Promise<AxiosResponse<{ data: Verifications }>> => {
	const res = await api.get("/get-verification-info-by-id", { params: { userID } })
	return res
}
export const getVerifications = async (): Promise<AxiosResponse<{ data: VerificationWithEntity[] }>> => {
	const res = await api.get("/get-verifications")
	return res
}
export const getPendingVerifications = async (): Promise<AxiosResponse<{ data: VerificationWithEntity[] }>> => {
	const res = await api.get("/get-pending-verifications")
	return res
}
export const updateVerificationGranted = async ({ id, accountVerified, metamaskAddress }: { id: string; accountVerified?: boolean, metamaskAddress?: string }): Promise<AxiosResponse<{data: {message: string}}, any> | undefined> => {
	try {
		let contractRes
		if (metamaskAddress !== undefined) {
			if (accountVerified) {
				contractRes = await grantVerificationPermission(metamaskAddress)
			} else {
				//TO DO: revoke permission
			}
		}

		if (contractRes) {
			const url = `/update-verification-granted?id=${id}&accountVerified=${accountVerified}`
			const res = await api.patch(url)
			return res
		}
	} catch (error) {
		console.error('Error updating verification:', error)
		throw error
	}
}
export const updateVerificationPayment = async ({ id, verificationPaid}: { id: string; verificationPaid: boolean}): Promise<AxiosResponse<{data: {message: string}}, any> | undefined> => {
	try {
		const contractRes = await verifyEntity()
		if (contractRes) {
			const url = `/update-verification-payment?id=${id}&verificationPaid=${verificationPaid}`
			const res = await api.patch(url)
			return res
		}
	} catch (error) {
		console.error('Error updating verification:', error)
		throw error
	}
}
export const deleteVerification = async ({ id }: { id: string }): Promise<AxiosResponse<{ data: { message: string } }>> => {
	const res = await api.delete("/delete-verification", { params: { id } })
	return res
}


