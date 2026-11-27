// src/features/landing/pages/LicenciasPage.jsx
import { useState, useMemo } from 'react'
import { useOutletContext, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  Grid,
  Stack,
  Divider,
} from '@mui/material'
import {
  IconSearch,
  IconArrowLeft,
  IconShieldCheck,
  IconCode,
  IconScale,
  IconCheck,
  IconFileText,
  IconServer,
  IconDatabase,
  IconBrowser,
} from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { ROUTES } from '@app/router/routes'

const LICENCIAS_DATA = [
  // PROPIETARIA
  {
    nombre: 'Al Horno - Plataforma Panadería',
    tipo: 'Proyecto Completo (Frontend & Backend)',
    categoria: 'Propietaria',
    licencia: 'Propietaria / Privada',
    ambito: 'Plataforma',
    descripcion: 'Código fuente, reglas de negocio, diseño de interfaces y componentes propios desarrollados para la panadería Al Horno.',
    permisos: 'Todos los derechos reservados. Uso exclusivo institucional y comercial del proyecto.',
  },
  // RUNTIME & DATABASE
  {
    nombre: 'Node.js',
    tipo: 'Entorno de Ejecución JavaScript',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Runtime',
    descripcion: 'Motor en tiempo de ejecución para el servidor backend, ejecución de scripts y herramientas de construcción.',
    permisos: 'Uso comercial libre, modificación y distribución sin regalías.',
  },
  {
    nombre: 'PostgreSQL',
    tipo: 'Sistema Gestor de Base de Datos',
    categoria: 'PostgreSQL',
    licencia: 'PostgreSQL License',
    ambito: 'Base de Datos',
    descripcion: 'Base de datos relacional para la persistencia transaccional y catálogo de productos, clientes y compras.',
    permisos: 'Licencia abierta liberal compatible con uso comercial y privativo.',
  },
  // BACKEND DEPENDENCIES
  {
    nombre: 'Express.js',
    tipo: 'Framework Backend HTTP',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Backend',
    descripcion: 'Enrutamiento, controladores y middlewares de la API REST del backend.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'pg (node-postgres)',
    tipo: 'Driver / Conector PostgreSQL',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Backend',
    descripcion: 'Gestión del pool de conexiones y ejecución de consultas SQL a PostgreSQL.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'Zod',
    tipo: 'Validación de Esquemas y Tipos',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Backend',
    descripcion: 'Validación estricta de esquemas de datos en los payloads y parámetros HTTP entrantes.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'jsonwebtoken (JWT)',
    tipo: 'Autenticación & Seguridad',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Backend',
    descripcion: 'Generación, firma criptográfica y verificación de tokens de sesión para usuarios y roles.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'bcryptjs',
    tipo: 'Criptografía y Hashing',
    categoria: 'BSD',
    licencia: 'BSD-3-Clause',
    ambito: 'Backend',
    descripcion: 'Hashing seguro y salt de contraseñas de usuarios administradores, vendedores y clientes.',
    permisos: 'Permisiva con cláusula de preservación de aviso de derechos.',
  },
  {
    nombre: 'dotenv',
    tipo: 'Configuración y Variables de Entorno',
    categoria: 'BSD',
    licencia: 'BSD-2-Clause',
    ambito: 'Backend',
    descripcion: 'Carga segura de variables de configuración sensibles (.env) en el servidor.',
    permisos: 'Permisiva simplificada de 2 cláusulas.',
  },
  {
    nombre: 'Helmet',
    tipo: 'Seguridad en Encabezados HTTP',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Backend',
    descripcion: 'Protección contra vulnerabilidades web mediante la configuración adecuada de headers HTTP.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'CORS',
    tipo: 'Middleware de Seguridad Cross-Origin',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Backend',
    descripcion: 'Habilitación y restricción controlada de peticiones cross-origin entre frontend y backend.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'express-rate-limit',
    tipo: 'Protección y Control de Tasa',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Backend',
    descripcion: 'Prevención de ataques de fuerza bruta y saturación limitando peticiones recurrentes.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  // FRONTEND DEPENDENCIES
  {
    nombre: 'React 19 & React DOM',
    tipo: 'Biblioteca UI Declarativa',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Frontend',
    descripcion: 'Librería base para la arquitectura de componentes reactivos y gestión del Virtual DOM.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'React Router DOM 7',
    tipo: 'Enrutamiento del Cliente (SPA)',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Frontend',
    descripcion: 'Navegación fluida entre páginas públicas y rutas protegidas del panel administrativo.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'Material UI (MUI v9)',
    tipo: 'Sistema de Componentes de Diseño',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Frontend',
    descripcion: 'Componentes de interfaz accesibles, botones, modales, tablas y sistema de temas.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'Emotion (@emotion/react & styled)',
    tipo: 'Motor de Estilos CSS-in-JS',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Frontend',
    descripcion: 'Generación dinámica de estilos y soporte para temas claro y oscuro.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'Tabler Icons React',
    tipo: 'Librería de Iconos Vectoriales',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Frontend',
    descripcion: 'Iconografía consistente en alta resolución para navegación, estados y formularios.',
    permisos: 'Permisiva: uso comercial libre.',
  },
  {
    nombre: 'Lucide React',
    tipo: 'Librería Complementaria de Iconos',
    categoria: 'ISC',
    licencia: 'ISC License',
    ambito: 'Frontend',
    descripcion: 'Conjunto de iconos vectoriales ligeros para módulos auxiliares.',
    permisos: 'Permisiva (equivalente a MIT): uso comercial libre.',
  },
  {
    nombre: 'Recharts',
    tipo: 'Gráficos y Visualización de Datos',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Frontend',
    descripcion: 'Renderizado interactivo de estadísticas de ventas, pedidos e indicadores KPI.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'SheetJS (xlsx v0.18.5)',
    tipo: 'Procesamiento de Hojas de Cálculo',
    categoria: 'Apache-2.0',
    licencia: 'Apache-2.0',
    ambito: 'Frontend',
    descripcion: 'Exportación y generación de reportes tabulares compatibles con Microsoft Excel.',
    permisos: 'Permisiva con concesión explícita de patentes y uso comercial.',
  },
  {
    nombre: 'jsPDF & jspdf-autotable',
    tipo: 'Generación de Documentos PDF',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Frontend',
    descripcion: 'Creación e impresión en el navegador de comprobantes de venta y tickets de pedidos.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  // BUILD TOOLS
  {
    nombre: 'Vite',
    tipo: 'Empaquetador y Servidor de Desarrollo',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Herramientas',
    descripcion: 'Herramienta de compilación ultrarrápida (ESM nativo) y optimización de bundles para producción.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'ESLint & Prettier',
    tipo: 'Linters y Formateadores de Código',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Herramientas',
    descripcion: 'Control estricto de calidad de código, estándares sintácticos y buenas prácticas.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
  {
    nombre: 'Supertest',
    tipo: 'Suite de Pruebas de Integración HTTP',
    categoria: 'MIT',
    licencia: 'MIT License',
    ambito: 'Herramientas',
    descripcion: 'Ejecución automatizada de pruebas sobre endpoints y middlewares del servidor.',
    permisos: 'Permisiva: uso comercial, modificación y distribución.',
  },
]

const CATEGORIAS_FILTRO = ['Todas', 'MIT', 'BSD', 'Apache-2.0', 'ISC', 'PostgreSQL', 'Propietaria']

const colorLicencia = (cat) => {
  switch (cat) {
    case 'MIT':
      return { bg: 'rgba(46, 125, 50, 0.12)', color: '#2e7d32', border: 'rgba(46, 125, 50, 0.3)' }
    case 'BSD':
      return { bg: 'rgba(2, 136, 209, 0.12)', color: '#0288d1', border: 'rgba(2, 136, 209, 0.3)' }
    case 'Apache-2.0':
      return { bg: 'rgba(237, 108, 2, 0.12)', color: '#ed6c02', border: 'rgba(237, 108, 2, 0.3)' }
    case 'ISC':
      return { bg: 'rgba(156, 39, 176, 0.12)', color: '#9c27b0', border: 'rgba(156, 39, 176, 0.3)' }
    case 'PostgreSQL':
      return { bg: 'rgba(51, 103, 145, 0.15)', color: '#336791', border: 'rgba(51, 103, 145, 0.4)' }
    default:
      return { bg: 'rgba(192, 133, 82, 0.15)', color: '#C08552', border: 'rgba(192, 133, 82, 0.35)' }
  }
}

const iconoAmbito = (ambito) => {
  switch (ambito) {
    case 'Backend':
      return <IconServer size={14} />
    case 'Base de Datos':
      return <IconDatabase size={14} />
    case 'Frontend':
      return <IconBrowser size={14} />
    case 'Runtime':
    case 'Herramientas':
      return <IconCode size={14} />
    default:
      return <IconFileText size={14} />
  }
}

export default function LicenciasPage() {
  const { isDark } = useOutletContext() || { isDark: false }
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')

  const herramientasFiltradas = useMemo(() => {
    return LICENCIAS_DATA.filter((item) => {
      const coincideCat = categoriaSeleccionada === 'Todas' || item.categoria === categoriaSeleccionada
      const q = busqueda.toLowerCase().trim()
      const coincideTexto =
        !q ||
        item.nombre.toLowerCase().includes(q) ||
        item.tipo.toLowerCase().includes(q) ||
        item.licencia.toLowerCase().includes(q) ||
        item.ambito.toLowerCase().includes(q)
      return coincideCat && coincideTexto
    })
  }, [categoriaSeleccionada, busqueda])

  const bgPrincipal = isDark ? '#150a03' : '#F7F0E6'
  const cardBg = isDark ? '#241209' : '#FFFFFF'
  const cardBorder = isDark ? 'rgba(192,133,82,0.2)' : '#E8DDD0'
  const textTitle = isDark ? '#F3E9DC' : '#2E1810'
  const textMuted = isDark ? 'rgba(243,233,220,0.6)' : '#6B544B'
  const accentColor = '#C08552'

  return (
    <Box
      component="section"
      sx={{
        bgcolor: bgPrincipal,
        pt: { xs: 12, md: 15 },
        pb: { xs: 8, md: 12 },
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Botón Volver */}
        <Box sx={{ mb: 3 }}>
          <Button
            component={RouterLink}
            to={ROUTES.LANDING}
            startIcon={<IconArrowLeft size={16} />}
            sx={{
              color: accentColor,
              textTransform: 'none',
              fontFamily: fonts.sans,
              fontSize: 13,
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              '&:hover': { bgcolor: 'rgba(192,133,82,0.1)' },
            }}
          >
            Volver al inicio
          </Button>
        </Box>

        {/* Encabezado */}
        <Box sx={{ mb: 5 }}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: accentColor,
              mb: 1.5,
            }}
          >
            Transparencia & Tecnologías
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: fonts.serif,
              fontSize: { xs: 34, md: 46 },
              fontWeight: 400,
              color: textTitle,
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Herramientas y Licencias de Software
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: { xs: 14, md: 15.5 },
              color: textMuted,
              maxWidth: 820,
              lineHeight: 1.7,
            }}
          >
            La plataforma de panadería <b>Al Horno</b> fue construida sobre tecnologías sólidas y librerías de código abierto de clase mundial.
            Reconocemos y agradecemos a los desarrolladores y comunidades de software libre por sus aportes. A continuación se detalla el marco legal y licenciamiento de cada herramienta empleada.
          </Typography>
        </Box>

        {/* Tarjetas de Resumen / KPIs de Licenciamiento */}
        <Grid container spacing={2.5} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: cardBg,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: cardBorder,
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1, color: '#2e7d32' }}>
                <IconShieldCheck size={22} />
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                  Compatibilidad
                </Typography>
              </Stack>
              <Typography sx={{ fontFamily: fonts.serif, fontSize: 28, fontWeight: 500, color: textTitle }}>
                100% Permisivo
              </Typography>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 12, color: textMuted, mt: 0.5 }}>
                Apto para uso comercial y privativo sin conflictos
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: cardBg,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: cardBorder,
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1, color: accentColor }}>
                <IconScale size={22} />
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                  Sin Copyleft
                </Typography>
              </Stack>
              <Typography sx={{ fontFamily: fonts.serif, fontSize: 28, fontWeight: 500, color: textTitle }}>
                0 Licencias GPL
              </Typography>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 12, color: textMuted, mt: 0.5 }}>
                El código del negocio se preserva seguro y privado
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: cardBg,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: cardBorder,
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1, color: '#0288d1' }}>
                <IconCode size={22} />
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                  Ecosistema
                </Typography>
              </Stack>
              <Typography sx={{ fontFamily: fonts.serif, fontSize: 28, fontWeight: 500, color: textTitle }}>
                24+ Módulos
              </Typography>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 12, color: textMuted, mt: 0.5 }}>
                Auditados exhaustivamente en frontend y backend
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: cardBg,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: cardBorder,
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1, color: '#ed6c02' }}>
                <IconCheck size={22} />
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                  Estándares
                </Typography>
              </Stack>
              <Typography sx={{ fontFamily: fonts.serif, fontSize: 28, fontWeight: 500, color: textTitle }}>
                6 Licencias
              </Typography>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 12, color: textMuted, mt: 0.5 }}>
                MIT, BSD-3, BSD-2, Apache 2.0, ISC y PostgreSQL
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Filtros por Categoría y Buscador */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          {/* Píldoras de Licencias */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {CATEGORIAS_FILTRO.map((cat) => {
              const activo = categoriaSeleccionada === cat
              return (
                <Button
                  key={cat}
                  onClick={() => setCategoriaSeleccionada(cat)}
                  sx={{
                    px: 2,
                    py: 0.65,
                    fontSize: 12.5,
                    fontFamily: fonts.sans,
                    fontWeight: activo ? 600 : 400,
                    textTransform: 'none',
                    borderRadius: '999px',
                    border: '1px solid',
                    borderColor: activo ? accentColor : cardBorder,
                    bgcolor: activo ? accentColor : cardBg,
                    color: activo ? '#FAF5EE' : textTitle,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: activo ? accentColor : 'rgba(192,133,82,0.1)',
                      borderColor: accentColor,
                    },
                  }}
                >
                  {cat}
                </Button>
              )
            })}
          </Box>

          {/* Input de Búsqueda */}
          <Box sx={{ minWidth: { xs: '100%', md: 300 } }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Buscar herramienta (ej: React, Zod, Excel)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={16} color={accentColor} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: cardBg,
                  borderRadius: '999px',
                  fontFamily: fonts.sans,
                  fontSize: 13,
                  color: textTitle,
                  '& fieldset': { borderColor: cardBorder },
                  '&:hover fieldset': { borderColor: accentColor },
                  '&.Mui-focused fieldset': { borderColor: accentColor },
                },
              }}
            />
          </Box>
        </Box>

        {/* Grid de Herramientas y Licencias */}
        {herramientasFiltradas.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              bgcolor: cardBg,
              borderRadius: 3,
              border: '1px dashed',
              borderColor: cardBorder,
            }}
          >
            <Typography sx={{ fontFamily: fonts.serif, fontSize: 20, color: textTitle, mb: 1 }}>
              No se encontraron herramientas
            </Typography>
            <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: textMuted }}>
              Prueba buscando con otro término o seleccionando "Todas" en los filtros.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {herramientasFiltradas.map((item) => {
              const chipEstilo = colorLicencia(item.categoria)
              return (
                <Grid item xs={12} sm={6} md={4} key={item.nombre}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: cardBg,
                      borderRadius: 2.5,
                      border: '1px solid',
                      borderColor: cardBorder,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                        borderColor: accentColor,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.75, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Cabecera de la tarjeta: Ámbito y Licencia */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Chip
                          icon={iconoAmbito(item.ambito)}
                          label={item.ambito}
                          size="small"
                          sx={{
                            fontFamily: fonts.sans,
                            fontSize: 11,
                            fontWeight: 500,
                            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                            color: textMuted,
                            border: '1px solid',
                            borderColor: cardBorder,
                          }}
                        />
                        <Chip
                          label={item.licencia}
                          size="small"
                          sx={{
                            fontFamily: fonts.sans,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor: chipEstilo.bg,
                            color: chipEstilo.color,
                            border: `1px solid ${chipEstilo.border}`,
                          }}
                        />
                      </Stack>

                      {/* Nombre y Tipo */}
                      <Typography
                        sx={{
                          fontFamily: fonts.serif,
                          fontSize: 20,
                          fontWeight: 600,
                          color: textTitle,
                          mb: 0.5,
                        }}
                      >
                        {item.nombre}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontSize: 12,
                          fontWeight: 500,
                          color: accentColor,
                          mb: 1.75,
                        }}
                      >
                        {item.tipo}
                      </Typography>

                      {/* Descripción */}
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontSize: 13,
                          lineHeight: 1.6,
                          color: textMuted,
                          mb: 2.5,
                          flex: 1,
                        }}
                      >
                        {item.descripcion}
                      </Typography>

                      <Divider sx={{ my: 1.5, borderColor: cardBorder }} />

                      {/* Términos de la Licencia */}
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontSize: 11.5,
                          color: isDark ? 'rgba(243,233,220,0.5)' : '#7C675D',
                          fontStyle: 'italic',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                        }}
                      >
                        <IconCheck size={14} color={chipEstilo.color} style={{ flexShrink: 0 }} />
                        {item.permisos}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}

        {/* Sección Explicativa del Marco Legal */}
        <Box
          sx={{
            mt: 8,
            p: { xs: 3, md: 4.5 },
            borderRadius: 3,
            bgcolor: cardBg,
            border: '1px solid',
            borderColor: cardBorder,
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.serif,
              fontSize: 24,
              fontWeight: 500,
              color: textTitle,
              mb: 2,
            }}
          >
            Glosario de Licenciamiento Empleado
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 13.5,
              color: textMuted,
              lineHeight: 1.7,
              mb: 3,
            }}
          >
            A continuación se sintetiza el significado de cada modelo de licenciamiento presente en esta aplicación:
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 700, color: '#2e7d32', mb: 0.5 }}>
                  Licencia MIT
                </Typography>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 12.5, color: textMuted, lineHeight: 1.6 }}>
                  Licencia sumamente permisiva y el estándar de la industria JavaScript. Otorga derecho a usar, copiar, modificar, fusionar, publicar, distribuir y comercializar sin restricciones, requiriendo únicamente conservar el aviso de copyright original.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 700, color: '#0288d1', mb: 0.5 }}>
                  Licencias BSD (2 y 3 Cláusulas)
                </Typography>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 12.5, color: textMuted, lineHeight: 1.6 }}>
                  Familia de licencias permisivas con requisitos mínimos de retención de avisos de derechos de autor. La versión de 3 cláusulas añade protección expresa para evitar el uso del nombre del autor con fines publicitarios sin autorización previa.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 700, color: '#ed6c02', mb: 0.5 }}>
                  Licencia Apache 2.0
                </Typography>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 12.5, color: textMuted, lineHeight: 1.6 }}>
                  Licencia de código abierto permisiva que, además de permitir la libre modificación y comercialización, otorga una concesión expresa de patentes a los usuarios y previene disputas por propiedad intelectual.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 700, color: '#336791', mb: 0.5 }}>
                  Licencia PostgreSQL
                </Typography>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 12.5, color: textMuted, lineHeight: 1.6 }}>
                  Licencia libre similar a BSD y MIT creada por el PostgreSQL Global Development Group. Permite la integración y uso comercial del motor y sus conectores en soluciones propietarias y empresariales.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
