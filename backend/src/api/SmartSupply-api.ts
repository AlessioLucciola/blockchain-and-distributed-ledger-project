import { Express } from "express"
import SmartSupplyController from "./controllers/SmartSupply-controller"

const SmartSupplyAPI = (app: Express) => {
	//Insert API here
	app.get("/api/get-entities", SmartSupplyController.getEntities)
	app.post("/api/create-entity", SmartSupplyController.createEntity)
	app.delete("/api/delete-entity", SmartSupplyController.deleteEntity)
	app.post("/api/add-product", SmartSupplyController.addProduct)
	app.post("/api/add-product-instance", SmartSupplyController.addProductInstance)
	app.get("/api/search-product", SmartSupplyController.searchProduct)
	app.get("/api/get-product-instance-info", SmartSupplyController.getProductInstanceInfo)
	app.get("/api/get-product-info", SmartSupplyController.getProductInfo)
}

export default SmartSupplyAPI
