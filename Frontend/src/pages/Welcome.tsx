import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifySession } from "../services/authService";
import { getCurrentUser } from "../services/userService";

interface Session {
  _id: string;
  loginTime: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  failedAttempts: number;
  person: {
    firstName: string;
    lastName: string;
    birthDate: string;
    sessions: Session[];
  };
}

const Welcome: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await verifySession();
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error al verificar la sesión o cargar el usuario:", error);
        navigate("/"); 
      } finally {
        setIsLoading(false); 
      }
    };

    fetchUserData();
  }, [navigate]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      console.error("Error formateando fecha:", dateString, e);
      return "Fecha inválida";
    }
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return "N/A";
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffMs = endDate.getTime() - startDate.getTime();
      
      const minutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      return `${hours > 0 ? `${hours}h ` : ""}${remainingMinutes}m`;
    } catch (e) {
      console.error("Error calculando duración:", e);
      return "N/A";
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="alert alert-warning mt-3">Redirigiendo al inicio de sesión...</div>;
  }

  const sortedSessions = [...user.person.sessions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const activeSession = sortedSessions.find(session => 
    !session.updatedAt || 
    new Date(session.updatedAt) <= new Date(session.createdAt)
  );

  const lastSession = sortedSessions[0];

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Bienvenido, {user.person.firstName} {user.person.lastName}</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5 className="mb-3">Información del Usuario</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Nombre de usuario:</strong> {user.username}
                </li>
                <li className="list-group-item">
                  <strong>Correo electrónico:</strong> {user.email}
                </li>
                <li className="list-group-item">
                  <strong>Rol:</strong> {user.role === "admin" ? "Administrador" : "Usuario"}
                </li>
                <li className="list-group-item">
                  <strong>Estado:</strong> 
                  <span className={`badge ms-2 ${
                    user.status === "active" ? "bg-success" : "bg-danger"
                  }`}>
                    {user.status === "active" ? "Activo" : "Bloqueado"}
                  </span>
                </li>
                <li className="list-group-item">
                  <strong>Fecha de nacimiento:</strong> {formatDate(user.person.birthDate)}
                </li>
                <li className="list-group-item">
                  <strong>Intentos fallidos recientes:</strong> {user.failedAttempts || 0}
                </li>
              </ul>
            </div>

            <div className="col-md-6">
              <h5 className="mb-3">Información de Sesión</h5>
              
              {activeSession && (
                <div className="alert alert-success">
                  <strong>Sesión actual activa desde:</strong><br />
                  {formatDate(activeSession.loginTime || activeSession.createdAt)}
                </div>
              )}
              
              {lastSession && (
                <>
                  <h6 className="mt-3">Última sesión registrada</h6>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Inicio:</strong> {formatDate(lastSession.loginTime || lastSession.createdAt)}
                    </li>
                    <li className="list-group-item">
                      <strong>Fin:</strong> {
                        lastSession.updatedAt && 
                        lastSession.updatedAt !== lastSession.createdAt
                          ? formatDate(lastSession.updatedAt)
                          : "Sesión aún activa"
                      }
                    </li>
                    <li className="list-group-item">
                      <strong>Duración:</strong> {
                        lastSession.updatedAt && 
                        lastSession.updatedAt !== lastSession.createdAt
                          ? calculateDuration(
                              lastSession.loginTime || lastSession.createdAt,
                              lastSession.updatedAt
                            )
                          : "En curso"
                      }
                    </li>
                  </ul>
                </>
              )}

              {user.person.sessions.length === 0 && (
                <div className="alert alert-info">
                  No hay registro de sesiones anteriores
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;