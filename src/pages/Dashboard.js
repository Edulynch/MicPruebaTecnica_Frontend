// /src/pages/Dashboard.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();

  // Verificar autenticación y expiración del token
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

  // Recupera el usuario y obtiene solo el primer nombre y primer apellido
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const firstNameShort = user && user.firstName ? user.firstName.split(' ')[0] : 'Nombre';
  const lastNameShort = user && user.lastName ? user.lastName.split(' ')[0] : 'Usuario';
  const userNameShort = user ? `${firstNameShort} ${lastNameShort}` : 'Nombre Usuario';

  // Función para eliminar el token (simular expiración)
  const handleFakeExpire = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Token y datos eliminados. Redirigiendo al login.');
    navigate('/login');
  };

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
                <h1>Dashboard</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="alert alert-info" role="alert">
              Bienvenido al Dashboard. Selecciona una opción del menú lateral.
            </div>
            <button className="btn btn-danger" onClick={handleFakeExpire}>
              Eliminar Token (Simular expiración)
            </button>
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

export default Dashboard;
