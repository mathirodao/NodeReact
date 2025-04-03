// src/pages/Dashboard.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

interface User {
  _id: string;
  person: {
    name: string;
  };
  email: string;
  status: {
    blocked: boolean;
  };
  failedAttempts: number;
  sessions: {
    logoutTime?: string;
  }[];
}

interface DashboardProps {
  users: User[];
}

const Dashboard: React.FC<DashboardProps> = ({ users }) => {
  console.log("users", users);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert(
        "Hubo un problema al cerrar sesión. Por favor, intenta nuevamente."
      );
    }
  };

  const activeUsers = users.filter(
    (user) => !user.status.blocked && user.sessions.some((s) => !s.logoutTime)
  ).length;
  const inactiveUsers = users.filter(
    (user) => !user.sessions.some((s) => !s.logoutTime)
  ).length;
  const blockedUsers = users.filter((user) => user.status.blocked).length;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Dashboard</h1>
        <button className="btn btn-danger" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      {/* Indicadores */}
      <div className="row">
        <div className="col-md-4">
          <div className="card text-center bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Usuarios Activos</h5>
              <p className="card-text display-4">{activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Usuarios Inactivos</h5>
              <p className="card-text display-4">{inactiveUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-danger text-white">
            <div className="card-body">
              <h5 className="card-title">Usuarios Bloqueados</h5>
              <p className="card-text display-4">{blockedUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="mt-4">
        <h3>Lista de Usuarios</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Intentos Fallidos</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.person.name}</td>
                <td>{user.email}</td>
                <td>{user.status.blocked ? "Bloqueado" : "Activo"}</td>
                <td>{user.failedAttempts || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
