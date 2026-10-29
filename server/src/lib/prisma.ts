import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";


const adapter = new PrismaMariaDb({
  host: "localhost",
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: "fullstack_db",
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export { prisma };