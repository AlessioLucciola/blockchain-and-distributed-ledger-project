import { NextFunction, Request, Response } from "express"
import SmartSupplyService from "../../service/SmartSupply-service"
import { Roles } from "@prisma/client"

const service = new SmartSupplyService()
const SmartSupplyController = {
	getEntities: async function (
		req: Request<
			{},
			{},
			{},
			{
				role: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const query = req.query
			let role
			if (query.role == "") {
				role = undefined
			} else {
				role = query.role as Roles
			}
			const data = await service.getEntities({ role })
			res.json({
				message: `Entities with role ${role} fetched successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	createEntity: async function (
		req: Request<
			{},
			{},
			{
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
			},
			{}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { name, surname, email, password, address_1, address_2, companyName, shopName, metamaskAddress, role } = req.body
			const data = await service.createEntity({
				name,
				surname,
				email,
				password,
				address_1,
				address_2: address_2 || null,
				companyName: companyName || null,
				shopName: shopName || null,
				metamaskAddress,
				role,
			})
			res.json({
				message: `Entity with id ${data.id} created successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	getEntityByAddress: async function (
		req: Request<
			{},
			{},
			{},
			{
				address: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { address } = req.query
			const data = await service.getEntityByAddress({ address: address })
			res.json({
				message: `Entity fetched successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	deleteEntity: async function (
		req: Request<
			{},
			{},
			{
				id: number
			},
			{}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { id } = req.body
			const data = await service.deleteEntity({ id })
			res.json({
				message: `Entity with id ${data.id} deleted successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},

	createProduct: async function (
		req: Request<
			{},
			{},
			{
				name: string
				description: string
			},
			{}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { name, description } = req.body
			const data = await service.addProduct({ name, description })
			res.json({
				message: `Product with id ${data.uid} created successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},

	addProduct: async function (
		req: Request<
			{},
			{},
			{
				name: string
				description: string
			},
			{}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { name, description } = req.body
			const data = await service.addProduct({ name, description })
			res.json({
				message: `Product with id ${data.uid} created successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	addProductInstance: async function (
		req: Request<
			{},
			{},
			{
				productId: string
				soldBy: string
				price: string
			},
			{}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { productId, soldBy, price } = req.body
			const data = await service.addProductInstance({ productId: parseInt(productId), soldBy: parseInt(soldBy), price: parseFloat(price) })
			res.json({
				message: `Product instance with id ${data.productInstance.id} was added to product with uid ${data.updatedProduct.uid} successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	searchProduct: async function (
		req: Request<
			{},
			{},
			{},
			{
				name?: string
				productId?: string
				includeInstances?: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { name, productId, includeInstances } = req.query
			let safeIncludeInstances = false
			if (includeInstances == "true" || includeInstances == "True") safeIncludeInstances = true
			const data = await service.searchProduct({ name, productId: productId ? parseInt(productId) : undefined, includeInstances: safeIncludeInstances })
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	getProductInstanceInfo: async function (
		req: Request<
			{},
			{},
			{},
			{
				productId: string
				productInstanceId: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { productId, productInstanceId } = req.query
			const data = await service.getProductInstanceInfo({ productId: parseInt(productId), productInstanceId: parseInt(productInstanceId) })
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	getProductInfo: async function (
		req: Request<
			{},
			{},
			{},
			{
				productId: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { productId } = req.query
			const data = await service.getProductInfo({ productId: parseInt(productId) })
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	getProductInstancesFromSeller: async function (
		req: Request<
			{},
			{},
			{},
			{
				sellerId: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { sellerId } = req.query
			const data = await service.getProductsInstancesFromSeller({ sellerId: parseInt(sellerId) })
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	getSellerById: async function (
		req: Request<
			{},
			{},
			{},
			{
				sellerId: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { sellerId } = req.query
			const data = await service.getSellerById({ id: parseInt(sellerId) })
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},

	login: async function (
		req: Request<
			{},
			{},
			{
				email: string
				password: string
			},
			{}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { email, password } = req.body
			const data = await service.login({ email, password })
			if (!data) throw new Error("Login failed")
			const { entity, token } = data

			res.cookie("entityToken", token, {
				httpOnly: false,
				sameSite: "strict",
			})

			res.json({
				entity,
				token,
			})
		} catch (err) {
			next(err)
		}
	},
	getEntityInfoFromToken: async function (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) {
		try {
			const token = req.cookies.entityToken
			const entity = await service.getEntityInfoFromToken({ token })
			res.json({
				data: entity,
			})
		} catch (err) {
			next(err)
		}
	},
	addVerificationId: async function (
	req: Request<
		{},
		{},
		{
			userID: string
			verificationID: string
		},
		{}
	>,
	res: Response,
	next: NextFunction
	) {
		try {
			const { userID, verificationID } = req.body
			const data = await service.addVerificationID({ userID: parseInt(userID), verificationID: verificationID })
			res.json({
				message: `Added verification id ${data.entityId} to user ${data.verificationId} successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	getVerificationInfoById: async function (
		req: Request<
			{},
			{},
			{},
			{
				userID: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { userID } = req.query
			const data = await service.getVerificationInfoById({ userID: parseInt(userID) })
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	getVerifications: async function (
		req: Request<
			{},
			{},
			{},
			{}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const data = await service.getVerifications()
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	getPendingVerifications: async function (
		req: Request<
			{},
			{},
			{},
			{}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const data = await service.getPendingVerifications()
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	deleteVerification: async function (
		req: Request<
			{},
			{},
			{},
			{
				id: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { id } = req.query
			const data = await service.deleteVerification({ id: parseInt(id) })
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	updateVerificationPayment: async function (
		req: Request<
			{},
			{},
			{},
			{
				id: string,
				verificationPaid: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { id, verificationPaid } = req.query
    		const parsedVerificationPaid = verificationPaid === "true"
			const data = await service.updateVerificationPayment({ id: parseInt(id), verificationPaid: parsedVerificationPaid })
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	updateVerificationGranted: async function (
		req: Request<
			{},
			{},
			{},
			{
				id: string,
				accountVerified: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { id, accountVerified } = req.query
    		const parsedaccountVerified = accountVerified === "true"
			const data = await service.updateVerificationGranted({ id: parseInt(id), accountVerified: parsedaccountVerified })
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	productChangeOnSale: async function (
		req: Request<
			{},
			{},
			{},
			{
				productInstanceId: string,
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { productInstanceId } = req.query
			const data = await service.productChangeOnSale({ productInstanceId: parseInt(productInstanceId) })
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	getProductsOnSale: async function (
		req: Request<
			{},
			{},
			{},
			{
				role: string
			}
		>,
		res: Response,
		next: NextFunction
	) {

		try {
			const query = req.query
			const role = query.role as Roles
			const data = await service.getProductsOnSale({ role: role })
			res.json({
				message: `Products currently sold by role ${role} fetched successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	purchaseProduct: async function (
		req: Request<
			{},
			{},
			{},
			{
				productInstanceId: string,
				buyerId: string,
				oldOwnerId: string,
				currentRole: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { productInstanceId, buyerId, oldOwnerId, currentRole } = req.query
			const fetchedRole = currentRole as Roles
			const data = await service.purchaseProduct({ productInstanceId: parseInt(productInstanceId), buyerId: parseInt(buyerId), oldOwnerId: parseInt(oldOwnerId), currentRole: fetchedRole })
			res.json({
				message: `Products with id ${productInstanceId} purchased successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	getOrders: async function (
		req: Request<
			{},
			{},
			{},
			{
				id: string,
				role: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { id, role } = req.query
			const fetchedRole = role as Roles
			const data = await service.getOrders({ id: parseInt(id), role: fetchedRole })
			res.json({
				message: `Orders for entity ${id} fetched successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	shipProduct: async function (
		req: Request<
			{},
			{},
			{},
			{
				productInstanceId: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { productInstanceId } = req.query
			const data = await service.shipProduct({ productInstanceId: parseInt(productInstanceId) })
			res.json({
				message: `Product with id ${productInstanceId} shipped successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	getSoldProducts: async function (
		req: Request<
			{},
			{},
			{},
			{
				id: string,
				role: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { id, role } = req.query
			const fetchedRole = role as Roles
			const data = await service.getSoldProducts({ id: parseInt(id), role: fetchedRole })
			res.json({
				message: `Products sold by entity ${id} fetched successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
	receiveProduct: async function (
		req: Request<
			{},
			{},
			{},
			{
				productInstanceId: string
				role: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { productInstanceId, role } = req.query
			const fetchedRole = role as Roles
			const data = await service.receiveProduct({ productInstanceId: parseInt(productInstanceId), role: fetchedRole })
			res.json({
				message: `Product with id ${productInstanceId} received successfully`,
				data: data,
			})
		} catch (err) {
			next(err)
		}
	}
}

export default SmartSupplyController
