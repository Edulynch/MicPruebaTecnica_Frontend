import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Modal } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const RestablecerContrasena = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openModal, setOpenModal] = useState(false);

  // Recupera el email desde el query params (debe llegar desde el formulario anterior)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromParams = queryParams.get('email');
    setEmail(emailFromParams || '');  // Si no llega, por defecto vacio
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Realizar el restablecimiento de la contrasena
      await axios.post('http://localhost:8080/api/users/password-reset/reset', {
        email,
        resetCode,
        newPassword,
      });
      setSuccess('Contraseña actualizada correctamente.');
      setError('');
      setOpenModal(true);  // Abre el modal de éxito
    } catch (err) {
      setError('Código de recuperación inválido o expirado.');
      setSuccess('');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#004e92',
      }}
    >
      <Box
        sx={{
          padding: 4,
          borderRadius: 3,
          boxShadow: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          maxWidth: '400px',
          border: '2px solid #0056b3',
        }}
      >
        <Typography component="h1" variant="h5" align="center" sx={{ color: '#0056b3' }}>
          Restablecer Contraseña
        </Typography>
        {error && <Typography color="error" align="center" sx={{ marginTop: 2 }}>{error}</Typography>}
        {success && <Typography color="success" align="center" sx={{ marginTop: 2 }}>{success}</Typography>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Correo Electrónico */}
          <TextField
            margin="normal"
            fullWidth
            label="Correo Electrónico"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiInputLabel-root': { color: '#0056b3' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0056b3' },
                '&:hover fieldset': { borderColor: '#003f7d' },
                '&.Mui-focused fieldset': { borderColor: '#003f7d' },
              },
            }}
          />
          {/* Código de Recuperación */}
          <TextField
            margin="normal"
            fullWidth
            label="Código de Recuperación"
            name="resetCode"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            sx={{
              '& .MuiInputLabel-root': { color: '#0056b3' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0056b3' },
                '&:hover fieldset': { borderColor: '#003f7d' },
                '&.Mui-focused fieldset': { borderColor: '#003f7d' },
              },
            }}
          />
          {/* Nueva Contraseña */}
          <TextField
            margin="normal"
            fullWidth
            label="Nueva Contraseña"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{
              '& .MuiInputLabel-root': { color: '#0056b3' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0056b3' },
                '&:hover fieldset': { borderColor: '#003f7d' },
                '&.Mui-focused fieldset': { borderColor: '#003f7d' },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#003f7d', '&:hover': { backgroundColor: '#0056b3' } }}
          >
            Resetear Contraseña
          </Button>
        </Box>
      </Box>

      {/* Modal de éxito */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 4,
            borderRadius: 3,
            boxShadow: 24,
            width: '300px',
          }}
        >
          <Typography variant="h6" align="center" sx={{ color: '#0056b3' }}>
            Contrasena Actualizada
          </Typography>
          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            Tu contrasena se ha actualizado correctamente.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, backgroundColor: '#003f7d', '&:hover': { backgroundColor: '#0056b3' } }}
            onClick={() => navigate('/login')}
          >
            Ir al Login
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default RestablecerContrasena;
