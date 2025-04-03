const userRepository = require('../domains/auth/repositories/userRepository');

const authenticateUser = async (req, res, next) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const user = await userRepository.findUserById(userId);

    if (!user) {
      return res.status(401).json({ error: "No autorizado" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.error("Error en authenticateUser:", error);
    res.status(500).json({ error: "Error al autenticar usuario" });
  }
};



module.exports = authenticateUser;