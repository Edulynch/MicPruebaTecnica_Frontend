// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import backgroundImage from "../assets/img/background_login.jpg";
import { jwtDecode } from "jwt-decode";
import api from "../api"; // Se asume que api.js está configurado con baseURL e interceptor

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Verifica si ya hay un token válido
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
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("El correo es obligatorio");
      return;
    }
    if (!password) {
      setError("La contraseña es obligatoria");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Llamada al endpoint de login
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;
      
      // Decodificar el token para extraer roles
      const decoded = jwtDecode(token);
      // Se asume que decoded.roles es una cadena, por ejemplo: "ADMIN,USER"
      const rolesString = decoded.roles || "";
      const rolesArray = rolesString.split(",").map(role => role.trim()).filter(r => r);
      // Convertir a arreglo de objetos (por ejemplo, [{ name: "ADMIN" }, { name: "USER" }])
      const rolesObj = rolesArray.map(r => ({ name: r }));
      
      // Combinar el objeto usuario con la propiedad roles
      const userWithRoles = { ...user, roles: rolesObj };
      
      // Guardar en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userWithRoles));
      
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas");
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
        <Typography variant="h5" align="center" sx={{ color: "#0056b3" }}>
          Iniciar Sesión
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
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
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
