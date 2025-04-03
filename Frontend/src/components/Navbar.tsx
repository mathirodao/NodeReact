// src/components/Navbar.tsx
import React from "react";
import { useEffect, useState } from "react";
import api from "../services/api";

interface NavbarProps {
  user: {
    role: string;
  };
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const isAdmin = user.role === "admin";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Mi App</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/welcome">Bienvenida</a>
            </li>
            {isAdmin && (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/dashboard">Dashboard</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/maintenance">Mantenimiento</a>
                </li>
              </>
            )}
            <li className="nav-item">
              <a className="nav-link" href="/" onClick={() => alert("Cerrar Sesión")}>
                Cerrar Sesión
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;