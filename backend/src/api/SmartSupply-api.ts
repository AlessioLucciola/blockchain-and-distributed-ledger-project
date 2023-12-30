import { Express } from "express"
import SmartSupplyController from "./controllers/SmartSupply-controller"

const SmartSupplyAPI = (app: Express) => {
	//Insert API here
	app.get("/api/get-entities", SmartSupplyController.getEntities)
	app.post("/api/create-entity", SmartSupplyController.createEntity)
	app.delete("/api/delete-entity", SmartSupplyController.deleteEntity)
	app.post("/api/add-product", SmartSupplyController.addProduct)
	app.post("/api/add-product-instance", SmartSupplyController.addProductInstance)
}

export default SmartSupplyAPI
