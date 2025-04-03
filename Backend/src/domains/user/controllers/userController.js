class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    getCurrentUser = async (req, res) => {
        try {
            const userId = req.user?._id;

            if (!userId) {
                return res.status(401).json({ error: "No hay una sesión activa" });
            }

            const user = await this.userService.getUserById(userId);

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.status(200).json({ user });
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
            res.status(500).json({ error: "Error al obtener el usuario" });
        }
    };

    getAllUsers = async (req, res) => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    updateUser = async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const user = await this.userService.updateUser(id, updatedData);

            res.status(200).json({ message: "Usuario actualizado correctamente", user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };


    filterUsers = async (req, res) => {
        try {
            const filters = req.query;
            const users = await this.userService.filterUsers(filters);

            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    getUsersStats = async (req, res) => {
        try {
            const users = await this.userService.getAllUsers();

            const stats = {
                totalUsers: users.length,
                activeUsers: users.filter(u =>
                    u.status === 'active' &&
                    u.person.sessions.some(s => !s.logoutTime)
                ).length,
                inactiveUsers: users.filter(u =>
                    u.status === 'active' &&
                    !u.person.sessions.some(s => !s.logoutTime)
                ).length,
                blockedUsers: users.filter(u => u.status === 'blocked').length,
                adminsCount: users.filter(u => u.role === 'admin').length
            };

            res.status(200).json(stats);
        } catch (error) {
            console.error('Error en getUsersStats:', error);
            res.status(500).json({
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    };

    
      getFailedLoginStats = async (req, res) => {
        try {
          const users = await this.userService.getAllUsers();
          
          const stats = {
            totalFailedAttempts: users.reduce((sum, user) => sum + (user.failedAttempts || 0), 0),
            failedAttemptsByUser: users
              .filter(user => user.failedAttempts > 0)
              .map(user => ({
                username: user.username,
                attempts: user.failedAttempts
              }))
              .sort((a, b) => b.attempts - a.attempts)
          };
      
          res.status(200).json(stats);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };


}

module.exports = UserController;