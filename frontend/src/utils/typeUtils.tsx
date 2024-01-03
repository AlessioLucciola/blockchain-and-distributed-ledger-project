import { ProductStage, ProductLocation } from "../shared/constants"

export const getProductStageFromId = (id: string) => {
	switch (id) {
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
			console.error(`Unknown ProductStage ID: ${id}`);
			return ProductStage.UNKNOWN
	}
}

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
			console.error(`Unknown ProductLocation ID: ${id}`);
			return ProductLocation.UNKNOWN
	}
}

export const formatUnixTimestampToDatetime = (timestamp: number) => {
	const date = new Date(timestamp * 1000)
	const formattedDate = date.toLocaleString()
	return formattedDate
}