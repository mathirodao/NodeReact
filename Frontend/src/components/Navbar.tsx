import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../services/authService";

interface NavbarProps {
  user: {
    _id: string;
    username: string;
    role: string;
    status: string;
    person: {
      firstName: string;
      lastName: string;
      sessions: Array<{
        loginTime?: Date;
        logoutTime?: Date;
      }>;
    };
  };
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAdmin = user.role === "admin";
  const activeSession = user.person.sessions?.find(s => !s.logoutTime);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un problema al cerrar sesión. Por favor, intenta nuevamente.");
    }
  };

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/welcome">
          Mi App
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-expanded={isExpanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isExpanded ? 'show' : ''}`} id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/welcome" onClick={() => setIsExpanded(false)}>
                Bienvenido/a
              </Link>
            </li>

            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard" onClick={() => setIsExpanded(false)}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/maintenance" onClick={() => setIsExpanded(false)}>
                    Mantenimiento
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <div className="text-white d-none d-lg-block">
              <div className="fw-bold">
                {user.person.firstName} {user.person.lastName}
              </div>
              <div className="small">
                {activeSession ? (
                  <span className="text-success">● Sesión activa</span>
                ) : (
                  <span className="text-warning">● Sesión inactiva</span>
                )}
              </div>
            </div>
            
            <button
              className="btn btn-danger"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <i className="bi bi-box-arrow-right"></i> Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;