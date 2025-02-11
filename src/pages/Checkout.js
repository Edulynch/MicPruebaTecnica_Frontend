// src/pages/Checkout.js
import React, { useState, useEffect } from "react";
import api from "../api";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  // Obtener datos del usuario almacenado en localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};

  // Dirección registrada (si existe) del usuario
  const registeredShippingAddress = user.shippingAddress || "";

  // Si existe una dirección registrada, se activa el switch por defecto
  const [useRegisteredAddress, setUseRegisteredAddress] = useState(
    registeredShippingAddress !== ""
  );
  // El valor inicial del campo será la dirección registrada, o vacío en caso contrario
  const [shippingAddress, setShippingAddress] = useState(registeredShippingAddress);

  // Estado para almacenar el carrito obtenido del backend
  const [cart, setCart] = useState(null);

  // Estados para la orden y mensajes
  const [orderId, setOrderId] = useState(null);
  const [message, setMessage] = useState("");

  // Consultar el carrito al montar el componente
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/cart");
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  // Calculamos si el carrito está vacío
  const cartEmpty = !cart || !cart.items || cart.items.length === 0;

  // Función para iniciar la orden
  const initiateOrder = async () => {
    try {
      const response = await api.post(
        "/orders/initiate",
        null,
        { params: { shippingAddress } }
      );
      setOrderId(response.data.id);
      setMessage("Orden iniciada. Ahora confirma tu pedido.");
    } catch (error) {
      console.error("Error initiating order:", error);
    }
  };

  // Función para confirmar la orden
  const confirmOrder = async () => {
    if (!orderId) return;
    try {
      await api.post(`/orders/${orderId}/confirm`);
      setMessage("Orden confirmada. ¡Gracias por tu compra!");
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  // Manejar el cambio en el switch que indica si se utiliza la dirección registrada
  const handleAddressSwitch = (event) => {
    const isChecked = event.target.checked;
    setUseRegisteredAddress(isChecked);
    if (isChecked) {
      // Si se selecciona usar la dirección registrada, se asigna dicha dirección
      setShippingAddress(registeredShippingAddress);
    } else {
      // De lo contrario, se limpia el campo para permitir ingresar una dirección personalizada
      setShippingAddress("");
    }
  };

  // Preparar el nombre corto para el Sidebar
  const firstNameShort = user.firstName ? user.firstName.split(" ")[0] : "Usuario";
  const lastNameShort = user.lastName ? user.lastName.split(" ")[0] : "";
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  return (
    <Box>
      <Sidebar userNameShort={userNameShort} />
      <Box sx={{ marginLeft: { xs: 0, md: "250px" }, padding: 3 }}>
        <Typography variant="h4">Checkout</Typography>
        {/* Mostrar el switch solo si el usuario tiene una dirección registrada */}
        {registeredShippingAddress && (
          <FormControlLabel
            control={
              <Switch
                checked={useRegisteredAddress}
                onChange={handleAddressSwitch}
                color="primary"
                disabled={cartEmpty}
              />
            }
            label="Usar dirección registrada"
          />
        )}
        <TextField
          label="Dirección de Envío"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
          disabled={useRegisteredAddress}
          placeholder={!useRegisteredAddress ? "Ingrese su dirección personalizada" : ""}
        />
        {/* Si el carrito está vacío, mostrar un mensaje y botón para ir al catálogo */}
        {cartEmpty && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" color="error">
              Tu carrito está vacío. Ve al catálogo y agrega productos a tu carrito para iniciar una orden.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={() => navigate("/catalogo")}
            >
              Ir al Catálogo
            </Button>
          </Box>
        )}
        {/* Botón para iniciar orden, deshabilitado si el carrito está vacío */}
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={initiateOrder}
          disabled={cartEmpty}
        >
          Iniciar Orden
        </Button>
        {orderId && (
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2, ml: 2 }}
            onClick={confirmOrder}
          >
            Confirmar Orden
          </Button>
        )}
        {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
      </Box>
    </Box>
  );
};

export default Checkout;
