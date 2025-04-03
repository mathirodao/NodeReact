import React, { useState, useEffect } from "react";
import { getAllUsers, updateUser, changeUserStatus } from "../services/userService";

// Interfaz corregida
interface User {
  _id: string;
  username?: string;
  email?: string;
  role?: string;
  status?: { blocked: boolean }; // Campo opcional
  person?: {
    firstName?: string; // Corregido el nombre del campo
    sessions?: Array<{
      sessionId?: string;
      loginTime?: Date;
      logoutTime?: Date;
    }>;
  };
}

const UserMaintenance: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; email: string }>({ name: "", email: "" });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user._id);
    setFormData({
      name: user.person?.firstName || "", 
      email: user.email || "",
    });
  };

  const handleSaveChanges = async () => {
    if (!editingUserId) return;

    try {
      await updateUser(editingUserId, formData);
      alert("Usuario actualizado correctamente.");
      setEditingUserId(null);
      setFormData({ name: "", email: "" });
      fetchAllUsers(); 
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  const handleChangeStatus = async (userId: string, isBlocked: boolean) => {
    try {
      await changeUserStatus(userId, isBlocked);
      alert(`Estado del usuario cambiado a ${isBlocked ? "bloqueado" : "desbloqueado"}`);
      fetchAllUsers(); 
    } catch (error) {
      console.error("Error al cambiar el estado del usuario:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Mantenimiento de Usuarios</h3>

      {/* Lista de Usuarios */}
      <div className="mb-4">
        <h4>Lista de Usuarios</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.person?.firstName || "N/A"}</td> 
                <td>{user.email || "N/A"}</td>
                <td>{user.role || "N/A"}</td>
                <td>{user.status?.blocked ? "Bloqueado" : "Activo"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditUser(user)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleChangeStatus(user._id, !user.status?.blocked)}
                  >
                    {user.status?.blocked ? "Desbloquear" : "Bloquear"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUserId && (
        <div className="mb-4">
          <h4>Editar Usuario</h4>
          <form>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <button type="button" className="btn btn-success" onClick={handleSaveChanges}>
              Guardar Cambios
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserMaintenance;