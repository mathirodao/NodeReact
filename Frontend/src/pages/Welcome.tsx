import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifySession } from "../services/authService";
import { getCurrentUser } from "../services/userService";

interface Session {
  loginTime?: string;
  logoutTime?: string;
}

interface User {
  person: {
    name: string;
    sessions: Session[];
  };
  email: string;
  failedAttempts: number;
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

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>Redirigiendo al inicio de sesión...</div>;
  }

  const lastSession = user.person.sessions.find((session) => session.logoutTime);

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3>Bienvenido, {user.person.name}</h3>
        </div>
        <div className="card-body">
          <p><strong>Correo electrónico:</strong> {user.email}</p>
          <p><strong>Intentos fallidos:</strong> {user.failedAttempts || 0}</p>
          <p><strong>Última sesión activa:</strong></p>
          <ul>
            <li><strong>Hora de inicio:</strong> {lastSession?.loginTime || "N/A"}</li>
            <li><strong>Hora de cierre:</strong> {lastSession?.logoutTime || "N/A"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Welcome;