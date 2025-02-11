// src/contexts/CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Función para cargar el carrito desde el backend
  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      if (response.data && Array.isArray(response.data.items)) {
        setCartItems(response.data.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setCartItems([]);
    }
  };

  // Cargar el carrito al montar
  useEffect(() => {
    fetchCart();
  }, []);

  // Función para actualizar manualmente el carrito (por ejemplo, después de agregar o eliminar productos)
  const updateCartItems = (items) => {
    setCartItems(items);
  };

  // Calcular la cantidad total de artículos
  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, updateCartItems, getTotalQuantity, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
