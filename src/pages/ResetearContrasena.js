// src/pages/ResetearContrasena.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import backgroundImage from "../assets/img/background_login.jpg";
import api from "../api"; // Importa la instancia configurada de Axios

const ResetearContrasena = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extraer el email de la query string (si existe)
  const queryParams = new URLSearchParams(location.search);
  const emailQuery = queryParams.get("email") || "";

  // Estados para los campos del formulario
  const [email, setEmail] = useState(emailQuery);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Estados para errores en la validación en tiempo real
  const [emailError, setEmailError] = useState("");
  const [resetCodeError, setResetCodeError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  // Estados generales para feedback y carga
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // Regex para validar el email (mismo patrón que usamos en otros formularios)
  const EMAIL_REGEX =
    /^[\w.!#$%&'*+/=?^`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("El formato del correo no es válido.");
    } else {
      setEmailError("");
    }
  };

  const handleResetCodeChange = (e) => {
    const value = e.target.value;
    setResetCode(value);
    if (!value.trim()) {
      setResetCodeError("El código de recuperación es obligatorio.");
    } else {
      setResetCodeError("");
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    if (value.length < 6) {
      setNewPasswordError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setNewPasswordError("");
    }
    // Verificar que coincida con la confirmación, si ya se ingresó
    if (confirmNewPassword && value !== confirmNewPassword) {
      setConfirmNewPasswordError("Las contraseñas no coinciden.");
    } else {
      setConfirmNewPasswordError("");
    }
  };

  const handleConfirmNewPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmNewPassword(value);
    if (newPassword !== value) {
      setConfirmNewPasswordError("Las contraseñas no coinciden.");
    } else {
      setConfirmNewPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Verificar que todos los campos estén llenos
    if (!email || !resetCode || !newPassword || !confirmNewPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    // Verificar errores en la validación en tiempo real
    if (
      emailError ||
      resetCodeError ||
      newPasswordError ||
      confirmNewPasswordError
    ) {
      setError("Por favor, corrige los errores en el formulario.");
      return;
    }

    setLoading(true);
    try {
      // Usamos la instancia "api" para enviar la solicitud POST al endpoint de resetear contraseña
      await api.post("/users/password-reset/reset", {
        email,
        resetCode,
        newPassword,
      });
      setSuccess("Contraseña actualizada exitosamente.");
      setOpenModal(true);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Error al restablecer la contraseña.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Al cerrar el modal se redirige a la página de login
  const handleCloseModal = () => {
    setOpenModal(false);
    navigate("/login");
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
        <Typography
          variant="h5"
          align="center"
          sx={{ color: "#0056b3", mb: 2 }}
        >
          Resetear Contraseña
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="primary" align="center" sx={{ mb: 2 }}>
            {success}
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
        <TextField
          fullWidth
          label="Código de Recuperación"
          name="resetCode"
          value={resetCode}
          onChange={handleResetCodeChange}
          error={!!resetCodeError}
          helperText={resetCodeError}
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
        <TextField
          fullWidth
          label="Nueva Contraseña"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          error={!!newPasswordError}
          helperText={newPasswordError}
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
        <TextField
          fullWidth
          label="Confirmar Nueva Contraseña"
          name="confirmNewPassword"
          type="password"
          value={confirmNewPassword}
          onChange={handleConfirmNewPasswordChange}
          error={!!confirmNewPasswordError}
          helperText={confirmNewPasswordError}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Resetear Contraseña"}
        </Button>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Contraseña Actualizada</DialogTitle>
        <DialogContent>
          <Typography>
            Tu contraseña se ha actualizado exitosamente. Ahora puedes iniciar sesión.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            sx={{
              backgroundColor: "#003f7d",
              "&:hover": { backgroundColor: "#0056b3" },
            }}
          >
            Ir a Iniciar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResetearContrasena;
