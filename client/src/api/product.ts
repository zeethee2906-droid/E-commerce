import { instance } from "../lib/axios";

export const addProduct = async ({
  name,
  description,
  price,
  stock,
  image,
}: {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}) => {
  const res = await instance.post("/product/", {
    name,
    description,
    price,
    stock,
    image,
  });
  return res;
};
