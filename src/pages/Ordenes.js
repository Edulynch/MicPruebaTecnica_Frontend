// src/pages/Ordenes.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Ordenes = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      // Si la respuesta es un arreglo, úsalo directamente.
      // Si la respuesta es un objeto con la propiedad 'content', utiliza esa propiedad.
      const ordersData = Array.isArray(response.data)
        ? response.data
        : (response.data.content || []);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Obtener información del usuario para el Sidebar
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : {};
  const firstNameShort = user.firstName ? user.firstName.split(' ')[0] : 'Usuario';
  const lastNameShort = user.lastName ? user.lastName.split(' ')[0] : '';
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  return (
    <Box>
      <Sidebar userNameShort={userNameShort} />
      <Box sx={{ marginLeft: { xs: 0, md: '250px' }, padding: 3 }}>
        <Typography variant="h4">Órdenes</Typography>
        <List>
          {orders.map((order) => (
            <ListItem key={order.id} divider>
              <ListItemText
                primary={`Orden N°: ${order.orderNumber || 'Pendiente'}`}
                secondary={`Estado: ${order.status} - Dirección: ${order.shippingAddress}`}
              />
              <Button variant="outlined" onClick={() => navigate(`/ordenes/${order.id}`)}>
                Ver Detalle
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Ordenes;
