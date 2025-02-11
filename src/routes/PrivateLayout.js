// PrivateLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { CartProvider } from "../contexts/CartContext";

const PrivateLayout = () => {
  return (
    <CartProvider>
      {/* Aquí puedes incluir el Sidebar (o condicionar su renderizado si es necesario) */}
      <Sidebar />
      {/* Outlet renderizará las rutas hijas */}
      <Outlet />
    </CartProvider>
  );
};

export default PrivateLayout;
