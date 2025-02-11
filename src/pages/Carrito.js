import React, { useEffect, useState, useRef } from "react"; // Cambiamos useCallback por useRef
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import Sidebar from "../components/Sidebar";
import { useCart } from "../contexts/CartContext";

const Carrito = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { updateCartItems } = useCart();
  
  // Usar useRef para mantener una referencia estable a la función
  const fetchCartRef = useRef(async () => {
    setLoading(true);
    try {
      const response = await api.get("/cart");
      setCart(response.data);
      
      if (response.data && Array.isArray(response.data.items)) {
        updateCartItems(response.data.items);
        
        const initialQuantities = {};
        response.data.items.forEach((item) => {
          initialQuantities[item.id] = item.quantity;
        });
        setQuantities(initialQuantities);
      } else {
        updateCartItems([]);
        setQuantities({});
      }
    } catch (err) {
      console.error("Error al obtener el carrito:", err);
      setError("Error al cargar el carrito");
      toast.error("Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  });

  // Usar useEffect con un array de dependencias vacío
  useEffect(() => {
    fetchCartRef.current();
  }, []); // Array de dependencias vacío

  const handleQuantityChange = (itemId, value) => {
    setQuantities((prev) => ({ ...prev, [itemId]: value }));
  };

  const updateItemQuantity = async (itemId) => {
    try {
      const currentQuantity =
        quantities[itemId] !== undefined ? parseInt(quantities[itemId], 10) : 0;
      if (isNaN(currentQuantity) || currentQuantity < 1) {
        toast.warn("La cantidad debe ser al menos 1");
        return;
      }
      await api.put(`/cart/items/${itemId}`, null, { params: { quantity: currentQuantity } });
      toast.success("Cantidad actualizada");
      fetchCartRef.current();
    } catch (err) {
      console.error("Error al actualizar la cantidad:", err);
      toast.error("Error al actualizar la cantidad");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      toast.success("Ítem eliminado");
      fetchCartRef.current();
    } catch (err) {
      console.error("Error al eliminar el ítem:", err);
      toast.error("Error al eliminar el ítem");
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return parseFloat(total.toFixed(2));
  };

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const firstNameShort = user.firstName ? user.firstName.split(" ")[0] : "Usuario";
  const lastNameShort = user.lastName ? user.lastName.split(" ")[0] : "";
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  return (
    <Box>
      <Sidebar userNameShort={userNameShort} />
      <Box sx={{ ml: { xs: 0, md: "250px" }, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Carrito de Compras
        </Typography>
        {loading ? (
          <Typography>Cargando carrito...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : cart && cart.items && cart.items.length > 0 ? (
          <Grid container spacing={2}>
            {cart.items.map((item) => {
              const initialQuantity = item.quantity;
              const currentQuantity =
                quantities[item.id] !== undefined
                  ? parseInt(quantities[item.id], 10)
                  : initialQuantity;

              return (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card>
                    {item.product.image ? (
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.product.image}
                        alt={item.product.description}
                      />
                    ) : (
                      <CardMedia
                        component="img"
                        height="140"
                        image="https://via.placeholder.com/140"
                        alt="Producto sin imagen"
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6">
                        {item.product.description}
                      </Typography>
                      <Typography variant="body2">
                        Precio: ${item.price}
                      </Typography>
                      <Typography variant="body2">
                        Subtotal: ${parseFloat((item.price * item.quantity).toFixed(2))}
                      </Typography>
                      <TextField
                        label="Cantidad"
                        type="number"
                        size="small"
                        value={
                          quantities[item.id] !== undefined ? quantities[item.id] : initialQuantity
                        }
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        inputProps={{
                          min: 1,
                          max: item.product.availableQuantity,
                        }}
                        sx={{ mt: 1 }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => updateItemQuantity(item.id)}
                          disabled={
                            currentQuantity === initialQuantity || currentQuantity < 1
                          }
                        >
                          Actualizar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeItem(item.id)}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
            <Grid item xs={12}>
              <Typography variant="h6">
                Total: ${calculateTotal()}
              </Typography>
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={() => navigate("/checkout")}
              >
                Proceder al Checkout
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Typography>No hay productos en el carrito.</Typography>
        )}
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={(event, reason) => {
          if (reason === "clickaway") return;
          setNotification((prev) => ({ ...prev, open: false }));
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={(event, reason) => {
            if (reason === "clickaway") return;
            setNotification((prev) => ({ ...prev, open: false }));
          }}
          severity={notification.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Carrito;