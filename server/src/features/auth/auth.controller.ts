import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { hash } from "node:crypto";
import jwt from "jsonwebtoken"
import z from "zod";
import { id } from "zod/locales";
import type { Role } from "../../generated/prisma/enums";

export const createAccount = async (
  req: Request<
    {},
    {},
    { name: string; email: string; phone: string; password: string }
  >,
  res: Response,
) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "Fill all fields" });
  }

  
  const exitstingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (exitstingUser) {
    return res.status(400).json({ message: "User is already exist." });
  }

  const strongPassword = z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    });

  const erroeResult = strongPassword.safeParse(password);

  if (!erroeResult.success) {
    return res
      .status(400)
      .json({
        message: erroeResult.error.issues.map((issue) => issue.message),
      });
  }

  //Hashing password
  const hashPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashPassword,
    },
  });

  res.status(201).json({ message: "Success account" });
};


export const login = async (req:Request<{},{},{email:string,password:string,role:Role}>,res:Response) => {
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"Fill all fields"})
    }

    const user = await prisma.user.findUnique({
        where:{email}
    })

    if(!user){
        return res.status(401).json({message:"Invalid email or password."})
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(401).json({message:"Invalid email or password."})
    }

    const token = jwt.sign({
        id:user.id,
        email:user.email,
        role:user.role
        
    },process.env.JWT_SECRET!,{expiresIn:"1h"});

    res.cookie('auth_token',token,{
        httpOnly:true,
        maxAge:3600000
   })

   res.status(200).json({message:`Hello ${email}`})
   console.log(token)
    
}


export const logout = async (req:Request,res:Response) => {
  try {
    res.clearCookie("auth_token",{
      httpOnly:true,
    })

    res.status(200).json({message:"Logout successful"})
  } catch (error) {
    res.status(400).json({message:"Please try again"})
  }
}


export const checkMe = async (req:Request,res:Response) => {
    const clientCookie = req.cookies;
    if(!clientCookie.auth_token){
      return res.status(401).json({message: "Invalid credentials"})
    }

    try {
      jwt.verify(clientCookie.auth_token,process.env.JWT_SECRET!)
    } catch (error) {
      return res.status(401).json({message:"Invalid token"})
    }

    const decodedUser = jwt.decode(clientCookie.auth_token)
    return res.status(200).json({message:"User is valid",decodedUser})
   
}