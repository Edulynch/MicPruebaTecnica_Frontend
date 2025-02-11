// src/components/Sidebar.js
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api";
import logoImg from "../assets/img/AdminLTELogo.webp";
import userImg from "../assets/img/userDummy.jpg";
import { Modal, Button } from "react-bootstrap";

const Sidebar = ({ userNameShort }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = React.useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Verificamos si el usuario tiene rol ADMIN o WORKER
  const isAdminOrWorker =
    user &&
    user.roles &&
    user.roles.some(
      (r) =>
        (typeof r === "string" && (r.toUpperCase() === "ADMIN" || r.toUpperCase() === "WORKER")) ||
        (typeof r === "object" && r.name && (r.name.toUpperCase() === "ADMIN" || r.name.toUpperCase() === "WORKER"))
    );

  // (Opcional: agregar logs para depurar)
  // console.log("Usuario logueado:", user);
  // if (user && user.roles) console.log("Roles del usuario:", user.roles);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && user) {
      api
        .post("/auth/validate", { token })
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
  }, [navigate, user]);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <NavLink to="/dashboard" className="brand-link" style={{ textDecoration: "none" }}>
        <img src={logoImg} alt="Logo" className="brand-image img-circle elevation-3" style={{ opacity: ".8" }} />
        <span className="brand-text font-weight-light">AdminLTE 3</span>
      </NavLink>

      <div className="sidebar">
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

        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            {/* Enlaces básicos */}
            <li className="nav-item">
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ textDecoration: "none" }}>
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/perfil" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ textDecoration: "none" }}>
                <i className="nav-icon fas fa-user"></i>
                <p>Perfil</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/catalogo" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ textDecoration: "none" }}>
                <i className="nav-icon fas fa-list"></i>
                <p>Catálogo</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/carrito" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ textDecoration: "none" }}>
                <i className="nav-icon fas fa-shopping-cart"></i>
                <p>Carrito</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/checkout" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ textDecoration: "none" }}>
                <i className="nav-icon fas fa-credit-card"></i>
                <p>Checkout</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/ordenes" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ textDecoration: "none" }}>
                <i className="nav-icon fas fa-receipt"></i>
                <p>Órdenes</p>
              </NavLink>
            </li>

            {/* Sección de Administración */}
            {isAdminOrWorker && (
              <>
                <li className="nav-header">Administración</li>
                <li className="nav-item">
                  <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ textDecoration: "none" }}>
                    <i className="nav-icon fas fa-users-cog"></i>
                    <p>Gestión de Usuarios</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ textDecoration: "none" }}>
                    <i className="nav-icon fas fa-clipboard-list"></i>
                    <p>Gestión de Órdenes</p>
                  </NavLink>
                </li>
              </>
            )}

            <li className="nav-item" style={{ marginTop: "auto" }}>
              <button
                onClick={() => setShowModal(true)}
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¿Estás seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Quieres cerrar sesión?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Confirmar y Salir
          </Button>
        </Modal.Footer>
      </Modal>
    </aside>
  );
};

export default Sidebar;
