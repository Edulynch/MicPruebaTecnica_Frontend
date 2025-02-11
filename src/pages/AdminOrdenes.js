// src/pages/AdminOrdenes.js
import React, { useEffect, useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import { OrderStatusEnum, translateOrderStatus } from '../constants/OrderStatusEnum';

const AdminOrdenes = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estado para almacenar el rol actual del usuario (ADMIN, WORKER, USER)
  const [currentRole, setCurrentRole] = useState('');
  
  // Estados para el modal de actualización del estado de la orden
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [openStatusModal, setOpenStatusModal] = useState(false);
  
  // Estado para el modal de confirmación de actualización
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // Obtener el rol actual del usuario a partir del token almacenado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const rolesString = decoded.roles || '';
        const roles = rolesString.split(',').map(r => r.trim().toUpperCase());
        if (roles.includes("ADMIN")) {
          setCurrentRole("ADMIN");
        } else if (roles.includes("WORKER")) {
          setCurrentRole("WORKER");
        } else {
          setCurrentRole("USER");
        }
      } catch (error) {
        console.error("Error decodificando token:", error);
      }
    }
  }, []);

  // Obtener la lista de órdenes
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/orders');
        setOrders(response.data);
      } catch (error) {
        console.error("Error al obtener órdenes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Separar las órdenes en activas y canceladas
  const activeOrders = orders.filter(order => order.status !== OrderStatusEnum.CANCELLED);
  const cancelledOrders = orders.filter(order => order.status === OrderStatusEnum.CANCELLED);

  // Abrir el modal para actualizar el estado de la orden
  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus('');
    setOpenStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setSelectedOrder(null);
  };

  // Cerrar el modal de confirmación
  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
  };

  // Confirmar la actualización del estado
  const handleConfirmUpdate = async () => {
    try {
      await api.put(`/admin/orders/${selectedOrder.id}/status`, null, { params: { newStatus } });
      const response = await api.get('/admin/orders');
      setOrders(response.data);
      toast.success("Estado de la orden actualizado correctamente");
      setOpenConfirmModal(false);
      handleCloseStatusModal();
    } catch (error) {
      console.error("Error actualizando estado de la orden", error);
      toast.error("Error al actualizar estado de la orden");
    }
  };

  // Sidebar: obtener nombre corto desde localStorage
  const storedUser = localStorage.getItem("user");
  const userObj = storedUser ? JSON.parse(storedUser) : {};
  const firstNameShort = userObj.firstName ? userObj.firstName.split(" ")[0] : "Usuario";
  const lastNameShort = userObj.lastName ? userObj.lastName.split(" ")[0] : "";
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  return (
    <Box>
      <Sidebar userNameShort={userNameShort} />
      <Box sx={{ ml: { xs: 0, md: "250px" }, p: 3 }}>
        {/* Tabla de Órdenes Activas */}
        <Typography variant="h4" sx={{ mb: 2 }}>Órdenes Activas</Typography>
        {loading ? (
          <Typography>Cargando órdenes...</Typography>
        ) : activeOrders.length === 0 ? (
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
                  const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
                  return (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.orderNumber || translateOrderStatus(OrderStatusEnum.PENDING)}</TableCell>
                      <TableCell>{order.user ? order.user.email : 'N/A'}</TableCell>
                      <TableCell>{translateOrderStatus(order.status)}</TableCell>
                      <TableCell>${total}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          sx={{ mr: 1 }}
                        >
                          Ver Detalle
                        </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenStatusModal(order)}
                          >
                            Actualizar Estado
                          </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* Tabla de Órdenes Canceladas */}
        <Typography variant="h4" sx={{ mb: 2 }}>Órdenes Canceladas</Typography>
        {loading ? (
          <Typography>Cargando órdenes...</Typography>
        ) : cancelledOrders.length === 0 ? (
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
                  const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
                  return (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.orderNumber || translateOrderStatus(OrderStatusEnum.PENDING)}</TableCell>
                      <TableCell>{order.user ? order.user.email : 'N/A'}</TableCell>
                      <TableCell>{translateOrderStatus(order.status)}</TableCell>
                      <TableCell>${total}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          sx={{ mr: 1 }}
                        >
                          Ver Detalle
                        </Button>
                        {(currentRole === 'ADMIN') && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenStatusModal(order)}
                          >
                            Actualizar Estado
                          </Button>)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>

      {/* Modal para actualizar estado de la orden */}
      <Dialog open={openStatusModal} onClose={handleCloseStatusModal}>
        <DialogTitle>Actualizar Estado de la Orden</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Seleccione el nuevo estado para la orden:
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="status-select-label">Nuevo Estado</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              label="Nuevo Estado"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {Object.keys(OrderStatusEnum)
                .filter(key => {
                  // Si el usuario es WORKER, no mostramos la opción "CANCELLED"
                  if (currentRole === 'WORKER' && OrderStatusEnum[key] === OrderStatusEnum.CANCELLED) {
                    return false;
                  }
                  return true;
                })
                .map(key => (
                  <MenuItem key={key} value={OrderStatusEnum[key]}>
                    {translateOrderStatus(OrderStatusEnum[key])}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusModal}>Cancelar</Button>
          <Button onClick={() => { if (newStatus) setOpenConfirmModal(true); }} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación para actualización */}
      <Dialog open={openConfirmModal} onClose={handleCloseConfirmModal}>
        <DialogTitle>Confirmar Actualización</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas actualizar el estado de la orden?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmModal}>Cancelar</Button>
          <Button onClick={handleConfirmUpdate} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrdenes;
