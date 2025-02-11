// src/components/Sidebar.js
import React, { useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import logoImg from "../assets/img/AdminLTELogo.webp";
import userImg from "../assets/img/userDummy.jpg";
import { Modal, Button } from "react-bootstrap";
import { useCart } from "../contexts/CartContext"; // Importamos el hook del contexto

const Sidebar = ({ userNameShort }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = React.useState(false);

  // Extraer del contexto el arreglo de items del carrito
  const { cartItems } = useCart();
  // Calcular la cantidad total de artículos
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Funciones para manejar el modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Verificar autenticación y validez del token al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      const user = JSON.parse(storedUser);
      api.post("/auth/validate", { token })
        .then((response) => {
          if (response.data.email !== user.email) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        });
    }
  }, [navigate]);

  // Función para determinar si el enlace "Perfil" debe estar activo
  const isProfileActive = () => {
    return (
      location.pathname === "/perfil" || location.pathname === "/editar-perfil"
    );
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <NavLink to="/dashboard" className="brand-link" style={{ textDecoration: "none" }}>
        <img
          src={logoImg}
          alt="Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">AdminLTE 3</span>
      </NavLink>

      <div className="sidebar">
        {/* User Panel */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img src={userImg} className="img-circle elevation-2" alt="Usuario" />
          </div>
          <div className="info">
            <NavLink to="/perfil" className="d-block" style={{ textDecoration: "none" }}>
              {userNameShort}
            </NavLink>
          </div>
        </div>

        {/* Menú del Sidebar */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                style={{ textDecoration: "none" }}
              >
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/perfil"
                className={() => (isProfileActive() ? "nav-link active" : "nav-link")}
                style={{ textDecoration: "none" }}
              >
                <i className="nav-icon fas fa-user"></i>
                <p>Perfil</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/catalogo"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                style={{ textDecoration: "none" }}
              >
                <i className="nav-icon fas fa-list"></i>
                <p>Catálogo</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/carrito"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                style={{ textDecoration: "none" }}
              >
                <i className="nav-icon fas fa-shopping-cart"></i>
                <p>Carrito ({cartItemCount})</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/checkout"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                style={{ textDecoration: "none" }}
              >
                <i className="nav-icon fas fa-credit-card"></i>
                <p>Checkout</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/ordenes"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                style={{ textDecoration: "none" }}
              >
                <i className="nav-icon fas fa-receipt"></i>
                <p>Órdenes</p>
              </NavLink>
            </li>
            <li className="nav-item" style={{ marginTop: "auto" }}>
              <button
                onClick={handleShowModal}
                className="nav-link"
                style={{
                  textDecoration: "none",
                  border: "none",
                  backgroundColor: "#dc3545",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  width: "100%",
                }}
              >
                <i className="nav-icon fas fa-sign-out-alt"></i>
                <p>Cerrar sesión</p>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>¿Estás seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Quieres cerrar sesión?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Confirmar y Salir
          </Button>
        </Modal.Footer>
      </Modal>
    </aside>
  );
};

export default Sidebar;
