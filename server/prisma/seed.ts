import bcrypt from "bcryptjs";
import { error } from "node:console";
import { prisma } from "../src/lib/prisma";

const main = async () => {
    const email = process.env.ADMIN_EMAIL;
    const phone = process.env.ADMIN_PHONE!;
    const password = process.env.ADMIN_PASSWORD;
    if(!email || !password){
        throw new Error("ADMIN_EMAIL AND PASSWORD ARE REQUIRED");
    }

    const hashPassword = await bcrypt.hash(password,10)

    const existingAdmin = await prisma.user.findUnique({
        where:{email}
    })

    if(existingAdmin){
        throw new Error("This email is already exists")
    }

    const createAdmin = await prisma.user.create({
        data:{
            name: "Shop owner",
            email,
            password:hashPassword,
            role:"ADMIN",
            phone
        }
    })

    console.log("Success create admin account", email)
}

main()
.catch((error) => {
  console.error(error)
  process.exitCode = 1;
}
)
.finally(async () => {
    await prisma.$disconnect()
})