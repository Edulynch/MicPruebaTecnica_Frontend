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

const DetalleOrden = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  // Memorizamos la función para obtener el detalle de la orden
  const fetchOrderDetail = useCallback(async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order detail:', error);
    }
  }, [orderId]);

  // Ejecutamos la función al montar el componente y cuando cambie "orderId"
  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  // Obtener información del usuario para el Sidebar
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : {};
  const firstNameShort = user.firstName ? user.firstName.split(' ')[0] : 'Usuario';
  const lastNameShort = user.lastName ? user.lastName.split(' ')[0] : '';
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  if (!order) {
    return (
      <Box>
        <Sidebar userNameShort={userNameShort} />
        <Box sx={{ marginLeft: '250px', padding: 3 }}>
          <Typography>Cargando detalles de la orden...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Sidebar userNameShort={userNameShort} />
      <Box sx={{ marginLeft: '250px', padding: 3 }}>
        <Typography variant="h4">Detalle de la Orden</Typography>
        <Typography variant="subtitle1">
          Número de Orden: {order.orderNumber || 'Pendiente'}
        </Typography>
        <Typography variant="subtitle1">
          Estado: {order.status}
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
        <Button variant="contained" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </Box>
    </Box>
  );
};

export default DetalleOrden;
