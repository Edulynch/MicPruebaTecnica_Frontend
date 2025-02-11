// src/constants/OrderStatusEnum.js

// Definición del enum de estados de órdenes
export const OrderStatusEnum = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
  };
  
  // Función para traducir los estados a español
  export const translateOrderStatus = (status) => {
    switch (status) {
      case OrderStatusEnum.PENDING:
        return "Pendiente";
      case OrderStatusEnum.CONFIRMED:
        return "Confirmado";
      case OrderStatusEnum.PROCESSING:
        return "Procesando";
      case OrderStatusEnum.SHIPPED:
        return "Enviado";
      case OrderStatusEnum.DELIVERED:
        return "Entregado";
      case OrderStatusEnum.CANCELLED:
        return "Cancelado";
      default:
        return status;
    }
  };
  