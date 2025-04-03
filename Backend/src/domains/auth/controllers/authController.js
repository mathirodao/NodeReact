const userRepository = require('../repositories/userRepository');
const authService = require('../services/authService');

exports.registerUser = async (req, res) => {
  try {
    const { username, firstName, lastName, identification, password, birthDate } = req.body;

    const newUser = await authService.registerUser({
      username,
      firstName,
      lastName,
      identification,
      password,
      birthDate,
    });


    res.status(201).json({ message: "Usuario registrado correctamente", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await authService.loginUser(identifier, password);

    res.cookie('userId', user._id, {
      httpOnly: true, // Prevenir acceso desde JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Inicio de sesión exitoso", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const user = await userRepository.findUserByActiveSession(userId);

    if (!user) {
      return res.status(401).json({ error: "No hay una sesión activa" });
    }

    const activeSession = user.person.sessions.find((session) => !session.logoutTime);
    if (!activeSession) {
      return res.status(401).json({ error: "No hay una sesión activa" });
    }

    const sessionId = activeSession.sessionId;

    await authService.logoutUser(sessionId);

    res.clearCookie('userId', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("Error en logoutUser:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.verifySession = async (req, res) => {
  try {

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "No hay una sesión activa" });
    }

    const user = await userRepository.findUserByActiveSession(userId);

    if (!user) {
      return res.status(401).json({ error: "No hay una sesión activa" });
    }

    res.status(200).json({ message: "Sesión activa", user });
  } catch (error) {
    console.error("Error al verificar la sesión:", error);
    res.status(500).json({ error: "Error al verificar la sesión" });
  }


};