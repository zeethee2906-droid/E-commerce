import { useMutation, useQuery } from "@tanstack/react-query"
import { createAccount, login, logout, me } from "../api/auth"
import { addProduct } from "../api/product"

export const useUserLogin = () => {
  return useMutation({
    mutationFn: login
  })
}

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: createAccount
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn:logout
  })
}



export const useMe = () => {
  return useQuery({
    queryFn: me,
    queryKey: ["me"],
    retry:false
  })
}


export const useAddProduct = () => {
  return useMutation({
    mutationFn: addProduct
  })
}



