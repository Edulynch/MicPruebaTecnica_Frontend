// src/routes/AdminRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminUsers from "../pages/AdminUsuarios";
import AdminUserDetail from "../pages/AdminDetalleUsuarios";
import AdminOrders from "../pages/AdminOrdenes";
import AdminOrderDetail from "../pages/AdminDetalleOrden";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="users" element={<AdminUsers />} />
      <Route path="users/:id" element={<AdminUserDetail />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="orders/:orderId" element={<AdminOrderDetail />} />
    </Routes>
  );
};

export default AdminRoutes;
