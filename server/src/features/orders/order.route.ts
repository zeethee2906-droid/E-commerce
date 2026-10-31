import { Router } from "express";
import { assessRole, authentication } from "../auth/auth.middleware";
import { createOrder } from "./order.controller";

const orderRoute = Router()

orderRoute.use(authentication)

orderRoute.post("/",assessRole(["USER"]),createOrder)

export default orderRoute