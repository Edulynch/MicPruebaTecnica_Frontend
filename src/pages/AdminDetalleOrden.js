// src/pages/AdminDetalleOrden.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { OrderStatusEnum, translateOrderStatus } from '../constants/OrderStatusEnum';


const AdminDetalleOrden = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  // Sidebar
  const storedUser = localStorage.getItem("user");
  const userObj = storedUser ? JSON.parse(storedUser) : {};
  const firstNameShort = userObj.firstName ? userObj.firstName.split(" ")[0] : "Usuario";
  const lastNameShort = userObj.lastName ? userObj.lastName.split(" ")[0] : "";
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/admin/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error al obtener detalles de la orden", error);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!order) return <Typography>Cargando detalles de la orden...</Typography>;

  const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  return (
    <Box>
      <Sidebar userNameShort={userNameShort} />
      <Box sx={{ ml: { xs: 0, md: "250px" }, p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>Detalle de la Orden</Typography>
          <Typography variant="body1"><strong>ID:</strong> {order.id}</Typography>
          <Typography variant="body1"><strong>Número de Orden:</strong> {order.orderNumber || translateOrderStatus(OrderStatusEnum.PENDING)}</Typography>
          <Typography variant="body1"><strong>Estado:</strong> {translateOrderStatus(order.status)}</Typography>
          <Typography variant="body1"><strong>Dirección de Envío:</strong> {order.shippingAddress}</Typography>
          <Typography variant="body1"><strong>Total:</strong> ${total}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Ítems:</Typography>
          <List>
            {order.items.map(item => (
              <ListItem key={item.id} divider>
                <ListItemText primary={item.product.description} secondary={`Cantidad: ${item.quantity} - Precio: ${item.price}`} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>Volver</Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDetalleOrden;
