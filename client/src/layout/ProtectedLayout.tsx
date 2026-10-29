import React from "react";
import {  useMe } from "../hook/auth";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const ProtectedLayout = () => {
  const { data, error, isLoading } = useMe();

   console.log(data)

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (error) {
    return <Navigate to={"/login"} replace />;
  }

  return (
    <div className="flex gap-5">
      <div>
        <Navbar />
        <Footer />
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
