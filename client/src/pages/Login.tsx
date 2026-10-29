import React, { useState } from "react";
import { useUserLogin } from "../hook/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type ApiError = {
  message:string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const {mutate:userLogin,isPending} = useUserLogin();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    userLogin(
      {email,password},
      {
        onError: (e) => {
          toast.error(e.response.data.message)
        }
        ,
        onSuccess: (res:any) => {
          console.log(res)
          toast.success(res.message)
          navigate("/dashboard")
        }
      }
    )
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        action=""
        className="w-1/3 flex flex-col items-center gap-5"
      >
        <div>LOGIN</div>
        <div className="flex flex-col gap-5">
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }} 
            disabled={isPending}
            value={email}
            type="text"
            className="input input-primary"
            name=""
            id=""
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }} 
            disabled={isPending}
            value={password}
            type="text"
            className="input input-primary"
            name=""
            id=""
          />
          <input 
          disabled={!email||!password||isPending}
          value={isPending ? "Loading" : "Sign in"} type="submit" className="btn btn-primary" name="" id="" />
        </div>
      </form>
    </div>
  );
};

export default Login;
