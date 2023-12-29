export const GRADIENTS = {
	"text-gradient": "gradient-to-b from-text via-primary to-primary",
	"div-gradient": "gradient-to-b from-accent via-secondary to-background",
}
export enum Roles {
	MANUFACTURER = "manufacturer",
	DISTRIBUTOR = "distributor",
	RETAILER = "retailer",
	CUSTOMER = "customer",
}

export enum ProductStage {
	PRODUCED = "produced",
	ON_SALE = "on sale",
	PURCHASED = "purchased",
	SHIPPED = "shipped",
	RECEIVED = "received",
}

export enum ProductLocation {
	IN_FACTORY = "in factory",
	IN_DISTRIBUTOR = "in distributor",
	IN_RETAILER = "in retailer",
	IN_CUSTOMER = "in customer",
	SHIPPING = "shipping",
}
