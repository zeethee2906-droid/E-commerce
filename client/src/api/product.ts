import { instance } from "../lib/axios";

export const addProduct = async (formData:FormData) => {
  const res = await instance.post("/product/",formData)
  return res
}

export const getProduct = async () => {
  const res = await instance.get("/product/")

  return res.data
  
}