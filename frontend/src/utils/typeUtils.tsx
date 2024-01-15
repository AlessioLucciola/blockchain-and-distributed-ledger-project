import { ProductStage, ProductLocation } from "../shared/constants"

export const getProductStageFromId = (id: string) => {
	switch (id) {
		case "-1":
			return ProductStage.NOT_ON_SALE
		case "0":
			return ProductStage.PRODUCED
		case "1":
			return ProductStage.ON_SALE
		case "2":
			return ProductStage.PURCHASED
		case "3":
			return ProductStage.SHIPPED
		case "4":
			return ProductStage.RECEIVED
		default:
			console.error(`Unknown ProductStage ID: ${id}`)
			return ProductStage.UNKNOWN
	}
}

export const getStageNameString = (updatedProductStage: ProductStage) => {
	switch (updatedProductStage) {
		case ProductStage.PRODUCED:
		return "produced"
		case ProductStage.ON_SALE:
		return "on sale"
		case ProductStage.NOT_ON_SALE:
			return "not on sale"
		case ProductStage.PURCHASED:
		return "purchased"
		case ProductStage.SHIPPED:
		return "shipped"
		case ProductStage.RECEIVED:
		return "received"
		case ProductStage.UNKNOWN:
		return "undefined"
		default:
		return "unknown"
	}
  };

export const getProductLocationFromId = (id: string) => {
	switch (id) {
		case "0":
			return ProductLocation.IN_FACTORY
		case "1":
			return ProductLocation.IN_DISTRIBUTOR
		case "2":
			return ProductLocation.IN_RETAILER
		case "3":
			return ProductLocation.IN_CUSTOMER
		case "4":
			return ProductLocation.SHIPPING
		default:
			console.error(`Unknown ProductLocation ID: ${id}`)
			return ProductLocation.UNKNOWN
	}
}

export const formatUnixTimestampToDatetime = (timestamp: number) => {
	const date = new Date(timestamp * 1000)
	const formattedDate = date.toLocaleString()
	return formattedDate
}

export const getProductPriceByIdentity = (product: any, entityRole: string) => {
	switch (entityRole) {
		case "manufacturer":
			return product.manufacturerPrice !== undefined ? product.manufacturerPrice : ""
		case "distributor":
			return product.distributorPrice
		case "retailer":
			return product.retailerPrice
		case "customer":
			return product.customerPrice
		default:
			return null
	}
}