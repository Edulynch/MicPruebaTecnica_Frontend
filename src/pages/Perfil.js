// /src/pages/Perfil.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '../components/Sidebar';

const Perfil = () => {
  const navigate = useNavigate();

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  }, [navigate]);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Nombres completos para el contenido y nombres cortos para el sidebar
  const fullFirstName = user && user.firstName ? user.firstName : 'Nombre';
  const fullLastName = user && user.lastName ? user.lastName : 'Usuario';
  const firstNameShort = fullFirstName.split(' ')[0];
  const lastNameShort = fullLastName.split(' ')[0];
  const userNameShort = `${firstNameShort} ${lastNameShort}`;

  const email = user && user.email ? user.email : 'Correo no disponible';
  const shippingAddress = user && user.shippingAddress ? user.shippingAddress : 'Dirección no disponible';
  const birthDate = user && user.birthDate ? user.birthDate : 'Fecha no disponible';

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
              style={{ border: 'none', background: 'none', outline: 'none' }}
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
                <h1>Perfil de Usuario</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Datos del Usuario</h3>
              </div>
              <div className="card-body">
                <dl className="row">
                  <dt className="col-sm-3">Nombre</dt>
                  <dd className="col-sm-9">{fullFirstName} {fullLastName}</dd>
                  <dt className="col-sm-3">Correo Electrónico</dt>
                  <dd className="col-sm-9">{email}</dd>
                  <dt className="col-sm-3">Dirección</dt>
                  <dd className="col-sm-9">{shippingAddress}</dd>
                  <dt className="col-sm-3">Fecha de Nacimiento</dt>
                  <dd className="col-sm-9">{birthDate}</dd>
                </dl>
              </div>
              <div className="card-footer">
                <Link to="/editar-perfil" className="btn btn-warning">
                  Editar Perfil
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="main-footer">
        <strong>
          &copy; {new Date().getFullYear()} <Link to="/dashboard">AdminLTE 3</Link>.
        </strong>{' '}
        Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Perfil;
