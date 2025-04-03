const userRepository = require('../domains/auth/repositories/userRepository');

const authenticateUser = async (req, res, next) => {
  try {
    const userId = req.cookies.userId;
    console.log('authenticateUser userId',userId)
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const user = await userRepository.findUserById(userId);
    console.log('authenticateUser user ',user)

    if (!user) {
      return res.status(401).json({ error: "No autorizado" });
    }
    console.log('tiene user, deberia ser req.user')
    // Adjuntar el usuario a la solicitud
    req.user = user;
    console.log('req.user',req.user)

    next();
  } catch (error) {
    console.error("Error en authenticateUser:", error);
    res.status(500).json({ error: "Error al autenticar usuario" });
  }
};



module.exports = authenticateUser;