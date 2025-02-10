// src/pages/Registro.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
} from "@mui/material";
import backgroundImage from "../assets/img/background_login.jpg";

const Registro = () => {
  const navigate = useNavigate();

  // Estados de los campos del formulario
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para validación en tiempo real
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Estados generales
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Regex para validar el correo (compatible con la validación del backend)
  const EMAIL_REGEX = /^[\w.!#$%&'*+/=?^`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

  // Validación en tiempo real del email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("El formato del correo no es válido.");
    } else {
      setEmailError("");
    }
  };

  // Validación en tiempo real para la contraseña y su confirmación
  const validatePassword = (pass) => pass.length >= 6;

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setPasswordError("");
    }
    // Compara con confirmPassword si ya se ingresó
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (password !== value) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !firstName ||
      !lastName ||
      !email ||
      !birthDate ||
      !shippingAddress ||
      !password ||
      !confirmPassword
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (emailError || passwordError || confirmPasswordError) {
      setError("Por favor, corrige los errores del formulario.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/users", {
        firstName,
        lastName,
        email,
        birthDate,
        shippingAddress,
        password,
      });
      setSuccess("Cuenta creada exitosamente. Redirigiendo al login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Error al crear la cuenta. Por favor, verifica tus datos.");
      }
    } finally {
      setLoading(false);
    }
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
          component="h1"
          variant="h5"
          align="center"
          sx={{ color: "#0056b3" }}
        >
          Crear Cuenta
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="primary" align="center" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}
        <TextField
          margin="normal"
          fullWidth
          label="Nombre"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoFocus
          sx={{
            "& .MuiInputLabel-root": { color: "#0056b3" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#0056b3" },
              "&:hover fieldset": { borderColor: "#003f7d" },
              "&.Mui-focused fieldset": { borderColor: "#003f7d" },
            },
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Apellido"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{
            "& .MuiInputLabel-root": { color: "#0056b3" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#0056b3" },
              "&:hover fieldset": { borderColor: "#003f7d" },
              "&.Mui-focused fieldset": { borderColor: "#003f7d" },
            },
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Correo Electrónico"
          name="email"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
          sx={{
            "& .MuiInputLabel-root": { color: "#0056b3" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#0056b3" },
              "&:hover fieldset": { borderColor: "#003f7d" },
              "&.Mui-focused fieldset": { borderColor: "#003f7d" },
            },
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Fecha de Nacimiento"
          name="birthDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          sx={{
            "& .MuiInputLabel-root": { color: "#0056b3" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#0056b3" },
              "&:hover fieldset": { borderColor: "#003f7d" },
              "&.Mui-focused fieldset": { borderColor: "#003f7d" },
            },
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Dirección"
          name="shippingAddress"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          sx={{
            "& .MuiInputLabel-root": { color: "#0056b3" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#0056b3" },
              "&:hover fieldset": { borderColor: "#003f7d" },
              "&.Mui-focused fieldset": { borderColor: "#003f7d" },
            },
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Contraseña"
          name="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={!!passwordError}
          helperText={passwordError}
          sx={{
            "& .MuiInputLabel-root": { color: "#0056b3" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#0056b3" },
              "&:hover fieldset": { borderColor: "#003f7d" },
              "&.Mui-focused fieldset": { borderColor: "#003f7d" },
            },
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          sx={{
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
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: "#003f7d",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Crear Cuenta"}
        </Button>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" sx={{ color: "#003f7d", textDecoration: "none" }}>
              Iniciar Sesión
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Registro;
