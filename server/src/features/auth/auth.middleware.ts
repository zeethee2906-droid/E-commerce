import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "../../generated/prisma/enums";
import "dotenv"

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const clientCookie = req.cookies;
  if (!clientCookie.auth_token) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    jwt.verify(clientCookie.auth_token, process.env.JWT_SECRET!);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
  next();
  
};

export const assessRole = (role:Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { auth_token } = req.cookies;
    const decodedUser = jwt.decode(auth_token) as {
      id: number;
      name: string;
      email: string;
      role: Role;
      phone: string;
      password: string;
      iat: number;
      exp: number;
    };
    if (!role.includes(decodedUser.role)) {
        return res.status(403).json("Current user not allow")
    }

    req.user = {
        id: decodedUser.id,
        name:decodedUser.name,
        email:decodedUser.email,
        phone:decodedUser.phone,
        role:decodedUser.role 
    }
    
    next()
  }
};
