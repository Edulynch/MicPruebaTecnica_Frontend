// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api"; // Asegúrate de tener configurado api.js con la baseURL y token interceptor
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [cartSummary, setCartSummary] = useState(null);
  const [lastOrders, setLastOrders] = useState([]);
  
  // Verificar la validez del token al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Si el token ha expirado, limpiar datos y redirigir
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Obtener el resumen del carrito
  useEffect(() => {
    const fetchCartSummary = async () => {
      try {
        const response = await api.get("/cart/summary");
        setCartSummary(response.data);
      } catch (error) {
        console.error("Error al obtener el resumen del carrito", error);
      }
    };
    fetchCartSummary();
  }, []);

  // Obtener las últimas órdenes (se asume que el endpoint GET /api/orders retorna todas las órdenes)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        // Ordenar por fecha de creación descendente y tomar las 3 primeras
        const orders = response.data.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
        setLastOrders(orders.slice(0, 3));
      } catch (error) {
        console.error("Error al obtener las órdenes", error);
      }
    };
    fetchOrders();
  }, []);

  // Obtener la información del usuario para el Sidebar
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const firstNameShort = user.firstName ? user.firstName.split(" ")[0] : "Usuario";
  const lastNameShort = user.lastName ? user.lastName.split(" ")[0] : "";
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  return (
    <Box>
      <Sidebar userNameShort={userNameShort} />
      <Box sx={{ ml: { xs: 0, md: "250px" }, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Dashboard
        </Typography>
        <Grid container spacing={2}>
          {/* Resumen del Carrito */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Resumen del Carrito</Typography>
                {cartSummary ? (
                  <>
                    <Typography variant="body1">
                      Total de ítems: {cartSummary.items.length}
                    </Typography>
                    <Typography variant="body1">
                      Total: ${cartSummary.total}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 1 }}
                      onClick={() => navigate("/carrito")}
                    >
                      Ver Carrito
                    </Button>
                  </>
                ) : (
                  <Typography variant="body2">
                    Cargando resumen del carrito...
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          {/* Últimas Órdenes */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Últimas Órdenes</Typography>
                {lastOrders.length > 0 ? (
                  lastOrders.map((order) => (
                    <Box
                      key={order.id}
                      sx={{
                        mb: 1,
                        p: 1,
                        border: "1px solid #ccc",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        Orden: {order.orderNumber || "Pendiente"}
                      </Typography>
                      <Typography variant="body2">
                        Estado: {order.status}
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ mt: 1 }}
                        onClick={() => navigate(`/ordenes/${order.id}`)}
                      >
                        Ver Detalle
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">
                    No se encontraron órdenes recientes.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Acciones rápidas */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Acciones Rápidas</Typography>
          <Button
            variant="contained"
            sx={{ mr: 1, mt: 1 }}
            onClick={() => navigate("/catalogo")}
          >
            Ver Catálogo
          </Button>
          <Button
            variant="contained"
            sx={{ mr: 1, mt: 1 }}
            onClick={() => navigate("/perfil")}
          >
            Ver Perfil
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={() => navigate("/checkout")}
          >
            Ir a Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
