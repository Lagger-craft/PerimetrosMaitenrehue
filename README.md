<p align="center">
  <img src="src/assets/mi-logo.png" alt="Logo PerMaitenrehue" width="200"/>
</p>

# 🚧 PerMaitenrehue - Gestión de Cercos Vibrados

Este proyecto es una aplicación web completa para la gestión de una empresa de cercos vibrados, incluyendo un sitio web público para solicitar cotizaciones y un panel de administración para gestionar productos y revisar cotizaciones.

## ✨ Características

*   **Sitio Web Público:**
    *   🏠 Página de inicio con secciones informativas.
    *   🖼️ Galería de cercos y trabajos realizados.
    *   📝 Formulario de solicitud de cotizaciones.
*   **Panel de Administración:**
    *   🔒 Acceso seguro solo para administradores.
    *   📊 **Gestión de Cotizaciones:** Visualización de todas las solicitudes de cotización enviadas por los clientes.
    *   📦 **Gestión de Bodega:** CRUD (Crear, Leer, Actualizar, Eliminar) de productos con persistencia en base de datos.
    *   📸 **Subida de Imágenes:** Posibilidad de subir imágenes de productos directamente desde el panel de administración (formatos PNG, JPG, JPEG, WebP).
*   **Autenticación:** Sistema de registro e inicio de sesión de usuarios con roles (usuario/administrador) y tokens JWT.

## 🛠️ Tecnologías Utilizadas

*   **Frontend:**
    *   ⚛️ React (con Vite)
    *   🌐 React-Router-DOM
    *   🎨 React-Bootstrap (para componentes UI)
    *   💅 CSS (módulos y estilos globales)
*   **Backend:**
    *   🟢 Node.js
    *   🚀 Express.js (framework web)
    *   🍃 MongoDB (base de datos NoSQL)
    *    ODM Mongoose (para MongoDB)
    *   🔑 JWT (JSON Web Tokens para autenticación)
    *   🔒 Bcrypt.js (para hashing de contraseñas)
    *   📤 Multer (para manejo de subida de archivos)
    *   🔄 CORS (para permitir peticiones desde el frontend)
    *   ⚙️ Dotenv (para variables de entorno)
*   **Herramientas de Desarrollo:**
    *   ⚡ Vite (bundler para frontend)
    *   🔄 Nodemon (para reinicio automático del servidor backend)
    *   🐳 Docker (para ejecutar MongoDB localmente)

##  prerequisites  prerequisites

Asegúrate de tener instalado lo siguiente en tu sistema:

*   **Node.js** (versión 18 o superior)
*   **npm** (viene con Node.js)
*   **Docker** (para ejecutar MongoDB localmente, opcional si usas MongoDB Atlas)

## 🚀 Configuración del Proyecto

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd PerMaitenrehue
```

### 2. Instalación de Dependencias

Instala las dependencias tanto para el frontend como para el backend.

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd server
npm install
cd ..
```

### 3. Configuración del Backend

#### 🗄️ a. Base de Datos MongoDB

Puedes optar por usar una instancia local de MongoDB con Docker o un servicio en la nube como MongoDB Atlas.

**Opción A: MongoDB Local con Docker (Recomendado para desarrollo)**

1.  Asegúrate de que Docker esté corriendo en tu sistema.
2.  Inicia un contenedor de MongoDB:
    ```bash
    docker run -d -p 27017:27017 --name mongodb -v mongodb_data:/data/db mongo
    ```
    *   Esto creará un contenedor llamado `mongodb` y persistirá los datos en un volumen `mongodb_data`.
3.  La cadena de conexión para tu archivo `.env` será: `mongodb://localhost:27017/cercovibrados`

**Opción B: MongoDB Atlas (Nube)**

1.  Crea una cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  Crea un nuevo cluster (plan `M0 Sandbox` gratuito).
3.  Configura el acceso a la red (permite acceso desde tu IP o desde cualquier lugar).
4.  Crea un usuario de base de datos (guarda la contraseña).
5.  Obtén la cadena de conexión desde la sección "Connect your application" (asegúrate de reemplazar `<username>` y `<password>` con tus credenciales).

#### 🔑 b. Variables de Entorno (`.env`)

Crea un archivo `.env` en la carpeta `server/` con el siguiente contenido:

```
MONGO_URI=tu_cadena_de_conexion_mongodb
JWT_SECRET=una_clave_secreta_fuerte_para_jwt
```

*   Reemplaza `tu_cadena_de_conexion_mongodb` con la cadena obtenida de Docker o MongoDB Atlas.
*   Reemplaza `una_clave_secreta_fuerte_para_jwt` con una cadena de texto aleatoria y segura.

#### 📂 c. Carpeta de Subidas

Crea una carpeta `uploads` dentro de `server/` para almacenar las imágenes de productos:

```bash
mkdir server/uploads
```

### 4. Ejecutar la Aplicación

Abre **dos terminales separadas** en la raíz del proyecto (`PerMaitenrehue`).

**Terminal 1: Iniciar el Backend**

```bash
npm run start:backend
```

El servidor backend se iniciará en `http://localhost:5000`.

**Terminal 2: Iniciar el Frontend**

```bash
npm run dev
```

El servidor de desarrollo del frontend se iniciará (normalmente en `http://localhost:5173`).

## 👤 Acceso al Panel de Administración

1.  **Registra un usuario:** Ve a la página de registro de tu aplicación (ej. `http://localhost:5173/register`) y crea un usuario (por ejemplo, `username: admin`, `password: adminpass123`).
2.  **Conviértelo en administrador:** Abre una **nueva terminal** y ejecuta los siguientes comandos para acceder a la consola de MongoDB y cambiar el rol del usuario:
    ```bash
    docker exec -it mongodb mongosh
    ```
    Una vez dentro de `mongosh`:
    ```javascript
    use cercovibrados;
    db.users.updateOne({ "username": "admin" }, { "$set": { "role": "admin" } });
    exit
    ```
    *(Asegúrate de que el `username` coincida con el que registraste).*
3.  **Inicia sesión:** Ve a la página de administración (ej. `http://localhost:5173/administracion`) e inicia sesión con las credenciales del usuario `admin`. Serás redirigido al dashboard.
