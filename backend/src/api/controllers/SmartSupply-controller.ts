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
			const data = await service.createEntity({ name, surname, email, password, address_1, address_2, companyName, shopName, metamaskAddress, role })
			res.json({
				message: `Entity with id ${data.id} created successfully`,
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
				productInstanceId: string
				productId: string
				soldBy: string
			},
			{}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { productInstanceId, productId, soldBy } = req.body
			const data = await service.addProductInstance({ productInstanceId: parseInt(productInstanceId), productId: parseInt(productId), soldBy: parseInt(soldBy) })
			res.json({
				message: `Product instance with id ${data.productInstance.id} was added to product with id ${data.updatedProduct.uid} successfully`,
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
				name: string
			}
		>,
		res: Response,
		next: NextFunction
	) {
		try {
			const { name } = req.query
			const data = await service.searchProduct({ name })
			res.json({
				data: data,
			})
		} catch (err) {
			next(err)
		}
	},
}

export default SmartSupplyController
