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
import api from "../api"; // Instancia configurada de Axios
import Sidebar from "../components/Sidebar";
import { useCart } from "../contexts/CartContext"; // Hook del contexto

const Catalogo = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [addedProducts, setAddedProducts] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { fetchCart } = useCart();

  // Función para obtener productos (9 por página)
  const fetchProducts = useCallback(async (pageNumber = 0) => {
    setLoading(true);
    try {
      let response;
      if (query.trim() === "") {
        response = await api.get("/catalog", { params: { page: pageNumber, size: 9 } });
      } else {
        response = await api.get("/catalog/search", { params: { query, page: pageNumber, size: 9 } });
      }
      console.log("Response from fetchProducts:", response.data);
      if (response.data && response.data.content && response.data.page) {
        setProducts(response.data.content);
        setTotalPages(response.data.page.totalPages);
        setPage(response.data.page.number);
      } else if (response.data && response.data.content) {
        setProducts(response.data.content);
        setTotalPages(1);
        setPage(0);
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

  // Función para actualizar el carrito local (para botones, etc.) y en el contexto
  const fetchCartForAddedProducts = useCallback(async () => {
    try {
      const response = await api.get("/cart");
      const cartItems = (response.data && Array.isArray(response.data.items))
        ? response.data.items
        : [];
      const added = {};
      cartItems.forEach((item) => {
        added[item.product.id] = { quantity: item.quantity, itemId: item.id };
      });
      setAddedProducts(added);
      setQuantities((prev) => {
        const updated = { ...prev };
        Object.keys(added).forEach((productId) => {
          if (updated[productId] === undefined) {
            updated[productId] = added[productId].quantity;
          }
        });
        return updated;
      });
      // Actualizamos el carrito global en el contexto
      await fetchCart();
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    }
  }, [fetchCart]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  useEffect(() => {
    fetchCartForAddedProducts();
  }, [fetchCartForAddedProducts]);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  const handleAddToCart = async (productId) => {
    const quantity = quantities[productId] ? parseInt(quantities[productId], 10) : 1;
    try {
      if (addedProducts[productId]) {
        const itemId = addedProducts[productId].itemId;
        await api.put(`/cart/items/${itemId}`, null, { params: { quantity } });
      } else {
        await api.post("/cart/items", null, { params: { productId, quantity } });
      }
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

  const handlePageChange = (event, value) => {
    console.log("Page change:", value);
    setPage(value - 1);
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setPage(0);
  };

  return (
    <Box>
      <Sidebar />
      <Box sx={{ ml: { xs: 0, md: "250px" }, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Catálogo de Productos
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Buscar producto"
            variant="outlined"
            value={query}
            onChange={handleQueryChange}
            fullWidth
          />
        </Box>
        {loading ? (
          <Typography>Cargando productos...</Typography>
        ) : (
          <>
            <Grid container spacing={2}>
              {products.map((product) => {
                const initialQuantity = addedProducts[product.id]
                  ? addedProducts[product.id].quantity
                  : 1;
                const currentQuantity =
                  quantities[product.id] !== undefined
                    ? parseInt(quantities[product.id], 10)
                    : initialQuantity;

                let buttonText = "Agregar al Carrito";
                if (addedProducts[product.id]) {
                  buttonText =
                    currentQuantity === addedProducts[product.id].quantity
                      ? "Producto agregado"
                      : "Actualizar Carrito";
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
                          value={
                            quantities[product.id] !== undefined
                              ? quantities[product.id]
                              : initialQuantity
                          }
                          onChange={(e) =>
                            handleQuantityChange(product.id, e.target.value)
                          }
                          inputProps={{
                            min: 1,
                            max: product.availableQuantity,
                          }}
                          sx={{ mt: 1 }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddToCart(product.id)}
                            disabled={
                              addedProducts[product.id] &&
                              (currentQuantity === addedProducts[product.id].quantity ||
                               currentQuantity < 1)
                            }
                          >
                            {buttonText}
                          </Button>
                        </Box>
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
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Catalogo;
