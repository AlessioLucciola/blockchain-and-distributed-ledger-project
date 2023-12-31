import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import SmartSupplyAPI from "./api/SmartSupply-api"
import cors from "cors"
import cookies from "cookie-parser"
dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT || "3000", 10)
const corsConfig = {
	origin: true,
	credentials: true,
}
app.use(cors(corsConfig))
app.options("*", cors(corsConfig))
app.use(cookies())
app.use(express.json())
SmartSupplyAPI(app)

app.get("/", (req: Request, res: Response) => {
	res.send("Welcome to SmartSupply server")
})

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`)
})
