import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import AddProducts from "./pages/AddProducts";
import ProtectedLayout from "./layout/ProtectedLayout";

const App = () => {
  return (
    <div>
      <Toaster position="top-center" />
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/login" element={<Login />} />


        <Route path="/dashboard" element={<ProtectedLayout />}>
          <Route index element={<Products/>}/>
          <Route path="order" element={<Orders/>}/>
          <Route path="add-products" element={<AddProducts/>}/>
        </Route>

        
      </Routes>
    </div>
  );
};

export default App;
