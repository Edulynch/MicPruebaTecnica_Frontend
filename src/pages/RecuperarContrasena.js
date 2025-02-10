import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../assets/img/background_login.jpg"; // Ruta correcta de la imagen

const RecuperarContrasena = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga
  const [openModal, setOpenModal] = useState(false); // Controlar el estado del modal

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activa el spinner al empezar la solicitud

    try {
      // Llamada al endpoint de recuperación de contrasena
      await axios.post(
        "http://localhost:8080/api/users/password-reset/request",
        { email }
      );
      setSuccess("Se ha enviado un correo con el código de recuperación.");
      setError("");
      setLoading(false); // Desactiva el spinner cuando termina la solicitud
      setOpenModal(true); // Abre el modal para confirmar el envío
    } catch (err) {
      setError("Error al enviar el correo. Verifique el correo electrónico.");
      setSuccess("");
      setLoading(false); // Desactiva el spinner en caso de error
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Cierra el modal
    navigate("/resetear-contrasena"); // Redirige al login después de cerrar el modal
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`, // Usando la imagen importada
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#004e92", // Azul marino de fondo, por si la imagen no carga
      }}
    >
      <Box
        sx={{
          padding: 4,
          borderRadius: 3,
          boxShadow: 10,
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Fondo semi-transparente para el formulario
          backdropFilter: "blur(10px)",
          width: "100%",
          maxWidth: "400px",
          border: "2px solid #0056b3", // Borde que combina con el fondo azul
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          sx={{ color: "#0056b3" }}
        >
          Recuperar Contraseña
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success" align="center" sx={{ marginTop: 2 }}>
            {success}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Correo Electrónico"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            sx={{
              "& .MuiInputLabel-root": {
                color: "#0056b3",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#0056b3",
                },
                "&:hover fieldset": {
                  borderColor: "#003f7d",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#003f7d",
                },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#003f7d",
              "&:hover": { backgroundColor: "#0056b3" },
            }}
            disabled={loading} // Desactiva el botón mientras se está cargando
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Solicitar Código"
            )}
          </Button>
        </Box>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              sx={{ color: "#003f7d", textDecoration: "none" }}
            >
              Iniciar sesión
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Modal de confirmación */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>¡Recuperar Contraseña!</DialogTitle>
        <DialogContent>
          <Typography>
            Hemos enviado un correo con el código de recuperación. Revisa tu
            correo para continuar con el proceso.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecuperarContrasena;
