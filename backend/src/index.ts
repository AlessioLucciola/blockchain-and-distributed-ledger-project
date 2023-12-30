import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import SmartSupplyAPI from "./api/SmartSupply-api"
import cors from "cors"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT || "3000", 10)

app.use(cors())
app.use(express.json())
SmartSupplyAPI(app)

app.get("/", (req: Request, res: Response) => {
	res.send("Welcome to SmartSupply server")
})

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`)
})
