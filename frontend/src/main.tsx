import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import Home from "./pages/Home.tsx"
import Register from "./pages/Register.tsx"
import Login from "./pages/Login.tsx"
import ProductInfo from "./pages/ProductInfo.tsx"
import Shop from "./pages/Shop.tsx"

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<Home />} />
			<Route path="register" element={<Register />} />
			<Route path="login" element={<Login />} />
			<Route path="product/:id" element={<ProductInfo />} />
			<Route path="shop" element={<Shop />} />
		</>
	)
)

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)
