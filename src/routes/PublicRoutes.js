// PublicRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import RecuperarContrasena from "../pages/RecuperarContrasena";
import ResetearContrasena from "../pages/ResetearContrasena";

const PublicRoutes = () => (
  <Routes>
    <Route path="" element={<Login />} />
    <Route path="login" element={<Login />} />
    <Route path="registro" element={<Registro />} />
    <Route path="recuperar-contrasena" element={<RecuperarContrasena />} />
    <Route path="resetear-contrasena" element={<ResetearContrasena />} />
  </Routes>
);

export default PublicRoutes;
