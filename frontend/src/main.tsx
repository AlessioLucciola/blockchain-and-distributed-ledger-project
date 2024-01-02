import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import Hero from "./pages/Hero.tsx"
import Register from "./pages/Register.tsx"
import Login from "./pages/Login.tsx"
import ProductInfo from "./pages/ProductInfo.tsx"
import Shop from "./pages/Shop.tsx"
import MyOrders from "./pages/MyOrders.tsx"
import MySales from "./pages/MySales.tsx"
import Search from "./pages/Search.tsx"
import Home from "./pages/Home.tsx"
import { SessionProvider } from "./context/SessionProvider.tsx"
import MessagePage from "./pages/MessagePage.tsx"

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<Hero />} />
			<Route path="register" element={<Register />} />
			<Route path="login" element={<Login />} />
			<Route path="product/:id" element={<ProductInfo />} />
			<Route path="shop" element={<Shop />} />
			<Route path="orders" element={<MyOrders />} />
			<Route path="sales" element={<MySales />} />
			<Route path="search" element={<Search />} />
			<Route path="home" element={<Home />} />
			<Route
				path="*"
				element={
					<MessagePage
						message={"Page Not Found :("}
						buttons={[
							{
								text: "Return Home",
								onClick: () => router.navigate("/home"),
							},
						]}
					/>
				}
			/>
		</>
	)
)

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<SessionProvider>
			<RouterProvider router={router} />
		</SessionProvider>
	</React.StrictMode>
)
