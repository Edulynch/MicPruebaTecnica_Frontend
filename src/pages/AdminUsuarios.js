// src/pages/AdminUsuarios.js
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';

const AdminUsuarios = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentRole, setCurrentRole] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados para el modal de cambio de rol
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  
  // Estados para el modal de edición de usuario (datos básicos)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  // Estados para confirmación de acciones
  const [openConfirmEditModal, setOpenConfirmEditModal] = useState(false);
  const [openConfirmRoleModal, setOpenConfirmRoleModal] = useState(false);
  const [openConfirmDeactivateModal, setOpenConfirmDeactivateModal] = useState(false);
  const [openConfirmActivateModal, setOpenConfirmActivateModal] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [userToActivate, setUserToActivate] = useState(null);

  // Extraer el rol del usuario actual a partir del token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const rolesString = decoded.roles || '';
        const roles = rolesString.split(',').map(r => r.trim().toUpperCase());
        if (roles.includes('ADMIN')) {
          setCurrentRole('ADMIN');
        } else if (roles.includes('WORKER')) {
          setCurrentRole('WORKER');
        } else {
          setCurrentRole('USER');
        }
      } catch (error) {
        console.error("Error decodificando el token", error);
      }
    }
  }, []);

  // Obtener la lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener usuarios", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handlers para el modal de cambio de rol
  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole('');
    setOpenRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setOpenRoleModal(false);
    setSelectedUser(null);
  };

  // Antes de actualizar rol, se abre un modal de confirmación
  const confirmRoleUpdate = () => {
    if (!newRole) return;
    setOpenConfirmRoleModal(true);
  };

  const handleConfirmRoleUpdate = async () => {
    setOpenConfirmRoleModal(false);
    try {
      // Buscar el rol por nombre (endpoint protegido para ADMIN)
      const searchResponse = await api.get('/roles/search', { params: { name: newRole } });
      const roleData = searchResponse.data;
      // Actualizar el rol del usuario enviando roleId en el body
      await api.put(
        `/admin/users/${selectedUser.id}/role`,
        { roleId: roleData.id },
        { params: { performedBy: 'Admin' } }
      );
      const response = await api.get('/admin/users');
      setUsers(response.data);
      handleCloseRoleModal();
      toast.success("Rol actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando rol", error);
      toast.error("Error al actualizar rol");
    }
  };

  // Handlers para el modal de edición de usuario (solo para ADMIN)
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      shippingAddress: user.shippingAddress,
      birthDate: user.birthDate ? user.birthDate.substring(0, 10) : ''
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedUser(null);
  };

  // Al hacer clic en "Guardar Cambios", se abre un modal de confirmación
  const confirmEditSubmit = () => {
    setOpenConfirmEditModal(true);
  };

  const handleConfirmEditSubmit = async () => {
    setOpenConfirmEditModal(false);
    try {
      await api.put(
        `/admin/users/${selectedUser.id}`,
        editData,
        { params: { performedBy: 'Admin' } }
      );
      const response = await api.get('/admin/users');
      setUsers(response.data);
      handleCloseEditModal();
      toast.success("Usuario actualizado correctamente");
    } catch (error) {
      console.error("Error al editar usuario", error);
      toast.error("Error al actualizar usuario");
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Handler para desactivar un usuario: se abre un modal de confirmación
  const handleOpenDeactivateModal = (user) => {
    setUserToDeactivate(user);
    setOpenConfirmDeactivateModal(true);
  };

  const handleConfirmDeactivate = async () => {
    setOpenConfirmDeactivateModal(false);
    try {
      await api.delete(`/admin/users/${userToDeactivate.id}`, { params: { performedBy: 'Admin' } });
      const response = await api.get('/admin/users');
      setUsers(response.data);
      toast.success("Usuario desactivado correctamente");
    } catch (error) {
      console.error("Error al desactivar usuario", error);
      toast.error("Error al desactivar usuario");
    }
  };

  // Handler para activar un usuario: se abre un modal de confirmación
  const handleOpenActivateModal = (user) => {
    setUserToActivate(user);
    setOpenConfirmActivateModal(true);
  };

  const handleConfirmActivate = async () => {
    setOpenConfirmActivateModal(false);
    try {
      await api.put(`/admin/users/${userToActivate.id}/activate`, null, { params: { performedBy: 'Admin' } });
      const response = await api.get('/admin/users');
      setUsers(response.data);
      toast.success("Usuario activado correctamente");
    } catch (error) {
      console.error("Error al activar usuario", error);
      toast.error("Error al activar usuario");
    }
  };

  // Obtener nombre corto para el Sidebar desde localStorage
  const storedUser = localStorage.getItem("user");
  const userObj = storedUser ? JSON.parse(storedUser) : {};
  const firstNameShort = userObj.firstName ? userObj.firstName.split(" ")[0] : "Usuario";
  const lastNameShort = userObj.lastName ? userObj.lastName.split(" ")[0] : "";
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  return (
    <Box>
      <Sidebar userNameShort={userNameShort} />
      <Box sx={{ ml: { xs: 0, md: "250px" }, p: 3 }}>
        <Typography variant="h4" gutterBottom>Administración de Usuarios</Typography>
        {loading ? (
          <Typography>Cargando usuarios...</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.status === 1 ? 'Activo' : 'Inactivo'}</TableCell>
                  <TableCell>{user.roles ? user.roles.map(r => r.name).join(', ') : 'N/A'}</TableCell>
                  <TableCell>
                    {currentRole === 'ADMIN' ? (
                      <>
                        <Button variant="contained" color="primary" size="small" onClick={() => handleOpenEditModal(user)} sx={{ mr: 1 }}>
                          Editar
                        </Button>
                        <Button variant="contained" color="secondary" size="small" onClick={() => handleOpenRoleModal(user)} sx={{ mr: 1 }}>
                          Cambiar Rol
                        </Button>
                        {user.status === 1 ? (
                          <Button variant="outlined" color="error" size="small" onClick={() => handleOpenDeactivateModal(user)}>
                            Desactivar
                          </Button>
                        ) : (
                          <Button variant="outlined" color="success" size="small" onClick={() => handleOpenActivateModal(user)}>
                            Activar
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button variant="outlined" size="small" onClick={() => navigate(`/admin/users/${user.id}`)}>
                        Ver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Modal para confirmar edición */}
      <Dialog open={openConfirmEditModal} onClose={() => setOpenConfirmEditModal(false)}>
        <DialogTitle>Confirmar Actualización</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de actualizar los datos del usuario?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmEditModal(false)}>Cancelar</Button>
          <Button onClick={handleConfirmEditSubmit} variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para confirmar cambio de rol */}
      <Dialog open={openConfirmRoleModal} onClose={() => setOpenConfirmRoleModal(false)}>
        <DialogTitle>Confirmar Cambio de Rol</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de cambiar el rol del usuario?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmRoleModal(false)}>Cancelar</Button>
          <Button onClick={handleConfirmRoleUpdate} variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para confirmar desactivación */}
      <Dialog open={openConfirmDeactivateModal} onClose={() => setOpenConfirmDeactivateModal(false)}>
        <DialogTitle>Confirmar Desactivación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de desactivar a este usuario?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDeactivateModal(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDeactivate} variant="contained" color="error">Confirmar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para confirmar activación */}
      <Dialog open={openConfirmActivateModal} onClose={() => setOpenConfirmActivateModal(false)}>
        <DialogTitle>Confirmar Activación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de activar a este usuario?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmActivateModal(false)}>Cancelar</Button>
          <Button onClick={handleConfirmActivate} variant="contained" color="success">Confirmar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para editar usuario */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            name="firstName"
            fullWidth
            value={editData.firstName || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Apellido"
            name="lastName"
            fullWidth
            value={editData.lastName || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Dirección"
            name="shippingAddress"
            fullWidth
            value={editData.shippingAddress || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Fecha de Nacimiento"
            name="birthDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editData.birthDate || ''}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancelar</Button>
          <Button onClick={confirmEditSubmit} variant="contained">Guardar Cambios</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para cambiar rol (con desplegable) */}
      <Dialog open={openRoleModal} onClose={handleCloseRoleModal}>
        <DialogTitle>Cambiar Rol</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Seleccione el nuevo rol para el usuario:
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="role-select-label">Nuevo Rol</InputLabel>
            <Select
              labelId="role-select-label"
              value={newRole}
              label="Nuevo Rol"
              onChange={(e) => setNewRole(e.target.value)}
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="WORKER">WORKER</MenuItem>
              <MenuItem value="USER">USER</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleModal}>Cancelar</Button>
          <Button onClick={confirmRoleUpdate} variant="contained">Actualizar Rol</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsuarios;
