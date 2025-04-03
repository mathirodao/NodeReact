import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import UserMaintenance from "./components/UserMaintenance";
import Register from "./pages/Register";
import { verifySession } from "./services/authService";
import { getCurrentUser } from "./services/userService";
import ErrorBoundary from "./components/ErrorBoundary";

interface User {
  _id: string;
  role: string;
  person: {
    name: string;
  };
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        await verifySession();
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {user && <Navbar user={user} />}
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/"
          element={!user ? <Home /> : <Navigate to="/welcome" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/welcome" />}
        />

        {/* Rutas protegidas */}
        <Route
          path="/welcome"
          element={user ? <Welcome /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard"
          element={
            user?.role === "admin" ? (
              <ErrorBoundary>
                <Dashboard user={user} />
              </ErrorBoundary>
            ) : (
              <Navigate to="/welcome" />
            )
          }
        />
        <Route
          path="/maintenance"
          element={
            user?.role === "admin" ? (
              <UserMaintenance />
            ) : (
              <Navigate to={user ? "/welcome" : "/"} />
            )
          }
        />

        {/* Redirección para rutas no encontradas */}
        <Route path="*" element={<Navigate to={user ? "/welcome" : "/"} />} />
      </Routes>
    </Router>
  );
};

export default App;
