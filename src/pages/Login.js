// src/pages/Login.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Link, CircularProgress } from "@mui/material";
import backgroundImage from "../assets/img/background_login.jpg";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();

  // Estados para los campos del formulario, errores y carga
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para validar el formato del email
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Verificar si ya existe un token válido en localStorage y redirigir si es así
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          navigate("/dashboard");
        } else {
          // Si el token está expirado, se elimina
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones simples de los campos
    if (!validateEmail(email)) {
      setError("El formato del correo no es válido");
      return;
    }
    if (!password) {
      setError("La contraseña es obligatoria");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", { email, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas o error en el servidor");
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
        position: "relative",
        overflow: "hidden",
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
        <Typography component="h1" variant="h5" align="center" sx={{ color: "#0056b3" }}>
          Iniciar Sesión
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          margin="normal"
          fullWidth
          label="Correo Electrónico"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          label="Contraseña"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
        </Button>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            ¿No tienes una cuenta?{" "}
            <Link href="/registro" sx={{ color: "#003f7d", textDecoration: "none" }}>
              Crear cuenta
            </Link>
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            ¿Olvidaste tu contraseña?{" "}
            <Link href="/recuperar-contrasena" sx={{ color: "#003f7d", textDecoration: "none" }}>
              Recuperar Contraseña
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
