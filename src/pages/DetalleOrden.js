// src/pages/DetalleOrden.js
import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { OrderStatusEnum, translateOrderStatus } from '../constants/OrderStatusEnum';

const DetalleOrden = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  // Función para obtener el detalle de la orden
  const fetchOrderDetail = useCallback(async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order detail:', error);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  // Calcular el total de la orden
  const calculateTotal = () => {
    if (!order || !order.items) return 0;
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (!order) {
    return (
      <Box>
        <Sidebar userNameShort="Usuario" />
        <Box sx={{ marginLeft: '250px', padding: 3 }}>
          <Typography>Cargando detalles de la orden...</Typography>
        </Box>
      </Box>
    );
  }

  // Se muestra el número de orden si existe; de lo contrario, se utiliza el estado "PENDING" traducido.
  const orderNumberText = order.orderNumber || translateOrderStatus(OrderStatusEnum.PENDING);

  // Para el Sidebar se utiliza el nombre del usuario asociado a la orden
  const userNameShort = order.user
    ? `${order.user.firstName.split(" ")[0]} ${order.user.lastName.split(" ")[0]}`
    : "Usuario";

  return (
    <Box>
      <Sidebar userNameShort={userNameShort} />
      <Box sx={{ marginLeft: '250px', padding: 3 }}>
        <Typography variant="h4">Detalle de la Orden</Typography>
        <Typography variant="subtitle1">
          Número de Orden: {orderNumberText}
        </Typography>
        <Typography variant="subtitle1">
          Estado: {translateOrderStatus(order.status)}
        </Typography>
        <Typography variant="subtitle1">
          Dirección de Envío: {order.shippingAddress}
        </Typography>
        <List>
          {order.items.map(item => (
            <ListItem key={item.id} divider>
              <ListItemText
                primary={item.product.description}
                secondary={`Cantidad: ${item.quantity} - Precio: ${item.price}`}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6">
          Total: ${calculateTotal()}
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </Box>
    </Box>
  );
};

export default DetalleOrden;
