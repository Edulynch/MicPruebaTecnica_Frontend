import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import logoImg from "../assets/img/AdminLTELogo.webp";
import userImg from "../assets/img/userDummy.jpg";
import { Modal, Button } from "react-bootstrap"; // Importamos react-bootstrap

const Sidebar = ({ userNameShort }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Función para cerrar sesión
  const handleLogout = () => {
    // Eliminar token y usuario del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirigir al login
    navigate("/login");
  };

  // Función para abrir el modal de confirmación
  const handleShowModal = () => {
    setShowModal(true); // Mostrar el modal
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false); // Cerrar el modal
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const user = JSON.parse(storedUser);

      // Validar el token con la API
      axios
        .post("http://localhost:8080/api/auth/validate", { token })
        .then((response) => {
          if (response.data.email !== user.email) {
            // Si el email no coincide, eliminar el token y redirigir al login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }
        })
        .catch(() => {
          // Si la validación falla, eliminar el token y redirigir al login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        });
    }
  }, [navigate]);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <NavLink
        to="/dashboard"
        className="brand-link"
        style={{ textDecoration: "none" }}
      >
        <img
          src={logoImg}
          alt="Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span
          className="brand-text font-weight-light"
          style={{ textDecoration: "none" }}
        >
          AdminLTE 3
        </span>
      </NavLink>

      <div className="sidebar">
        {/* User Panel */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src={userImg}
              className="img-circle elevation-2"
              alt="Usuario"
            />
          </div>
          <div className="info">
            <NavLink
              to="/perfil"
              className="d-block"
              style={{ textDecoration: "none" }}
            >
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
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                style={{ textDecoration: "none" }} // Asegúrate de que no esté subrayado
              >
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/perfil"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                style={{ textDecoration: "none" }} // Asegúrate de que no esté subrayado
              >
                <i className="nav-icon fas fa-user"></i>
                <p>Ver Perfil</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/editar-perfil"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                style={{ textDecoration: "none" }} // Asegúrate de que no esté subrayado
              >
                <i className="nav-icon fas fa-edit"></i>
                <p>Editar Perfil</p>
              </NavLink>
            </li>

            {/* Botón de Cerrar sesión */}
            <li className="nav-item" style={{ marginTop: "auto" }}>
              <button
                onClick={handleShowModal}
                className="nav-link"
                style={{
                  textDecoration: "none",
                  border: "none",
                  backgroundColor: "#dc3545", // Fondo rojo
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  textAlign: "center",
                  width: "100%", // Aseguramos que el botón ocupe todo el ancho
                }}
              >
                <i className="nav-icon fas fa-sign-out-alt"></i>
                <p>Cerrar sesión</p>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>¿Estás seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que quieres cerrar sesión?</Modal.Body>
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
