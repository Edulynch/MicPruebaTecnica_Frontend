// src/pages/Carrito.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api"; // Instancia Axios configurada (baseURL, token, etc.)
import Sidebar from "../components/Sidebar";

const Carrito = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({}); // Guarda la cantidad actual ingresada para cada ítem
  const [error, setError] = useState("");

  // Función para obtener el carrito actual
  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cart");
      setCart(response.data);

      // Inicializar el estado de las cantidades con los valores actuales del carrito
      const initialQuantities = {};
      if (response.data && Array.isArray(response.data.items)) {
        response.data.items.forEach((item) => {
          initialQuantities[item.id] = item.quantity;
        });
      }
      setQuantities(initialQuantities);
    } catch (err) {
      console.error("Error al obtener el carrito:", err);
      setError("Error al cargar el carrito");
      toast.error("Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Actualiza la cantidad en el estado local para un ítem específico
  const handleQuantityChange = (itemId, value) => {
    setQuantities((prev) => ({ ...prev, [itemId]: value }));
  };

  // Actualizar la cantidad de un ítem en el backend (PUT /api/cart/items/{itemId})
  const updateItemQuantity = async (itemId) => {
    try {
      const newQuantity = parseInt(quantities[itemId], 10);
      if (isNaN(newQuantity) || newQuantity < 1) {
        toast.warn("La cantidad debe ser al menos 1");
        return;
      }
      await api.put(`/cart/items/${itemId}`, null, { params: { quantity: newQuantity } });
      toast.success("Cantidad actualizada");
      fetchCart();
    } catch (err) {
      console.error("Error al actualizar la cantidad:", err);
      toast.error("Error al actualizar la cantidad");
    }
  };

  // Eliminar un ítem del carrito (DELETE /api/cart/items/{itemId})
  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      toast.success("Ítem eliminado");
      fetchCart();
    } catch (err) {
      console.error("Error al eliminar el ítem:", err);
      toast.error("Error al eliminar el ítem");
    }
  };

  // Calcular el total del carrito
  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Obtener el nombre del usuario para el Sidebar desde localStorage
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
          Carrito de Compras
        </Typography>
        {loading ? (
          <Typography>Cargando carrito...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : cart && cart.items && cart.items.length > 0 ? (
          <Grid container spacing={2}>
            {cart.items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  {item.product.image ? (
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.product.image}
                      alt={item.product.description}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://via.placeholder.com/140"
                      alt="Producto sin imagen"
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">
                      {item.product.description}
                    </Typography>
                    <Typography variant="body2">
                      Precio: ${item.price}
                    </Typography>
                    <Typography variant="body2">
                      Subtotal: ${item.price * item.quantity}
                    </Typography>
                    <TextField
                      label="Cantidad"
                      type="number"
                      size="small"
                      value={quantities[item.id] || item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      inputProps={{
                        min: 1,
                        max: item.product.availableQuantity,
                      }}
                      sx={{ mt: 1 }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => updateItemQuantity(item.id)}
                      >
                        Actualizar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeItem(item.id)}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Typography variant="h6">
                Total: ${calculateTotal()}
              </Typography>
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={() => navigate("/checkout")}
              >
                Proceder al Checkout
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Typography>No hay productos en el carrito.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Carrito;
