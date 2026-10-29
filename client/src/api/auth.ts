import { instance } from "../lib/axios";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await instance.post("auth/login", { email, password });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createAccount = async ({
  name,
  email,
  phone,
  password,
}: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  try {
    const res = await instance.post("/auth/create-account",{name,email,phone,password})
    return res.data
  } catch (error) {
    throw error
  }
};

export const logout = async () => {
  const res = await instance.post("/auth/logout")
  return res
}

export const me = async () => {
  try {
    const res = await instance.get("/auth/me");
    return res.data.decodedUser;
  } catch (error) {
    throw error;
  }
};



