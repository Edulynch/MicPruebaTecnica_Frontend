// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import PrivateLayout from "./routes/PrivateLayout";
import AdminRoutes from "./routes/AdminRoutes";
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import Ordenes from "./pages/Ordenes";
import DetalleOrden from "./pages/DetalleOrden";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Rutas privadas */}
        <Route element={<PrivateLayout />} path="/*">
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="editar-perfil" element={<EditarPerfil />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="ordenes" element={<Ordenes />} />
          <Route path="ordenes/:orderId" element={<DetalleOrden />} />
        </Route>

        {/* Rutas de administración */}
        <Route path="admin/*" element={<AdminRoutes />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
