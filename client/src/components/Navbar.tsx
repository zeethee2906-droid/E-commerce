import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMe } from "../hook/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const {data:user} = useMe()

  const menu = [
    { id: 1,role:["ADMIN","USER"], name: "Products", path: "/dashboard" },
    { id: 2,role:["ADMIN"], name: "Orders", path: "/dashboard/order" },
    { id: 1,role:["ADMIN"], name: "Add Products", path: "/dashboard/add-products" },
  ];

   const visibleMenu = menu.filter((i) => {
     return i.role.includes(user!.role)
   }
   )
  

  return (
    <div className="h-screen sticky bg-gray-50 shadow-2xl top-0 left-0 w-60 flex flex-col gap-5 pt-15">
      {visibleMenu.map((i) => {
        return (
          <div
            onClick={() => {
              navigate(i.path);
            }}
            key={i.id}
            className={`select-none left-0 w-56 hover:w-full duration-700 ease-in-out p-2 hover:p-2.5 rounded-3xl flex justify-center items-center bg-gray-100 shadow hover:shadow-2xl hover:bg-gray-500n ${pathname === i.path && "text-secondary" && "bg-gray-300"}`}
          >
            {i.name}
          </div>
        );
      })}
    </div>
  );
};

export default Navbar;
