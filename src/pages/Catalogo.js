// src/pages/Catalogo.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import api from "../api"; // Axios instance configurado (baseURL y token)
import Sidebar from "../components/Sidebar";

const Catalogo = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Estado para la cantidad ingresada por producto (clave: product.id, valor: cantidad)
  const [quantities, setQuantities] = useState({});
  
  /*
    Estado para almacenar los productos ya agregados al carrito.
    Estructura: { [productId]: { quantity: <cantidad agregada>, itemId: <id del ítem en el carrito> } }
  */
  const [addedProducts, setAddedProducts] = useState({});
  
  // Estado para la notificación (tipo toast/snackbar)
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  // Estados para paginación
  const [page, setPage] = useState(0); // Página actual (indexada desde 0)
  const [totalPages, setTotalPages] = useState(0);

  // Función para obtener los productos del catálogo, considerando paginación
  const fetchProducts = useCallback(async (pageNumber = 0) => {
    setLoading(true);
    try {
      let response;
      if (query.trim() === "") {
        response = await api.get("/catalog", { params: { page: pageNumber } });
      } else {
        response = await api.get("/catalog/search", { params: { query, page: pageNumber } });
      }
      // Si la respuesta tiene paginación (por ejemplo, propiedad 'content')
      if (response.data && response.data.content) {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
        setPage(response.data.number);
      } else {
        setProducts(response.data);
        setTotalPages(1);
        setPage(0);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Función para obtener el carrito y actualizar el estado de productos agregados
  const fetchCartForAddedProducts = async () => {
    try {
      const response = await api.get("/cart");
      const cartItems =
        response.data && Array.isArray(response.data.items)
          ? response.data.items
          : [];
      const added = {};
      cartItems.forEach((item) => {
        // Usamos el product.id como clave
        added[item.product.id] = { quantity: item.quantity, itemId: item.id };
      });
      setAddedProducts(added);

      // Inicializar o actualizar "quantities" para productos ya agregados
      setQuantities((prev) => {
        const updated = { ...prev };
        Object.keys(added).forEach((productId) => {
          if (updated[productId] === undefined) {
            updated[productId] = added[productId].quantity;
          }
        });
        return updated;
      });
    } catch (error) {
      console.error("Error al obtener el carrito para productos agregados:", error);
    }
  };

  // Se ejecuta cada vez que cambia la consulta o la página
  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  // Al montar la página, cargar el carrito para sincronizar productos agregados
  useEffect(() => {
    fetchCartForAddedProducts();
  }, []);

  // Manejar el cambio de cantidad para un producto específico
  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  // Manejar agregar o actualizar el producto en el carrito
  const handleAddToCart = async (productId) => {
    const quantity = quantities[productId] ? parseInt(quantities[productId], 10) : 1;
    try {
      if (addedProducts[productId]) {
        // Si el producto ya está en el carrito, actualizarlo mediante PUT
        const itemId = addedProducts[productId].itemId;
        await api.put(`/cart/items/${itemId}`, null, { params: { quantity } });
      } else {
        // Agregar el producto al carrito mediante POST
        await api.post("/cart/items", null, { params: { productId, quantity } });
      }
      // Actualizar el estado consultando nuevamente el carrito
      await fetchCartForAddedProducts();
      setNotification({
        open: true,
        message: "Producto agregado/actualizado en el carrito",
        severity: "success",
      });
    } catch (error) {
      console.error("Error al agregar/actualizar producto al carrito:", error);
      setNotification({
        open: true,
        message: "Error al agregar/actualizar producto en el carrito",
        severity: "error",
      });
    }
  };

  // Manejar cambio de página en la paginación
  const handlePageChange = (event, value) => {
    // El componente Pagination devuelve páginas comenzando en 1, convertir a 0-indexado
    setPage(value - 1);
  };

  // Cerrar la notificación
  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Obtener información del usuario para el Sidebar
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
          Catálogo de Productos
        </Typography>
        {/* Campo de búsqueda */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Buscar producto"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
          />
        </Box>
        {loading ? (
          <Typography>Cargando productos...</Typography>
        ) : (
          <>
            <Grid container spacing={2}>
              {products.map((product) => {
                // Determinar el valor que se mostrará en el input:
                // Si ya existe en "quantities", se usa ese valor;
                // si no, se utiliza el valor en addedProducts o se inicia en 1.
                const currentQuantity =
                  quantities[product.id] !== undefined
                    ? parseInt(quantities[product.id], 10)
                    : addedProducts[product.id]
                    ? addedProducts[product.id].quantity
                    : 1;

                let buttonText = "Agregar al Carrito";
                let buttonDisabled = false;
                if (addedProducts[product.id]) {
                  if (currentQuantity === addedProducts[product.id].quantity) {
                    buttonText = "Producto agregado";
                    buttonDisabled = true;
                  } else {
                    buttonText = "Actualizar Carrito";
                    buttonDisabled = false;
                  }
                }
                return (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card>
                      {product.image ? (
                        <CardMedia
                          component="img"
                          height="140"
                          image={product.image}
                          alt={product.description}
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
                          {product.description}
                        </Typography>
                        <Typography variant="body2">
                          Precio: ${product.amount}
                        </Typography>
                        <Typography variant="body2">
                          Disponibles: {product.availableQuantity}
                        </Typography>
                        <TextField
                          label="Cantidad"
                          type="number"
                          size="small"
                          value={currentQuantity}
                          onChange={(e) =>
                            handleQuantityChange(product.id, e.target.value)
                          }
                          inputProps={{
                            min: 1,
                            max: product.availableQuantity,
                          }}
                          sx={{ mt: 1 }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 1 }}
                          onClick={() => handleAddToCart(product.id)}
                          disabled={buttonDisabled}
                        >
                          {buttonText}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
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

export default Catalogo;
