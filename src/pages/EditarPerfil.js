// src/pages/EditarPerfil.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Importación usando named export
import api from "../api"; // Usamos la instancia de Axios configurada en api.js
import Sidebar from "../components/Sidebar";
import { Modal, Button } from "react-bootstrap";

// Función para parsear una fecha en formato "YYYY-MM-DD" a un objeto Date en hora local
const parseLocalDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  // Se resta 1 al mes, ya que en JavaScript los meses son 0-indexados
  return new Date(year, month - 1, day);
};

// Función que calcula si la fecha corresponde a una persona mayor de 18 años
const isAdult = (dateString) => {
  const birth = parseLocalDate(dateString);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 18;
};

const EditarPerfil = () => {
  const navigate = useNavigate();

  // Estados para los campos del formulario y mensajes
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // El correo se muestra pero no se edita; se utiliza únicamente userEmail
  const [shippingAddress, setShippingAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [success, setSuccess] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Al montar el componente, se verifica el token y se cargan los datos del usuario desde localStorage
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
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const initialUser = JSON.parse(storedUser);
      setFirstName(initialUser.firstName);
      setLastName(initialUser.lastName);
      // Se muestra el correo, pero no se edita
      setShippingAddress(initialUser.shippingAddress);
      // Se asegura que la fecha tenga el formato YYYY-MM-DD
      setBirthDate(initialUser.birthDate ? initialUser.birthDate.substring(0, 10) : "");
      setUserEmail(initialUser.email);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Handler para el cambio en el input de fecha, validando en tiempo real
  const handleBirthDateChange = (e) => {
    const value = e.target.value;
    setBirthDate(value);
    if (value && !isAdult(value)) {
      setBirthDateError("El usuario debe ser mayor de 18 años");
    } else {
      setBirthDateError("");
    }
  };

  // Función para enviar la actualización del perfil al backend
  const handleSubmit = async () => {
    // Si hay error en la fecha de nacimiento, no se envía
    if (birthDateError) {
      setError(birthDateError);
      return;
    }
    // Se arma el objeto de actualización sin incluir el correo (ya que este no se edita)
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
      // Se usa el endpoint de perfil, el cual utiliza el DTO de actualización (UserProfileUpdateDTO)
      const response = await api.put(
        "/users/profile",
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
      console.error(err);
      setIsLoading(false);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Error al actualizar el perfil.");
      }
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

  // Para mostrar nombres cortos en el Sidebar (primer nombre y primer apellido)
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleOpenModal();
                  }}
                >
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
                      value={userEmail}
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
                      onChange={handleBirthDateChange}
                      required
                    />
                    {birthDateError && (
                      <small className="text-danger">{birthDateError}</small>
                    )}
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
