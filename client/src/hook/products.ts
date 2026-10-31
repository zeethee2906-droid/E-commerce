import { useQuery } from "@tanstack/react-query"
import { getProduct } from "../api/product"

export const useGetProduct = () => {
    return useQuery({
        queryKey:["products"],
        queryFn:getProduct
    })
  
}
