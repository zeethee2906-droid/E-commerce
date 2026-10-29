import { Router } from "express";
import {  assessRole, authentication } from "../auth/auth.middleware";
import { getProduct, postProduct } from "./product.controller";
import {upload} from "../../config/upload"

const productRoute = Router()

productRoute.use(authentication)

productRoute.get("/",assessRole(["ADMIN",'USER']),getProduct)
productRoute.post("/",assessRole(["ADMIN"]),upload.single("image"),postProduct)


export default productRoute;