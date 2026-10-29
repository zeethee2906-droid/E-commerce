import express from "express"
import authRoute from "./features/auth/auth.route";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import productRoute from "./features/poducts/product.route";

const server = express();

server.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

server.use(express.json());

server.use(cookieParser());

server.use("/auth",authRoute)
server.use("/product",productRoute)

server.listen("3000",() => {
  console.log("Server is running in port 3000...")
}
)