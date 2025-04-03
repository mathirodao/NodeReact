import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identification, setIdentification] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [username, setUsername] = useState(""); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Función para validar el username
  const validateUsername = (username: string): string | null => {
    const regex = /^[a-zA-Z0-9]+$/; 
    if (!regex.test(username)) {
      return "El nombre de usuario solo puede contener letras y números.";
    }
    if (!/[A-Z]/.test(username)) {
      return "El nombre de usuario debe incluir al menos una letra mayúscula.";
    }
    if (!/\d/.test(username)) {
      return "El nombre de usuario debe incluir al menos un número.";
    }
    if (username.length < 8 || username.length > 20) {
      return "El nombre de usuario debe tener entre 8 y 20 caracteres.";
    }
    return null; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !identification || !password || !birthDate || !username) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    // Validar el username
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    try {
      await api.post("/api/auth/register", {
        firstName,
        lastName,
        identification,
        password,
        birthDate,
        username, 
      });

      navigate("/");
    } catch (err) {
      console.error("Error durante el registro:", err);
      setError("Error al registrar usuario.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label>Nombres:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label>Apellidos:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div>
        <label>Identificación:</label>
        <input
          type="text"
          value={identification}
          onChange={(e) => setIdentification(e.target.value)}
        />
      </div>
      <div>
        <label>Nombre de Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Fecha de Nacimiento:</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Register;