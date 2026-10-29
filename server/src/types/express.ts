import { Interface } from "node:readline";

declare global {
    namespace Express{
        interface Request{
            user:{
                id:number,
                name:string,
                email:string,
                phone:string,
                role:string,
                password:string
            }
        }
    }
}