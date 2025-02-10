// src/pages/EditarPerfil.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Modal, Button } from "react-bootstrap";

const EditarPerfil = () => {
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Verificar token y cargar datos del usuario al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const initialUser = JSON.parse(storedUser);
      setId(initialUser.id);
      setFirstName(initialUser.firstName);
      setLastName(initialUser.lastName);
      setEmail(initialUser.email); // El email se toma de localStorage
      setShippingAddress(initialUser.shippingAddress);
      setBirthDate(initialUser.birthDate);
      setUserEmail(initialUser.email);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (email !== userEmail) {
      setError("El correo electrónico no coincide con el guardado en la cuenta.");
      setSuccess("");
      return;
    }

    const updatedUser = { firstName, lastName, shippingAddress, birthDate };
    if (password.trim() !== "") {
      if (password.trim().length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      updatedUser.password = password;
    }

    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:8080/api/users/" + id,
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      setSuccess("Perfil actualizado con éxito.");
      setError("");
      setTimeout(() => {
        navigate("/perfil");
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError("Error al actualizar el perfil.");
      setSuccess("");
    }
  };

  const handleConfirmUpdate = () => {
    setShowModal(false);
    handleSubmit();
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Nombres cortos para el Sidebar (primer nombre y primer apellido)
  const firstNameShort = firstName ? firstName.split(" ")[0] : "Nombre";
  const lastNameShort = lastName ? lastName.split(" ")[0] : "Usuario";
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  return (
    <div className="wrapper">
      {/* HEADER */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <button
              type="button"
              className="nav-link"
              data-widget="pushmenu"
              style={{ border: "none", background: "none", outline: "none" }}
            >
              <i className="fas fa-bars"></i>
            </button>
          </li>
        </ul>
      </nav>

      {/* Sidebar */}
      <Sidebar userNameShort={userNameShort} />

      {/* Contenido Principal */}
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Editar Perfil</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Editar Datos del Usuario</h3>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={(e) => { e.preventDefault(); handleOpenModal(); }}>
                  <div className="form-group">
                    <label htmlFor="firstName">Nombre</label>
                    <input
                      type="text"
                      id="firstName"
                      className="form-control"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Apellido</label>
                    <input
                      type="text"
                      id="lastName"
                      className="form-control"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={email}
                      disabled
                    />
                    <small className="form-text text-muted">
                      El correo electrónico no se puede cambiar.
                    </small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="shippingAddress">Dirección</label>
                    <input
                      type="text"
                      id="shippingAddress"
                      className="form-control"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="birthDate">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      id="birthDate"
                      className="form-control"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">
                      Nueva Contraseña (opcional)
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Deja vacío para mantener la actual"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleOpenModal}
                    disabled={isLoading}
                  >
                    {isLoading ? "Actualizando..." : "Actualizar Perfil"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal de Confirmación */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Actualización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas actualizar tus datos?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmUpdate}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* FOOTER */}
      <footer className="main-footer">
        <strong>
          &copy; {new Date().getFullYear()}{" "}
          <Link to="/dashboard">AdminLTE 3</Link>.
        </strong>{" "}
        Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default EditarPerfil;
