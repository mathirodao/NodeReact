import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import UserMaintenance from "./components/UserMaintenance";
import { verifySession } from "./services/authService";
import { getCurrentUser } from "./services/userService";

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Verificar si hay una sesión activa
        await verifySession();

        // Obtener los datos del usuario loggeado
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error al verificar la sesión o cargar el usuario:", error);
        setUser(null); // No hay sesión activa
      } finally {
        setIsLoading(false); // Finalizar carga
      }
    };

    fetchSession();
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      {user && <Navbar user={user} />}
      <Routes>
        {!user && <Route path="*" element={<Navigate to="/" />} />}

        {/* Rutas protegidas */}
        <Route path="/welcome" element={<Welcome user={user} />} />
        <Route path="/dashboard" element={<Dashboard users={[]} />} />
        <Route path="/maintenance" element={<UserMaintenance isAdmin={user?.role === "admin"} />} />

        {/* Ruta de inicio de sesión */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;