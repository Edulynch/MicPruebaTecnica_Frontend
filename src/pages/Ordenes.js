import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import { OrderStatusEnum, translateOrderStatus } from '../constants/OrderStatusEnum';

const calculateOrderTotal = (order) => {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
};

const Ordenes = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState(null);

  // Obtener información del usuario (se asume que se guarda en localStorage con la key "user")
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : {};

  // Definimos fetchOrders con useCallback para evitar warning de dependencias
  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get('/orders');
      const ordersData = Array.isArray(response.data)
        ? response.data
        : (response.data.content || []);
      // Filtrar para mostrar únicamente las órdenes del usuario logueado (por email)
      const myOrders = ordersData.filter(
        (order) => order.user && order.user.email === user.email
      );
      setOrders(myOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [user.email]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Funciones para el modal de CANCELAR
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

  // Funciones para el modal de CONFIRMAR
  const handleConfirmClick = (order) => {
    setOrderToConfirm(order);
    setOpenConfirmModal(true);
  };

  // Definimos handleCloseConfirmModal para cerrar el modal de confirmación
  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
    setOrderToConfirm(null);
  };

  const handleConfirmOrder = async () => {
    try {
      await api.post(`/orders/${orderToConfirm.id}/confirm`);
      toast.success("Orden confirmada con éxito");
      handleCloseConfirmModal();
      fetchOrders();
    } catch (error) {
      console.error("Error al confirmar la orden", error);
      toast.error("Error al confirmar la orden");
    }
  };

  // Separar las órdenes en activas y canceladas
  const activeOrders = orders.filter(order => order.status !== OrderStatusEnum.CANCELLED);
  const cancelledOrders = orders.filter(order => order.status === OrderStatusEnum.CANCELLED);

  // Preparar datos para el Sidebar
  const firstNameShort = user.firstName ? user.firstName.split(' ')[0] : 'Usuario';
  const lastNameShort = user.lastName ? user.lastName.split(' ')[0] : '';
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  return (
    <Box>
      <Sidebar userNameShort={userNameShort} />
      <Box sx={{ marginLeft: '250px', padding: 3 }}>
        {/* Órdenes activas */}
        <Typography variant="h4" sx={{ mb: 2 }}>Órdenes Activas</Typography>
        {activeOrders.length === 0 ? (
          <Typography variant="body1">No hay órdenes activas</Typography>
        ) : (
          <Paper sx={{ mb: 4, p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Número de Orden</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeOrders.map(order => {
                  const orderNumberText = order.orderNumber ? order.orderNumber : translateOrderStatus(OrderStatusEnum.PENDING);
                  return (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        {order.status === translateOrderStatus(OrderStatusEnum.CANCELLED)
                          ? translateOrderStatus(OrderStatusEnum.CANCELLED)
                          : orderNumberText}
                      </TableCell>
                      <TableCell>{order.user ? order.user.email : 'N/A'}</TableCell>
                      <TableCell>{translateOrderStatus(order.status)}</TableCell>
                      <TableCell>${calculateOrderTotal(order)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/ordenes/${order.id}`)}
                          sx={{ mr: 1 }}
                        >
                          Ver Detalle
                        </Button>
                        {order.status === OrderStatusEnum.PENDING && (
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* Órdenes canceladas */}
        <Typography variant="h4" sx={{ mb: 2 }}>Órdenes Canceladas</Typography>
        {cancelledOrders.length === 0 ? (
          <Typography variant="body1">No hay órdenes canceladas</Typography>
        ) : (
          <Paper sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Número de Orden</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cancelledOrders.map(order => {
                  const orderNumberText = order.orderNumber ? order.orderNumber : translateOrderStatus(OrderStatusEnum.PENDING);
                  return (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{orderNumberText}</TableCell>
                      <TableCell>{order.user ? order.user.email : 'N/A'}</TableCell>
                      <TableCell>{translateOrderStatus(order.status)}</TableCell>
                      <TableCell>${calculateOrderTotal(order)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/ordenes/${order.id}`)}
                        >
                          Ver Detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}
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
      <Dialog open={openConfirmModal} onClose={handleCloseConfirmModal}>
        <DialogTitle>Confirmar Orden</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas confirmar esta orden?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmModal} color="primary">
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
