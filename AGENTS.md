# AGENTS.md — Guía de Arquitectura, Convenciones y Restricciones

Este documento sirve como la **fuente de verdad técnica** para agentes de IA y desarrolladores que interactúen con el repositorio **Al Horno Panadería**. Define la arquitectura, convenciones estrictas de código, reglas de diseño y restricciones que deben respetarse en todo momento.

---

## 1. Visión General del Proyecto

**Al Horno** es una solución web integral para una panadería y pastelería artesanal, dividida en dos aplicaciones independientes:
* **`frontend/`**: Aplicación de página única (SPA) desarrollada con React 19, Vite y Material UI. Contiene tanto la plataforma pública (landing page, catálogo, carrito, consulta de pedidos) como el panel administrativo interno (dashboard, ventas, pedidos, compras, insumos, productos, producción, usuarios, roles, proveedores).
* **`backend/`**: API REST desacoplada desarrollada en Node.js con Express, organizada bajo principios de Arquitectura Limpia (Clean Architecture / DDD), autenticación JWT basada en roles y validación estricta de esquemas con Zod.

---

## 2. Estructura del Repositorio

El proyecto no utiliza un monorepo administrado por workspaces (Lerna/Turborepo); son dos carpetas autónomas con sus propios `package.json` y dependencias:

```text
pagina_panaderia/
├── AGENTS.md                 # Este archivo (guía para agentes y desarrolladores)
├── backend/                  # Servidor API REST (Node.js + Express)
│   ├── src/
│   │   ├── application/      # Casos de uso de negocio (Use Cases)
│   │   ├── domain/           # Entidades, errores, reglas puras y catálogos
│   │   ├── infrastructure/   # Repositorios (InMemory, DB), servicios JWT/Auth
│   │   ├── presentation/     # Rutas Express, esquemas Zod, middlewares, presenters
│   │   └── main/             # Composition root (container.js), app.js, config.js, server.js
│   ├── tests/                # Pruebas automatizadas con node:test y supertest
│   ├── .env.example          # Variables de entorno de referencia
│   └── package.json
└── frontend/                 # Aplicación cliente (React 19 + Vite)
    ├── src/
    │   ├── app/              # Router, configuración global y tema (theme, colors)
    │   ├── assets/           # Imágenes y recursos estáticos
    │   ├── features/         # Módulos de dominio/negocio (Feature-Driven Architecture)
    │   ├── layouts/          # Layouts globales (PublicLayout, MainLayout)
    │   └── shared/           # Componentes UI reutilizables (@shared/ui), notificaciones
    ├── vite.config.js        # Configuración de Vite y aliases de rutas
    ├── eslint.config.js      # Reglas estrictas de ESLint para el frontend
    └── package.json
```

---

## 3. Stack Tecnológico

### Frontend
* **Runtime & Bundler:** Node.js, Vite 8 (ESM nativo).
* **Framework:** React 19, React DOM 19.
* **Enrutamiento:** React Router DOM 7.
* **UI & Estilos:** Material UI (MUI v9), Emotion (`@emotion/react`, `@emotion/styled`).
* **Iconografía:** Tabler Icons React (`@tabler/icons-react`), Lucide React (`lucide-react`).
* **Gráficos:** Recharts.
* **Exportación & Documentos:** jsPDF, jspdf-autotable, SheetJS (`xlsx`).
* **Linter & Formateador:** ESLint 10 (con Flat Config y reglas personalizadas de sintaxis restringida).

### Backend
* **Runtime:** Node.js (>= 20).
* **Framework HTTP:** Express 4.
* **Seguridad:** Helmet, CORS, Express Rate Limit, bcryptjs (hashing de contraseñas).
* **Autenticación:** JSON Web Tokens (`jsonwebtoken`).
* **Validación:** Zod.
* **Base de Datos:** PostgreSQL con cliente `pg` (`Pool`). *Nota: actualmente la lógica de negocio opera con repositorios `InMemory` mientras se completa la migración de persistencia a BD.*
* **Testing:** Node.js Test Runner nativo (`node --test`), Supertest.

---

## 4. Arquitectura del Frontend (`frontend/`)

### 4.1. Arquitectura Basada en Módulos (Feature-Driven)
Cada módulo dentro de `src/features/<modulo>/` sigue obligatoriamente una estructura uniforme:

```text
features/<modulo>/
├── index.js                  # Exporta el punto de entrada (generalmente la Página principal)
├── pages/                    # SOLO orquesta la vista (conecta hooks + components). SIN lógica de negocio directa
├── components/               # Subcomponentes visuales específicos del módulo
├── hooks/                    # Hooks personalizados: estado local, filtros, operaciones, paginación
├── services/                 # Puerta de acceso a datos (abstrae API o Mocks; NUNCA importar mocks en componentes)
├── constants/                # Enums, catálogos fijos, opciones de select, PAGE_SIZE, filtros vacíos
├── mocks/                    # Datos temporales de prueba (se eliminan al conectar la API real)
└── utils/                    # Funciones puras: reglas de negocio, cálculos de dinero/fechas, ordenación, KPIs
```

### 4.2. Sistema de Diseño y UI (@shared/ui)
* **Única fuente de verdad para componentes base:**
  Todos los botones, inputs, modales, tablas y selectores deben importarse exclusivamente desde `@shared/ui`:
  ```javascript
  import { Button, Input, Select, Modal, DataTable, KPICard, KPIGrid, StatusBadge, Pagination, SearchInput } from '@shared/ui'
  ```
* **Prohibido duplicar componentes:** No crear copias locales de `Button`, `Input`, `Select`, `Modal`, etc., dentro de los módulos.
* **Componentes de diseño destacados:**
  * `KPIGrid` + `KPICard`: Contenedor y tarjetas para métricas e indicadores.
  * `SearchInput`: Buscador estándar con alto predeterminado.
  * `Button size="toolbar"`: Botón con la misma altura estandarizada que el buscador.
  * `StatusBadge`: Badges semánticos de estado (`variant="success" | "process" | "warning" | "danger"`).

### 4.3. Tema, Colores y Tipografía (`src/app/theme/`)

#### Reglas Estrictas de Color:
1. **PROHIBIDO escribir colores hexadecimales (`#hex`) o `rgba()` en `src/features/`.** ESLint emitirá advertencias/errores.
2. Los colores se especifican **siempre por nombre semántico del tema**:
   * Fondo general: `bgcolor: 'background.default'`
   * Fondo de tarjetas/modales: `bgcolor: 'background.paper'`
   * Fondo beige suave (campos, filas hover, chips): `bgcolor: 'background.alt'`
   * Líneas y bordes: `borderColor: 'divider'`
   * Texto principal: `color: 'text.primary'`
   * Texto secundario: `color: 'text.secondary'`
   * Texto tenue (contadores, placeholders): `color: 'text.dim'`
   * Color de marca / acento: `'primary.main'` (hover: `'primary.dark'`)
   * Estados: `'success.main'`, `'warning.main'`, `'error.main'`, `'info.main'`
   * Fondos transparentes con color: `bgcolor: (t) => alpha(t.palette.success.main, 0.12)` (`import { alpha } from '@mui/material/styles'`)
3. Si un color no existe, se agrega a `lightColors` y `darkColors` en `src/app/theme/colors.js` y se expone en `theme.js`.

#### Reglas Estrictas de Tipografía:
1. **PROHIBIDO escribir `fontSize`, `fontWeight`, `fontFamily`, `letterSpacing` o `lineHeight` a mano en `features/`.**
2. Se utilizan exclusivamente los **niveles de tipografía de Material UI** mediante `<Typography variant="...">` o `sx={{ typography: '...' }}`:
   * Título de página: `h4` (28px serif automático)
   * Título de sección: `h5` (18px)
   * Título de modal o panel: `h6` (16px)
   * Texto de lectura principal: `body1` (13px)
   * Texto secundario / apoyo: `body2` (12px)
   * Ayudas, fechas, texto pequeño: `caption` (11px)
   * Encabezados de tabla, etiquetas, KPIs: `overline` (11px mayúsculas)
   * Cifra grande de KPI: `metric` (22px bold)
   * Identificadores, IDs, códigos (#101, LOTE-X): `mono` (12px monospace)

### 4.4. Enrutamiento y Layouts (`src/app/router/`)
* **`routes.js`**: Única fuente de verdad de rutas (`ROUTES.LANDING`, `ROUTES.VENTAS`, `ROUTES.PEDIDOS`, etc.).
* **`PublicLayout`**: Layout para vistas externas (`/`, `/catalogo`, `/checkout`, `/mis-pedidos`, `/licencias`). Incluye `Navbar`, `CartDrawer` y `Footer`.
* **`MainLayout`**: Layout para el panel de administración protegido. Incluye `Sidebar` y `Header`.
* **`ProtectedRoute`**: Middleware de protección que valida sesión y roles.

---

## 5. Arquitectura del Backend (`backend/`)

El backend sigue una **Arquitectura Limpia / Hexagonal (Clean Architecture & DDD)** estricta, desacoplando el dominio de la infraestructura y de los frameworks web.

### 5.1. Capas Arquitectónicas

1. **`domain/` (Capa de Dominio - Núcleo puro)**
   * Contiene entidades ricas (`Producto.js`, `Pedido.js`, `Venta.js`), catálogos y constantes.
   * Contiene errores de dominio puros (`errors.js`: `ValidationError`, `NotFoundError`, `AuthError`, `ForbiddenError`, `TransicionInvalidaError`).
   * **Regla:** Cero dependencias externas o de base de datos en esta capa.

2. **`application/` (Capa de Aplicación - Casos de Uso)**
   * Clases con un método único `execute(...)` que orquestan el negocio (ej. `CrearPedido.js`, `ListarProductos.js`, `RegistrarAbono.js`, `Login.js`).
   * Reciben repositorios e interfaces inyectados en su constructor.

3. **`infrastructure/` (Capa de Infraestructura - Adaptadores)**
   * Implementaciones concretas de almacenamiento:
     * `InMemoryUsuarioRepository.js`, `InMemoryVentaRepository.js`, `InMemoryPedidoRepository.js`, `productoRepositoryInMemory.js`.
     * `database/db.js`: Pool de PostgreSQL (`pg.Pool`) configurado para `DATABASE_URL`.
   * Implementaciones de servicios de autenticación (`JwtTokenService.js` con HMAC-SHA256).

4. **`presentation/` (Capa de Presentación - HTTP / Express)**
   * Enrutadores Express (`pedidos.routes.js`, `ventas.routes.js`, `productos.routes.js`, `auth.routes.js`).
   * Middleware de validación con Zod (`validar.js`): valida `body`, `query` o `params`.
   * Middleware de autenticación y autorización (`auth.middleware.js`):
     * `requireAuth(tokenService)`: Exige token `Bearer <token>`.
     * `requireRol('admin', 'vendedor')`: Restringe accesos según el rol.
   * Presenters (`pedidoPresenter.js`, `ventaPresenter.js`): serializan entidades hacia respuestas JSON estándar.
   * Manejador centralizado de errores (`errorHandler.js`).

5. **`main/` (Composition Root)**
   * `container.js`: Instancia todas las dependencias y las inyecta en los casos de uso (`buildContainer()`). Permite inyectar mocks/overrides para pruebas unitarias e integración.
   * `config.js`: Valida y expone variables de entorno parseadas con Zod.
   * `app.js`: Configura Express, middlewares globales (Helmet, CORS, Rate Limit) y monta las rutas.
   * `server.js`: Levanta el servidor HTTP en el puerto configurado (default: 3000).

---

## 6. Convenciones de Código

### 6.1. Aliases en Frontend
Utilizar siempre los aliases configurados en `vite.config.js`:
* `@app` → `src/app`
* `@features` → `src/features`
* `@shared` → `src/shared`
* `@layouts` → `src/layouts`
* `@assets` → `src/assets`
* `@styles` → `src/styles`

*Ejemplo:*
```javascript
import { ROUTES } from '@app/router/routes'
import { Button, Modal } from '@shared/ui'
import { estadoVariant } from '../constants/pedidos.constants'
```

### 6.2. Manejo de Dinero y Fechas
* **Dinero:** Se almacena y opera como número puro entero o flotante (`45000`). En la vista se formatea exclusivamente mediante funciones helper de dominio (`formatearMoneda(valor)` o `formatPrice(valor)` en `es-CO`, ej: `$45.000`).
* **Fechas:** Se manipulan con objetos nativos `Date` o cadenas ISO / `dd/mm/yyyy` mediante las funciones puras en `utils/`.

### 6.3. Formularios en Modales
* Los formularios dentro de modales deben montarse/desmontarse de forma limpia utilizando hooks dedicados (ej. `useNuevaCompraForm`, `useNuevoPedido`). Esto previene estados residuales al cerrar y reabrir.

---

## 7. Restricciones Críticas (DOs y DONTs)

### Para el Frontend
* ❌ **NO usar `sx` para pasar dimensiones a componentes de `@shared/ui`.** Usar props (`size`, `variant`, `fullWidth`) o envolver con un `<Box sx={{ width: ... }}>`.
* ❌ **NO definir colores con `#hex` o `rgba()` en `src/features/`.**
* ❌ **NO usar estilos tipográficos sueltos (`fontSize`, `fontWeight`, etc.).** Usar siempre variantes de `<Typography>`.
* ❌ **NO importar directamente archivos de `mocks/` dentro de componentes o páginas.** El acceso a datos debe pasar por la capa `services/` o `api/`.
* ❌ **NO escribir lógica de negocio en componentes de vista (`pages/` o `components/`).** Extraer cálculos y validaciones a `utils/` o `hooks/`.
* ❌ **NO olvidar actualizar el modo claro Y el modo oscuro** si se agregan nuevos tokens de color en `colors.js`.

### Para el Backend
* ❌ **NO acoplar las entidades de dominio a librerías externas o bases de datos.** La capa `domain/` debe ser agnóstica.
* ❌ **NO omitir validaciones de entrada.** Todo endpoint con payload debe validarse con esquemas Zod en `presentation/http/schemas/`.
* ❌ **NO exponer detalles internos de la base de datos o stack traces en producción.** Utilizar siempre `errorHandler.js` y códigos de error semánticos (`VALIDATION_ERROR`, `NOT_FOUND`, `FORBIDDEN`, etc.).
* ❌ **NO instanciar dependencias dentro de los casos de uso.** Todas las dependencias (repositorios, servicios) deben inyectarse a través del constructor y resolverse en `container.js`.

---

## 8. Comandos de Trabajo

### Frontend (`frontend/`)
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (Vite)
npm run dev

# Compilar para producción
npm run build

# Validar linting y reglas estrictas de código
npm run lint

# Previsualizar build de producción
npm run preview
```

### Backend (`backend/`)
```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo con recarga automática
npm run dev

# Iniciar servidor en producción
npm run start

# Ejecutar pruebas automatizadas
npm test

# Ejecutar linter
npm run lint

# Formatear código con Prettier
npm run format
```

---

## 9. Roles y Permisos del Sistema

El sistema implementa control de acceso basado en roles (RBAC):
* **`admin` / Gerente:** Acceso completo y auditoría en todos los módulos (Dashboard, Productos, Ventas, Pedidos, Compras, Insumos, Producción, Usuarios, Roles, Proveedores). Capacidad de anular pedidos.
* **`vendedor`:** Acceso a Dashboard, Ventas, Pedidos (creación, abonos, actualización de estados operativos) y consulta de Productos.
* **`panadero`:** Orientado a órdenes de Producción, Recetas e Insumos.
* **`cliente`:** Interacción en la plataforma pública (Catálogo, Checkout, consulta de "Mis pedidos").
