# Proyecto: Sistema de Mantenimiento de Usuarios

Este proyecto es una aplicación full-stack que permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre usuarios. El frontend está construido con **React** y el backend con **Node.js** utilizando **Express**.

## Tabla de Contenidos

1. [Tecnologías Utilizadas](#tecnologías-utilizadas)
2. [Instalación y Configuración](#instalación-y-configuración)
   - [Backend](#backend)
   - [Frontend](#frontend)
3. [Ejecución del Sistema](#ejecución-del-sistema)
4. [Contribuciones](#contribuciones)
5. [Licencia](#licencia)

---

## Tecnologías Utilizadas

### Backend

- **Node.js**: v18 o superior
- **Express**: ^5.1.0
- **MongoDB**: v6.15.0 (con Mongoose ^8.13.1)
- **CORS**: ^2.8.5
- **BcryptJS**: ^3.0.2 (para cifrado de contraseñas)
- **Dotenv**: ^16.4.7 (para manejo de variables de entorno)

### Frontend

- **React**: ^19.0.0
- **React Router DOM**: ^7.4.1 (para enrutamiento)
- **Axios**: ^1.8.4 (para solicitudes HTTP)
- **Bootstrap**: ^5.3.3 (para estilos)
- **Vite**: ^6.2.0 (como bundler y servidor de desarrollo)
- **TypeScript**: ~5.7.2 (para tipado estático)
- **ESLint**: ^9.21.0 (para linting)

---

## Instalación y Configuración

### Backend

1. Clona el repositorio:
   ```bash
   git clone https://github.com/mathirodao/NodeReact.git
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del directorio `backend` con el siguiente contenido:
     ```env
   
     ```

4. Inicia el servidor:
   ```bash
   npm start
   ```

El backend estará disponible en `http://localhost:5000`.

---

### Frontend

1. Navega al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

El frontend estará disponible en `http://localhost:5173` (puerto predeterminado de Vite).

---

## Ejecución del Sistema

1. Asegúrate de que tanto el backend como el frontend estén ejecutándose.
2. Abre tu navegador y navega a `http://localhost:5173`.
3. Interactúa con la aplicación para gestionar usuarios.

---

## Contribuciones

Si deseas contribuir al proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m "Añade nueva funcionalidad"`).
4. Sube los cambios a tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request en GitHub.

