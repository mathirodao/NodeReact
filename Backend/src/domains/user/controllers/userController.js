

const userService = require('../services/userService');

exports.getCurrentUser = async (req, res) => {
    try {
      const userId = req.user?._id;
  
      if (!userId) {
        return res.status(401).json({ error: "No hay una sesión activa" });
      }
  
      const user = await userService.getUserById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  };

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const user = await userService.updateUser(id, updatedData);

    res.status(200).json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.uploadUsersFromExcel = async (req, res) => {
  try {
    const usersData = req.body; 
    const result = await userService.uploadUsersFromExcel(usersData);

    res.status(200).json({ message: "Usuarios cargados correctamente", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.filterUsers = async (req, res) => {
  try {
    const filters = req.query; 
    const users = await userService.filterUsers(filters);

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};