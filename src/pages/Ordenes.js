// src/pages/Ordenes.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';

const Ordenes = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Estados para el modal de cancelar orden
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Estados para el modal de confirmar orden
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState(null);

  // Función para obtener las órdenes
  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
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

  // Función auxiliar para traducir el status al español
  const translateStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "CONFIRMED":
        return "Confirmado";
      case "PROCESSING":
        return "Procesando";
      case "SHIPPED":
        return "Enviado";
      case "DELIVERED":
        return "Entregado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  // Función auxiliar para calcular el total de la orden
  const calculateOrderTotal = (order) => {
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // --- Funciones para el modal de CANCELAR ---
  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setOpenCancelModal(true);
  };

  const handleCancelModalClose = () => {
    setOpenCancelModal(false);
    setOrderToCancel(null);
  };

  const handleCancelConfirm = async () => {
    try {
      await api.delete(`/orders/${orderToCancel.id}`);
      toast.success("Orden cancelada con éxito");
      handleCancelModalClose();
      fetchOrders();
    } catch (error) {
      console.error("Error al cancelar la orden", error);
      toast.error("Error al cancelar la orden");
    }
  };

  // --- Funciones para el modal de CONFIRMAR ---
  const handleConfirmClick = (order) => {
    setOrderToConfirm(order);
    setOpenConfirmModal(true);
  };

  const handleConfirmModalClose = () => {
    setOpenConfirmModal(false);
    setOrderToConfirm(null);
  };

  const handleConfirmOrder = async () => {
    try {
      await api.post(`/orders/${orderToConfirm.id}/confirm`);
      toast.success("Orden confirmada con éxito");
      handleConfirmModalClose();
      fetchOrders();
    } catch (error) {
      console.error("Error al confirmar la orden", error);
      toast.error("Error al confirmar la orden");
    }
  };

  // Obtener información del usuario para el Sidebar
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : {};
  const firstNameShort = user.firstName ? user.firstName.split(' ')[0] : 'Usuario';
  const lastNameShort = user.lastName ? user.lastName.split(' ')[0] : '';
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  return (
    <Box>
      <Sidebar userNameShort={userNameShort} />
      <Box sx={{ marginLeft: '250px', padding: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Órdenes
        </Typography>
        <List>
          {orders.map((order) => {
            // Si la orden está cancelada, se muestra "Cancelado"; de lo contrario, si no tiene orderNumber, se muestra "Pendiente"
            const orderNumberText = order.status === "CANCELLED"
              ? "Cancelado"
              : (order.orderNumber ? order.orderNumber : "Pendiente");
            return (
              <ListItem key={order.id} divider>
                <ListItemText
                  primary={`Orden N°: ${orderNumberText}`}
                  secondary={`Estado: ${translateStatus(order.status)} - Dirección: ${order.shippingAddress} - Total: $${calculateOrderTotal(order)}`}
                />
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/ordenes/${order.id}`)}
                >
                  Ver Detalle
                </Button>
                {order.status === "PENDING" && (
                  <>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleConfirmClick(order)}
                      sx={{ ml: 1 }}
                    >
                      Confirmar Orden
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancelClick(order)}
                      sx={{ ml: 1 }}
                    >
                      Cancelar Orden
                    </Button>
                  </>
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Modal para cancelar la orden */}
      <Dialog open={openCancelModal} onClose={handleCancelModalClose}>
        <DialogTitle>Cancelar Orden</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cancelar esta orden? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelModalClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCancelConfirm} color="error">
            Confirmar Cancelación
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para confirmar la orden */}
      <Dialog open={openConfirmModal} onClose={handleConfirmModalClose}>
        <DialogTitle>Confirmar Orden</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas confirmar esta orden?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmModalClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmOrder} color="primary">
            Confirmar Orden
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ordenes;
