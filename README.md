# 🏗️ PerímetrosMaitenrehue - Sitio Web Completo

<div align="center">

![Logo PerímetrosMaitenrehue](src/assets/mi-logo.png)

**Sitio web profesional para empresa de cercos vibrados**  
_Solución completa con panel de administración y sistema de facturación_

[![Deploy Status](https://img.shields.io/badge/Deploy-GitHub%20Pages-success)](https://lagger-craft.github.io/PerimetrosMaitenrehue/)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen)](https://mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://docker.com/)

[🌐 Ver Sitio Web](https://lagger-craft.github.io/PerimetrosMaitenrehue/) | [📋 Panel Admin](https://lagger-craft.github.io/PerimetrosMaitenrehue/administracion) | [🧪 Debug WhatsApp](https://lagger-craft.github.io/PerimetrosMaitenrehue/whatsapp-test)

</div>

---

## 📋 Tabla de Contenido

- [🎯 Características Principales](#-características-principales)
- [💼 Sistema de Facturación Profesional](#-sistema-de-facturación-profesional)
- [🚀 Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚡ Instalación Rápida](#-instalación-rápida)
- [🐳 Configuración con Docker](#-configuración-con-docker)
- [👨‍💼 Panel de Administración](#-panel-de-administración)
- [📱 Integración WhatsApp](#-integración-whatsapp)
- [🚀 Despliegue](#-despliegue)
- [📱 Compatibilidad](#-compatibilidad)

---

## 🎯 Características Principales

### **Frontend (React + Vite)**

- ✅ **Responsive Design**: 100% compatible móvil/tablet/desktop
- ✅ **Panel de Administración**: Gestión completa de cotizaciones y productos
- ✅ **Sistema de Facturación**: Generación profesional de cotizaciones/facturas
- ✅ **Integración WhatsApp**: Contacto directo sin APIs externas
- ✅ **Galería de Productos**: Visualización optimizada de cercos
- ✅ **Sistema de Cotizaciones**: Formulario completo con validación RUT
- ✅ **Navegación Móvil**: Menú flotante para administradores
- ✅ **Animaciones Suaves**: Transiciones profesionales
- ✅ **Estados de Carga**: Feedback visual optimizado

### **Backend (Node.js + Express)**

- ✅ **API RESTful**: Endpoints completos y documentados
- ✅ **Autenticación JWT**: Sistema seguro de usuarios
- ✅ **Base de Datos MongoDB**: Almacenamiento optimizado
- ✅ **Subida de Archivos**: Gestión de imágenes de productos
- ✅ **Middleware de Seguridad**: Rate limiting y validación
- ✅ **Variables de Entorno**: Configuración flexible

---

## 💼 Sistema de Facturación Profesional

### **🧾 Generación de Cotizaciones/Facturas**

**Formato Profesional Completo:**

#### **Encabezado Corporativo**
- ✅ **Nombre de la empresa** en grande con espacio para eslogan
- ✅ **Datos básicos** de la empresa (dirección, ciudad, teléfono, fax)
- ✅ **Información del documento** (fecha, número, ID cliente, validez, responsable)

#### **Datos del Cliente**
- ✅ **Sección dedicada** "Cotización para:" / "Facturado a:"
- ✅ **Información completa** (nombre, empresa, dirección, contacto)

#### **Detalles Logísticos**
- ✅ **Tabla con datos operativos** (vendedor, N° O/C, fecha envío, método envío, punto F.O.B., términos)

#### **Productos y Servicios**
- ✅ **Tabla detallada** con cantidad, descripción, precio unitario, impuestos y montos
- ✅ **Cálculos automáticos** basados en metros lineales y altura del cerco
- ✅ **Precios predefinidos** por tipo de cerco (1.50m: $45.000, 1.90m: $55.000, etc.)

#### **Resumen Financiero**
- ✅ **Subtotal, IVA (19%), otros gastos y total final**
- ✅ **Formato de moneda chilena** (CLP)

#### **Pie de Página Profesional**
- ✅ **Mensaje de contacto** y agradecimiento

### **📋 Funcionalidades de Gestión**

#### **Vista Previa e Impresión**
- ✅ **Modal de vista previa** antes de generar
- ✅ **Función de impresión** optimizada para A4
- ✅ **Formato responsive** para todos los dispositivos

#### **Gestión de Facturas Guardadas**
- ✅ **Lista completa** de facturas generadas
- ✅ **Doble funcionalidad**:
  - **"Ver Detalles"**: Información resumida
  - **"Ver Factura"**: Documento completo formateado
- ✅ **Vista de factura guardada** con mismo formato profesional
- ✅ **Impresión directa** desde la lista
- ✅ **Búsqueda y filtrado** avanzado

#### **Integración con Cotizaciones**
- ✅ **Carga automática** de datos desde cotizaciones existentes
- ✅ **Autocompletado** de información del cliente
- ✅ **Conversión automática** cotización → factura

### **💳 Características del Sistema**

```javascript
// Precios automáticos por metro lineal
const precios = {
  "1.50m": 45000,  // CLP
  "1.90m": 55000,  // CLP  
  "2.10m": 65000,  // CLP
  "2.40m": 75000,  // CLP
  "Otra": 60000    // CLP (personalizada)
};

// Configuración fiscal Chile
const impuestos = {
  iva: 19,           // %
  moneda: "CLP",     // Peso Chileno
  validez: 30        // días
};
```

### **🎨 Diseño Profesional**

- **Colores corporativos** (azul profundo #007bff)
- **Tipografía profesional** (Arial)
- **Layout optimizado** para impresión A4
- **Responsive design** (desktop, tablet, móvil)
- **Estilos de impresión** dedicados

---

## 🚀 Tecnologías Utilizadas

### **Frontend Stack**

```json
{
  "framework": "React 19.1.1",
  "bundler": "Vite 5.0.0", 
  "ui": "React Bootstrap 2.10.10",
  "routing": "React Router 6.26.1",
  "icons": "React Bootstrap Icons",
  "styling": "CSS3 + Custom Properties"
}
```

### **Backend Stack**

```json
{
  "runtime": "Node.js 20.x",
  "framework": "Express 4.19.2",
  "database": "MongoDB 7.x",
  "auth": "JWT + bcryptjs",
  "files": "Multer",
  "security": "express-rate-limit"
}
```

---

## 📁 Estructura del Proyecto

```
PerMaitenrehue/
├── 📁 public/               # Archivos estáticos
├── 📁 src/                  # Código fuente frontend
│   ├── 📁 components/       # Componentes React
│   │   ├── 📁 admin/        # Panel de administración
│   │   │   ├── InvoicePage.jsx          # Generación de facturas
│   │   │   ├── InvoiceListPage.jsx      # Lista de facturas
│   │   │   ├── InvoiceTemplate.jsx      # Plantilla profesional
│   │   │   ├── AdminDashboard.jsx       # Dashboard principal
│   │   │   └── BodegaPage.jsx           # Gestión de productos
│   │   ├── 📁 auth/         # Autenticación
│   │   └── QuotePage.jsx    # Formulario de cotizaciones
│   ├── 📁 context/          # Context API
│   ├── 📁 hooks/            # Custom hooks
│   └── main.jsx             # Punto de entrada
├── 📁 server/               # Backend Node.js
│   ├── 📁 config/           # Configuración DB
│   ├── 📁 models/           # Modelos MongoDB
│   ├── 📁 routes/           # Rutas API
│   ├── 📁 middleware/       # Middlewares
│   ├── server.js            # Servidor principal
│   └── .env                 # Variables de entorno
├── package.json             # Dependencias frontend
├── vite.config.js           # Configuración Vite
└── docker-compose.yml       # Configuración Docker
```

---

## ⚡ Instalación Rápida

### **Prerrequisitos**

- ✅ **Node.js 18+** ([Descargar](https://nodejs.org/))
- ✅ **Docker** ([Descargar](https://docker.com/))
- ✅ **Git** ([Descargar](https://git-scm.com/))

### **1. Clonar el Repositorio**

```bash
git clone https://github.com/Lagger-craft/PerimetrosMaitenrehue.git
cd PerimetrosMaitenrehue
```

### **2. Instalación Automática**

```bash
# Instalar dependencias frontend
npm install

# Instalar dependencias backend
cd server
npm install
cd ..
```

### **3. Configurar Variables de Entorno**

```bash
# Crear archivo de configuración backend
cp server/.env.example server/.env

# Editar variables (usar tu editor preferido)
nano server/.env
```

**Contenido del archivo `server/.env`:**

```env
# Configuración del Servidor
PORT=5000
NODE_ENV=development

# Base de Datos MongoDB
MONGODB_URI=mongodb://admin:password123@localhost:27017/perimetros?authSource=admin

# Autenticación JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_2024
JWT_EXPIRE=24h

# Configuración CORS
FRONTEND_URL=http://localhost:5173
```

### **4. Iniciar con Docker (Recomendado)**

```bash
# Levantar toda la infraestructura
docker-compose up -d

# Verificar que esté funcionando
docker-compose ps
```

### **5. Acceder a la Aplicación**

- 🌐 **Frontend**: <http://localhost:5173>
- 🔧 **Backend API**: <http://localhost:5000>
- 🗄️ **MongoDB**: localhost:27017

---

## 🐳 Configuración con Docker

### **Docker Compose Incluido**

```yaml
# docker-compose.yml
version: "3.8"
services:
  mongodb:
    image: mongo:7
    container_name: perimetros_mongo
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./server
    container_name: perimetros_backend
    restart: always
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://admin:password123@mongodb:27017/perimetros?authSource=admin

volumes:
  mongodb_data:
```

### **Comandos Docker Útiles**

```bash
# Levantar servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Parar servicios
docker-compose down

# Limpiar todo (⚠️ Elimina datos)
docker-compose down -v
```

---

## 👨‍💼 Panel de Administración

### **Acceso de Administrador**

1. **URL**: `/administracion`
2. **Credenciales por defecto**:
   - Usuario: `admin`
   - Contraseña: `admin123`

### **Funcionalidades del Dashboard**

#### **1. Gestión de Cotizaciones (`/administracion/dashboard`)**

- ✅ **Lista completa** de cotizaciones recibidas
- ✅ **Vista detallada** en modal responsive
- ✅ **Filtrado y búsqueda** en tiempo real
- ✅ **Estadísticas** de conversión
- ✅ **Conversión a factura** directa

#### **2. Generación de Facturas (`/administracion/facturacion`)**

- ✅ **Formulario completo** de datos del cliente
- ✅ **Carga desde cotizaciones** existentes
- ✅ **Vista previa profesional** antes de generar
- ✅ **Plantilla de cotización/factura** con formato comercial
- ✅ **Función de impresión** integrada
- ✅ **Validación de datos** completa (incluyendo RUT chileno)

#### **3. Lista de Facturas (`/administracion/facturas`)**

- ✅ **Gestión completa** de facturas generadas
- ✅ **Doble vista**:
  - **Ver Detalles**: Información resumida
  - **Ver Factura**: Documento completo formateado
- ✅ **Búsqueda avanzada** por nombre, empresa, email
- ✅ **Filtros por estado** (borrador, pendiente, pagada, cancelada)
- ✅ **Impresión directa** desde la lista
- ✅ **Estados visuales** con badges de color

#### **4. Gestión de Bodega (`/administracion/bodega`)**

- ✅ **CRUD completo** de productos
- ✅ **Subida de imágenes** optimizada
- ✅ **Control de stock** en tiempo real
- ✅ **Búsqueda con normalización** de texto
- ✅ **Vista dual**: tabla (desktop) + cards (móvil)

### **📱 Navegación Móvil Optimizada**

- **Botón Flotante**: Acceso rápido en dispositivos móviles
- **Offcanvas Lateral**: Menú deslizante con animaciones
- **Estado Activo**: Resaltado visual de página actual
- **Información Usuario**: Contexto del admin logueado

---

## 📱 Integración WhatsApp

### **Implementación Sin APIs Externas**

```javascript
// URLs de WhatsApp nativas
const phoneNumber = "56987761691"; // Formato internacional
const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

// Manejo robusto multi-método
const handleWhatsAppClick = (e) => {
  e.preventDefault();

  // Método principal: createElement + click
  const link = document.createElement("a");
  link.href = whatsappURL;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Fallback para móviles
  setTimeout(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    ) {
      window.location.href = whatsappURL;
    }
  }, 100);
};
```

### **Compatibilidad Universal**

| Dispositivo      | Método           | Estado          |
| ---------------- | ---------------- | --------------- |
| iPhone (Safari)  | `https://wa.me/` | ✅ App nativa   |
| Android (Chrome) | `https://wa.me/` | ✅ App nativa   |
| Desktop (todos)  | `https://wa.me/` | ✅ WhatsApp Web |

---

## 🚀 Despliegue

### **GitHub Pages (Frontend)**

```bash
# Deploy automático configurado
npm run deploy

# Proceso automático:
# 1. npm run build → genera dist/
# 2. npx gh-pages -d dist → sube a gh-pages branch
# 3. GitHub Pages actualiza automáticamente
```

### **Scripts Disponibles**

#### **Frontend**

```bash
npm run dev          # Servidor de desarrollo Vite (port 5173)
npm run build        # Build de producción optimizado
npm run preview      # Preview del build local
npm run deploy       # Deploy automático a GitHub Pages
```

#### **Backend**

```bash
cd server
npm run dev          # Desarrollo con nodemon (auto-restart)
npm run start        # Producción (node server.js)
```

---

## 📱 Compatibilidad

### **Navegadores Soportados**

| Navegador | Versión | Desktop | Móvil | Estado   |
| --------- | ------- | ------- | ----- | -------- |
| Chrome    | 90+     | ✅      | ✅    | Completo |
| Firefox   | 88+     | ✅      | ✅    | Completo |
| Safari    | 14+     | ✅      | ✅    | Completo |
| Edge      | 90+     | ✅      | ✅    | Completo |

### **Dispositivos Móviles Testados**

- ✅ **iPhone 12/13/14/15** (todas las variantes)
- ✅ **Samsung Galaxy S20/S21/S22**
- ✅ **iPad Air/Pro** (layout tablet optimizado)
- ✅ **Android tablets** 10"+

### **Resoluciones Soportadas**

- ✅ **Mobile**: 320px - 767px
- ✅ **Tablet**: 768px - 991px
- ✅ **Desktop**: 992px - 1199px
- ✅ **Large**: 1200px+
- ✅ **4K**: 3840px+ (escalado automático)

---

## 🔗 Enlaces Importantes

### **Producción**

- 🌐 **Sitio Web**: <https://lagger-craft.github.io/PerimetrosMaitenrehue/>
- 📋 **Panel Admin**: <https://lagger-craft.github.io/PerimetrosMaitenrehue/administracion>
- 🧪 **Debug WhatsApp**: <https://lagger-craft.github.io/PerimetrosMaitenrehue/whatsapp-test>

### **Desarrollo**

- 🌐 **Frontend Local**: <http://localhost:5173>
- 🔧 **Backend Local**: <http://localhost:5000>
- 🗄️ **MongoDB Local**: mongodb://localhost:27017

### **Contacto**

- 📱 **WhatsApp**: [+56 9 8776 1691](https://wa.me/56987761691)
- 📧 **Email**: <info@perimetrosmaitenrehue.cl>
- 📍 **Ubicación**: Sur de Chile

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver archivo `LICENSE` para detalles.

---

<div align="center">

**Desarrollado con ❤️ para PerímetrosMaitenrehue**

[![GitHub Stars](https://img.shields.io/github/stars/Lagger-craft/PerimetrosMaitenrehue?style=social)](https://github.com/Lagger-craft/PerimetrosMaitenrehue/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Lagger-craft/PerimetrosMaitenrehue?style=social)](https://github.com/Lagger-craft/PerimetrosMaitenrehue/network/members)

**Versión 3.0** - Sistema de Facturación Profesional  
**Última actualización**: Enero 2025

[⬆️ Volver al inicio](#-perímetrosmaitenrehue---sitio-web-completo)

</div>

