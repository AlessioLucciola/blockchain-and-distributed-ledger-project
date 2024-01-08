import { Express } from "express"
import SmartSupplyController from "./controllers/SmartSupply-controller"

const SmartSupplyAPI = (app: Express) => {
	//Insert API here
	app.get("/api/get-entities", SmartSupplyController.getEntities)
	app.get("/api/get-entity-by-address", SmartSupplyController.getEntityByAddress)
	app.post("/api/create-entity", SmartSupplyController.createEntity)
	app.delete("/api/delete-entity", SmartSupplyController.deleteEntity)
	app.post("/api/add-product", SmartSupplyController.addProduct)
	app.post("/api/add-product-instance", SmartSupplyController.addProductInstance)
	app.get("/api/search-product", SmartSupplyController.searchProduct)
	app.get("/api/get-product-instance-info", SmartSupplyController.getProductInstanceInfo)
	app.get("/api/get-product-info", SmartSupplyController.getProductInfo)
	app.post("/api/login", SmartSupplyController.login)
	app.get("/api/get-entity-info-from-token", SmartSupplyController.getEntityInfoFromToken)
	app.get("/api/get-product-instances-from-seller", SmartSupplyController.getProductInstancesFromSeller)
	app.get("/api/get-seller-by-id", SmartSupplyController.getSellerById)
	app.post("/api/add-verification-id", SmartSupplyController.addVerificationId)
	app.get("/api/get-verification-info-by-id", SmartSupplyController.getVerificationInfoById)
	app.get("/api/get-verifications", SmartSupplyController.getVerifications)
	app.get("/api/get-pending-verifications", SmartSupplyController.getPendingVerifications)
	app.delete("/api/delete-verification", SmartSupplyController.deleteVerification)
	app.patch("/api/update-verification-payment", SmartSupplyController.updateVerificationPayment)
	app.patch("/api/update-verification-granted", SmartSupplyController.updateVerificationGranted)
	app.patch("/api/product-change-on-sale", SmartSupplyController.productChangeOnSale)
	app.get("/api/get-products-on-sale", SmartSupplyController.getProductsOnSale)
}

export default SmartSupplyAPI
