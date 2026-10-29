import React from "react";
import { useLogout } from "../hook/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { mutate: Logout, isError, isSuccess } = useLogout();

  const navigate = useNavigate();

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    e.preventDefault();

    Logout(
      {},
      {
        onError: () => {
          toast.error("Please try again");
        },
        onSuccess: () => {
          toast.success("Successful")
          navigate("/")
        }
        
      },
    );
  };

  return (
    <div>
      <form onClick={handleSubmit} action="">
        <button className="w-56 hover:w-full bg-gray-400 duration-700 shadow hover:shadow-2xl p-2 hover:p-2.5 rounded-2xl flex justify-center items-center">
          Logout
        </button>
      </form>
    </div>
  );
};

export default Logout;
