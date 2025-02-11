// src/pages/AdminDetalleUsuarios.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Sidebar from '../components/Sidebar';

const AdminDetalleUsuarios = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Sidebar: obtener nombre corto del usuario actual
  const storedUser = localStorage.getItem("user");
  const userObj = storedUser ? JSON.parse(storedUser) : {};
  const firstNameShort = userObj.firstName ? userObj.firstName.split(" ")[0] : "Usuario";
  const lastNameShort = userObj.lastName ? userObj.lastName.split(" ")[0] : "";
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error al obtener detalles del usuario", error);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <Typography>Cargando detalles del usuario...</Typography>;

  return (
    <Box>
      <Sidebar userNameShort={userNameShort} />
      <Box sx={{ ml: { xs: 0, md: "250px" }, p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>Detalle del Usuario</Typography>
          <Typography variant="body1"><strong>ID:</strong> {user.id}</Typography>
          <Typography variant="body1"><strong>Nombre:</strong> {user.firstName} {user.lastName}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
          <Typography variant="body1"><strong>Dirección:</strong> {user.shippingAddress}</Typography>
          <Typography variant="body1"><strong>Fecha de Nacimiento:</strong> {user.birthDate}</Typography>
          <Typography variant="body1"><strong>Estado:</strong> {user.status === 1 ? "Activo" : "Inactivo"}</Typography>
          <Typography variant="body1"><strong>Roles:</strong> {user.roles.map(r => r.name).join(', ')}</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>Volver</Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDetalleUsuarios;
