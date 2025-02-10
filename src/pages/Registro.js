import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import backgroundImage from "../assets/img/background_login.jpg"; // Ruta correcta de la imagen
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Iconos de ojo

const Registro = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verificación del token al cargar la página
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const user = JSON.parse(storedUser);
      axios
        .post("http://localhost:8080/api/auth/validate", { token })
        .then((response) => {
          if (response.data.email === user.email) {
            navigate("/dashboard"); // Si el email coincide, redirigir al dashboard
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      // Realizar el POST para crear el usuario
      await axios.post("http://localhost:8080/api/users", {
        firstName,
        lastName,
        email,
        birthDate,
        shippingAddress,
        password,
      });

      // Redirigir al login después de crear la cuenta
      navigate("/login");
    } catch (err) {
      // Si el error tiene un mensaje en el backend, mostrarlo
      if (err.response && err.response.data && err.response.data.title) {
        setError(err.response.data.detail); // Muestra el mensaje del backend
      } else {
        setError("Error al crear la cuenta. Verifica tus datos.");
      }
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
          Crear Cuenta
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
            onChange={(e) => setEmail(e.target.value)}
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
            label="Fecha de Nacimiento (DD-MM-AAAA)"
            name="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
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
          <TextField
            margin="normal"
            fullWidth
            label="Repetir Contraseña"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
          {error && (
            <Typography color="error" align="center" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
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
            Crear Cuenta
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
    </Box>
  );
};

export default Registro;
