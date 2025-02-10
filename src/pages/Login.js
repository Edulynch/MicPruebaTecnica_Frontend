import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import backgroundImage from "../assets/img/background_login.jpg"; // Ruta correcta de la imagen

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Verificar si el token existe y es válido
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const user = JSON.parse(storedUser);
      axios
        .post("http://localhost:8080/api/auth/validate", { token })
        .then((response) => {
          if (response.data.email === user.email) {
            // Si el email coincide, redirigir a dashboard
            navigate("/dashboard");
          } else {
            // Si no coincide, borrar el token y redirigir al login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        })
        .catch(() => {
          // Si falla la validación del token, eliminar el token y redirigir al login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas");
    }
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
          Iniciar Sesión
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Correo Electrónico"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            sx={{
              "& .MuiInputLabel-root": {
                color: "#0056b3", // Color de la etiqueta
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#0056b3", // Color de borde de los campos
                },
                "&:hover fieldset": {
                  borderColor: "#003f7d", // Color del borde al hacer hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#003f7d", // Color del borde cuando el campo está enfocado
                },
              },
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Contraseña"
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#0056b3", // Color de la etiqueta
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#0056b3", // Color de borde de los campos
                },
                "&:hover fieldset": {
                  borderColor: "#003f7d", // Color del borde al hacer hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#003f7d", // Color del borde cuando el campo está enfocado
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
          >
            Entrar
          </Button>
        </Box>

        {/* Enlace para crear cuenta */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/registro"
              sx={{ color: "#003f7d", textDecoration: "none" }}
            >
              Crear cuenta
            </Link>
          </Typography>
        </Box>

        {/* Enlace para recuperar contraseña */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            ¿Olvidaste tu contraseña?{" "}
            <Link
              href="/recuperar-contrasena"
              sx={{ color: "#003f7d", textDecoration: "none" }}
            >
              Recuperar Contraseña
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
