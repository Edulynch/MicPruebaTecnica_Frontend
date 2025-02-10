// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import RecuperarContrasena from "./pages/RecuperarContrasena";
import ResetearContrasena from "./pages/ResetearContrasena";
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
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        <Route path="/resetear-contrasena" element={<ResetearContrasena />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/ordenes" element={<Ordenes />} />
        <Route path="/ordenes/:orderId" element={<DetalleOrden />} />
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
