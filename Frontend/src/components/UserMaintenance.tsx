// src/components/UserMaintenance.tsx
import React, { useState } from "react";

interface UserMaintenanceProps {
  isAdmin: boolean;
}

const UserMaintenance: React.FC<UserMaintenanceProps> = ({ isAdmin }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/users/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Usuarios cargados correctamente.");
      } else {
        alert("Error al cargar usuarios.");
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Mantenimiento de Usuarios</h3>

      {/* Cargar Masiva */}
      {isAdmin && (
        <div className="mb-4">
          <label className="form-label">Cargar Usuarios (.xlsx o .csv)</label>
          <input type="file" className="form-control" onChange={handleFileChange} />
          <button className="btn btn-primary mt-2" onClick={handleUpload}>
            Cargar Archivo
          </button>
        </div>
      )}

      {/* Actualizar Datos */}
      <div>
        <h4>Actualizar Datos</h4>
        <form>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" />
          </div>
          <button type="submit" className="btn btn-success">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserMaintenance;