import React, { useState } from "react";
import { useCreateAccount } from "../hook/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const { mutate: createAccount, isPending } = useCreateAccount();
  const navigate = useNavigate()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    createAccount(
      { name, email, phone, password },
      {
        onError: (e: any) => {
          toast.error(e.response.data.message);
        },
        onSuccess: (res: any) => {
          toast.success(res.message);
          navigate("/dashboard")

          
        },
      },
    );
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-1/3 gap-5 items-center"
        action=""
      >
        <div>SIGN IN</div>
        <div className="flex flex-col gap-5">
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            disabled={isPending}
            className="input input-primary"
            type="text"
            name=""
            id=""
          />
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            disabled={isPending}
            className="input input-primary"
            type="text"
            name=""
            id=""
          />
          <input
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            disabled={isPending}
            className="input input-primary"
            type="text"
            name=""
            id=""
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            disabled={isPending}
            className="input input-primary"
            type="text"
            name=""
            id=""
          />
          <input
            value={isPending ? "Loading" : "Login"}
            disabled={!name || !email || !phone || !password}
            className="btn btn-primary"
            type="submit"
            name=""
            id=""
          />
        </div>
      </form>
    </div>
  );
};

export default Signin;
