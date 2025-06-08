# 🛒 E-Commerce Platform

Una plataforma de comercio electrónico completa desarrollada como parte del **Desafío Web360** de OprimaTecnología. El proyecto implementa un sistema full-stack con funcionalidades de administración y gestión de ventas.

## 🚀 Características Principales

- **Sistema de Autenticación**: Login y registro con JWT
- **Gestión de Productos**: CRUD completo con categorías
- **📸 Subida de Imágenes**: Sistema completo de upload de imágenes con Cloudinary
- **Gestión de Clientes**: Administración de información de clientes
- **Sistema de Órdenes**: Creación y gestión de pedidos con detalles
- **Panel de Administración**: Interfaz completa para administradores
- **Estados Dinámicos**: Sistema de estados para productos, órdenes y usuarios
- **Base de Datos Robusta**: Implementación con SQL Server y procedimientos almacenados

## 🏗️ Arquitectura del Proyecto

```
📁 desafioweb/
├── 📁 desafiosql/              # Scripts de base de datos
│   └── GDA004-OT-DavidSian.sql # Creación de BD, tablas y procedimientos
├── 📁 packages/
│   ├── 📁 backend/             # API REST con Node.js + Express
│   │   ├── 📁 src/
│   │   │   ├── 📁 controllers/ # Lógica de negocio
│   │   │   ├── 📁 models/      # Modelos de datos
│   │   │   ├── 📁 routes/      # Definición de rutas
│   │   │   ├── 📁 middleware/  # Middlewares de autenticación
│   │   │   └── 📁 database/    # Configuración de BD
│   │   └── 📁 POSTMAN/         # Colecciones para testing
│   ├── 📁 frontend/            # Aplicación React con Vite
│   │   └── 📁 src/
│   │       ├── 📁 components/  # Componentes reutilizables
│   │       ├── 📁 pages/       # Páginas de la aplicación
│   │       ├── 📁 services/    # Servicios API
│   │       ├── 📁 context/     # Contextos de React
│   │       └── 📁 interfaces/  # Definiciones TypeScript
│   └── 📁 shared/              # Código compartido
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de construcción
- **Material-UI (MUI)** - Componentes de interfaz
- **CSS3** - Estilos personalizados

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **Cloudinary** - Gestión y almacenamiento de imágenes
- **Multer** - Middleware para manejo de archivos
- **TypeScript** - Tipado estático
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas

### Base de Datos
- **Microsoft SQL Server** - Base de datos principal
- **Procedimientos Almacenados** - Lógica de base de datos
- **Vistas** - Consultas optimizadas

## 📋 Funcionalidades

### Para Administradores
- ✅ Gestión completa de productos y categorías
- ✅ Administración de usuarios y clientes
- ✅ Aprobación y gestión de órdenes
- ✅ Control de estados del sistema
- ✅ Panel de administración intuitivo

### Para Clientes
- ✅ Navegación de productos por categorías
- ✅ Carrito de compras
- ✅ Proceso de checkout
- ✅ Historial de órdenes
- ✅ Gestión de perfil

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js >= 16.0.0
- npm >= 8.0.0
- SQL Server
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/AlejandroIMP/desafioweb-donarturo
cd desafioweb-donarturo
```

### 2. Instalar Dependencias
```bash
# Instalar dependencias del workspace
npm install
```

### 3. Configurar Base de Datos

#### Opción A: Base de Datos Mejorada (Recomendada)
1. Ejecuta el script SQL mejorado: [`desafiosql/GDA004-OT-DavidSian-IMPROVED.sql`](desafiosql/GDA004-OT-DavidSian-IMPROVED.sql)
2. Opcionalmente, ejecuta los procedimientos adicionales: [`desafiosql/GDA004-OT-DavidSian-PROCEDURES.sql`](desafiosql/GDA004-OT-DavidSian-PROCEDURES.sql)
3. Consulta la documentación completa: [`desafiosql/DATABASE_DOCUMENTATION.md`](desafiosql/DATABASE_DOCUMENTATION.md)

**Mejoras incluidas:**
- ✅ Nomenclatura estandarizada (snake_case)
- ✅ Sistema completo de auditoría y logging
- ✅ Validaciones de negocio en todos los procedimientos
- ✅ Índices para optimización de rendimiento
- ✅ Soft delete en lugar de eliminación física
- ✅ Parámetros con tipos explícitos
- ✅ Documentación completa de procedimientos
- ✅ Separación de responsabilidades

#### Opción B: Base de Datos Original
1. Ejecuta el script SQL original: [`desafiosql/GDA004-OT-DavidSian.sql`](desafiosql/GDA004-OT-DavidSian.sql)
2. Esto creará la base de datos, tablas, procedimientos y datos iniciales

### 4. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basado en [`.env.example`](.env.example):

```env
# Base de Datos
DB_USER=tu_usuario_sql
DB_PASSWORD=tu_contraseña_sql
DB_SERVER=localhost
DB_DATABASE=GDA004-OT-DavidSian

# Servidor
PORT=3000

# Autenticación
JWT_SECRET=tu_clave_secreta_jwt
```

### 5. Ejecutar el Proyecto

```bash
# Ejecutar solo el backend
npm run dev-back

# Ejecutar solo el frontend
npm run dev-front

# Ejecutar ambos servidores simultáneamente
npm run dev
```

## 📡 API Reference

El backend expone una API REST completa. Consulta la documentación detallada en [`packages/backend/README.md`](packages/backend/README.md).

### Endpoints Principales
- `POST /api/auth/login` - Autenticación de usuarios
- `POST /api/auth/register` - Registro de nuevos usuarios
- `GET /api/productos` - Obtener productos
- `POST /api/order` - Crear nueva orden
- `GET /api/productCategory` - Obtener categorías

### Testing con Postman
El proyecto incluye colecciones de Postman para testing en [`packages/backend/POSTMAN/`](packages/backend/POSTMAN/):
- Category CRUD
- Clientes CRUD
- Estados CRUD
- Login & Register
- Orden y Detalles CRUD
- Product CRUD

## 🎨 Frontend

La aplicación frontend está construida con React y ofrece:

### Layouts
- **LandingLayout** - Página de inicio
- **AuthLayout** - Autenticación
- **ClientLayout** - Interfaz de cliente
- **AdminLayout** - Panel de administración

### Componentes Principales
- Formularios de CRUD para todas las entidades
- Sistema de navegación adaptativo
- Carrito de compras interactivo
- Gestión de estados con Context API

Consulta más detalles en [`packages/frontend/README.md`](packages/frontend/README.md).

## 🗄️ Base de Datos

La base de datos incluye:

### Tablas Principales
- `usuarios` - Gestión de usuarios del sistema
- `Clientes` - Información de clientes
- `Productos` - Catálogo de productos
- `CategoriaProductos` - Categorías de productos
- `Orden` - Órdenes de compra
- `OrdenDetalles` - Detalles de productos por orden
- `estados` - Estados del sistema

### Procedimientos Almacenados
- CRUD completo para todas las entidades
- Validaciones de negocio
- Gestión de estados
- Operaciones de órdenes complejas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Alejandro IMP**
- GitHub: [@AlejandroIMP](https://github.com/AlejandroIMP)
- Proyecto: [desafioweb-donarturo](https://github.com/AlejandroIMP/desafioweb-donarturo)

---

Desarrollado con ❤️ como parte del Desafío Web360 de OprimaTecnología