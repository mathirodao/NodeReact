const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

class AuthService {
  async registerUser(userData) {
    try {
      const { firstName, lastName, password, birthDate } = userData;


      const passwordError = this.validatePassword(password);
      if (passwordError) throw new Error(passwordError);


      const email = await userRepository.generateUniqueEmail(firstName, lastName);


      const hashedPassword = await bcrypt.hash(password, 10);


      const formattedUserData = {
        ...userData,
        password: hashedPassword,
        email,
        person: {
          firstName,
          lastName,
          birthDate,
          sessions: [], 
        },
      };

      // Crear usuario
      const newUser = await userRepository.createUser(formattedUserData);

      return newUser;
    } catch (error) {
      console.error("Error en registerUser:", error.message);
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  }

  validatePassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      return "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número, un signo y no puede contener espacios.";
    }
    return null;
  }

  async loginUser(identifier, password, sessionId) {
    const user = await userRepository.findUser({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) throw new Error("Nombre de usuario o contraseña incorrectos");

    if (user.status === "blocked") throw new Error("El usuario está bloqueado");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedAttempts += 1;
      await userRepository.updateUser({ _id: user._id }, { failedAttempts: user.failedAttempts });

      if (user.failedAttempts >= 3) {
        await userRepository.updateUser({ _id: user._id }, { status: "blocked" });
        throw new Error("Usuario bloqueado después de 3 intentos fallidos");
      }

      throw new Error(`Contraseña incorrecta. Intentos restantes: ${3 - user.failedAttempts}`);
    }

    user.failedAttempts = 0;
    await userRepository.updateUser({ _id: user._id }, { failedAttempts: 0 });

    await userRepository.addSession(user._id, sessionId);

    return { ...user.toObject(), sessionId };
  }

  async logoutUser(sessionId) {
    await userRepository.updateSessionLogoutTime(sessionId);
  }
}

module.exports = new AuthService();