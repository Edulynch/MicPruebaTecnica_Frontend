// src/pages/RecuperarContrasena.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import backgroundImage from "../assets/img/background_login.jpg";

const RecuperarContrasena = () => {
  const navigate = useNavigate();

  // Estado para el email, errores, indicador de carga y modal
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // Regex para validar el email (sintaxis consistente con el backend)
  const EMAIL_REGEX = /^[\w.!#$%&'*+/=?^`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

  // Validación en tiempo real al escribir el email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("El formato del correo no es válido.");
    } else {
      setEmailError("");
    }
  };

  // Manejar el envío del formulario para solicitar el código de recuperación
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("El correo es obligatorio.");
      return;
    }
    if (emailError) {
      setError("Corrige el formato del correo.");
      return;
    }

    setLoading(true);

    try {
      // Se envía la solicitud al endpoint de recuperación de contraseña
      await axios.post("http://localhost:8080/api/users/password-reset/request", { email });
      // Si es exitoso, se abre el modal de confirmación
      setOpenModal(true);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Error al enviar el correo de recuperación.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Al cerrar el modal se redirige a la página de Resetear Contraseña (opcionalmente pasando el email)
  const handleCloseModal = () => {
    setOpenModal(false);
    navigate("/resetear-contrasena?email=" + encodeURIComponent(email));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#004e92",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          padding: 4,
          borderRadius: 3,
          boxShadow: 10,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          width: "100%",
          maxWidth: "400px",
          border: "2px solid #0056b3",
        }}
      >
        <Typography variant="h5" align="center" sx={{ color: "#0056b3", mb: 2 }}>
          Recuperar Contraseña
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          fullWidth
          label="Correo Electrónico"
          name="email"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
          sx={{
            mb: 2,
            "& .MuiInputLabel-root": { color: "#0056b3" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#0056b3" },
              "&:hover fieldset": { borderColor: "#003f7d" },
              "&.Mui-focused fieldset": { borderColor: "#003f7d" },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: "#003f7d",
            "&:hover": { backgroundColor: "#0056b3" },
            mb: 2,
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Solicitar Código"}
        </Button>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Correo Enviado</DialogTitle>
        <DialogContent>
          <Typography>
            Se ha enviado un correo con el código de recuperación. Revisa tu bandeja de entrada.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            sx={{ backgroundColor: "#003f7d", "&:hover": { backgroundColor: "#0056b3" } }}
          >
            Ir a Resetear Contraseña
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecuperarContrasena;
