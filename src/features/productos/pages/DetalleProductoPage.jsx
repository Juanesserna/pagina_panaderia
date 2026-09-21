import { useState } from 'react'
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Divider,
  Link,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  IconChevronDown,
  IconClock,
  IconInfoCircle,
  IconPackage,
} from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { ROUTES } from '@app/router/routes'
import EstadoBadge from '../components/EstadoBadge'
import RecetaTabla from '../components/RecetaTabla'
import { formatPrice, productos } from '../services/productos.service'

const cardSx = (theme) => ({
  borderRadius: 3,
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
})

const titleSx = {
  fontFamily: fonts.sans,
  fontSize: 16,
  fontWeight: 700,
  color: 'text.primary',
}

const iconContainerSx = (theme) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: 1,
  flexShrink: 0,
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  color: theme.palette.primary.main,
})

function Campo({ etiqueta, valor, destacado = false }) {
  const theme = useTheme()

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontSize: 10,
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: destacado ? theme.palette.primary.main : theme.palette.text.secondary,
        }}
      >
        {etiqueta}
      </Typography>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontSize: destacado ? 18 : 15,
          fontWeight: 700,
          lineHeight: 1.25,
          color: theme.palette.text.primary,
          mt: 0.4,
        }}
      >
        {valor}
      </Typography>
    </Box>
  )
}

function PanelCampo({ etiqueta, valor }) {
  const theme = useTheme()

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontSize: 10,
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: theme.palette.text.secondary,
        }}
      >
        {etiqueta}
      </Typography>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 1.3,
          color: theme.palette.text.primary,
          mt: 0.35,
        }}
      >
        {valor}
      </Typography>
    </Box>
  )
}

export default function DetalleProductoPage() {
  const theme = useTheme()
  const { id } = useParams()
  const location = useLocation()
  const [recetaAbierta, setRecetaAbierta] = useState(false)

  const productoUrl = productos.find((productoBuscado) => productoBuscado.id === Number(id))
  const productoEstado = location.state?.producto
  const producto = productoEstado ? { ...(productoUrl ?? {}), ...productoEstado } : productoUrl
  const precioVenta = Number(producto?.precioVenta)
  const precioVentaTexto = Number.isFinite(precioVenta) ? formatPrice(precioVenta) : '—'
  const stock = producto?.stock ?? 0
  const stockMinimo = producto?.stockMinimo ?? Math.max(5, Math.round(stock * 0.25))
  const cantMinimaProduccion = producto?.cantMinimaProduccion ?? 1
  const cantMaximaProduccion = producto?.cantMaximaProduccion ?? 100
  const unidad = producto?.unidad ?? 'uds.'
  const codigoProducto = producto?.codigo ?? '—'

  const insumos = Array.isArray(producto?.insumos) ? producto.insumos : [
    { id: 1, idProducto: codigoProducto, idInsumo: 'I-001', insumo: 'Harina de trigo', cantidad: 500, unidad: 'kg' },
    { id: 2, idProducto: codigoProducto, idInsumo: 'I-002', insumo: 'Mantequilla', cantidad: 200, unidad: 'kg' },
    { id: 3, idProducto: codigoProducto, idInsumo: 'I-003', insumo: 'Sal', cantidad: 10, unidad: 'kg' },
    { id: 4, idProducto: codigoProducto, idInsumo: 'I-004', insumo: 'Levadura', cantidad: 5, unidad: 'kg' },
    { id: 5, idProducto: codigoProducto, idInsumo: 'I-005', insumo: 'Agua', cantidad: 300, unidad: 'L' },
  ]

  const historial = Array.isArray(producto?.historial) ? producto.historial : [
    { id: 1, texto: 'Registro creado', autor: 'Admin AlHorno' },
    { id: 2, texto: `Estado: ${producto?.estado ?? 'Activo'}`, autor: 'Admin AlHorno' },
  ]

  const handleEditarInsumo = (insumo) => {
    console.log('Editar insumo', insumo)
  }

  const handleEliminarInsumo = (insumo) => {
    console.log('Eliminar insumo', insumo)
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        minHeight: '100vh',
        margin: '-16px',
        padding: '16px',
        width: 'calc(100% + 32px)',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 3, flexWrap: 'wrap' }}>
          <Link
            component={RouterLink}
            to={ROUTES.PRODUCTOS}
            underline="hover"
            sx={{
              fontFamily: fonts.sans,
              fontSize: 13,
              color: theme.palette.text.secondary,
              '&:hover': { color: theme.palette.primary.main },
            }}
          >
            Productos
          </Link>
          <Typography
            component="span"
            sx={{
              fontFamily: fonts.sans,
              fontSize: 13,
              color: theme.palette.text.secondary,
            }}
          >
            /
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 13,
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Detalle
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'flex-start',
            gap: 3,
          }}
        >
          <Box sx={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Card variant="outlined" sx={cardSx(theme)}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                  <Box sx={iconContainerSx(theme)}>
                    <IconInfoCircle size={16} />
                  </Box>
                  <Typography sx={titleSx}>Información General</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                    rowGap: 2.5,
                    columnGap: 3,
                  }}
                >
                  <Campo etiqueta="Código" valor={producto?.codigo ?? '—'} />
                  <Campo etiqueta="Nombre empresa" valor={producto?.nombre ?? '—'} destacado />
                  <Campo etiqueta="Categoría" valor={producto?.categoria ?? '—'} />
                  <Campo etiqueta="Precio venta" valor={precioVentaTexto} />
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={cardSx(theme)}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                  <Box sx={iconContainerSx(theme)}>
                    <IconPackage size={16} />
                  </Box>
                  <Typography sx={titleSx}>Información de Stock</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                    rowGap: 2.5,
                    columnGap: 3,
                  }}
                >
                  <Campo etiqueta="Stock actual" valor={`${stock} ${unidad}`} />
                  <Campo etiqueta="Stock mínimo" valor={`${stockMinimo} ${unidad}`} />
                  <Campo etiqueta="Cant. mínima producción" valor={cantMinimaProduccion} />
                  <Campo etiqueta="Cant. máxima producción" valor={cantMaximaProduccion} />
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={cardSx(theme)}>
              <Box
                component="button"
                type="button"
                aria-expanded={recetaAbierta}
                aria-controls="detalle-producto-receta"
                onClick={() => setRecetaAbierta((abierto) => !abierto)}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: 0,
                  backgroundColor: 'transparent',
                  px: 3,
                  py: 2.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: fonts.sans,
                  color: theme.palette.text.primary,
                  '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: -2 },
                }}
              >
                <Typography sx={titleSx}>Listar insumos receta</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    color: theme.palette.primary.main,
                    transform: recetaAbierta ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <IconChevronDown size={18} />
                </Box>
              </Box>

              <Collapse in={recetaAbierta} timeout="auto" unmountOnExit>
                <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
                  <RecetaTabla
                    insumos={insumos}
                    onAgregarInsumo={() => {}}
                    onEditInsumo={handleEditarInsumo}
                    onDeleteInsumo={handleEliminarInsumo}
                    mostrarEncabezado={false}
                    showActions={false}
                  />
                </CardContent>
              </Collapse>
            </Card>
          </Box>

          <Box
            sx={{
              flex: '0 0 320px',
              width: '100%',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            <Card variant="outlined" sx={cardSx(theme)}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={titleSx}>Estado</Typography>
                <Box sx={{ mt: 2 }}>
                  <EstadoBadge estado={producto?.estado ?? 'Activo'} />
                </Box>
                <Divider sx={{ my: 2.5 }} />
                <Stack spacing={2}>
                  <PanelCampo etiqueta="Código" valor={producto?.codigo ?? '—'} />
                  <PanelCampo etiqueta="Categoría" valor={producto?.categoria ?? '—'} />
                  <PanelCampo etiqueta="Stock" valor={`${stock} ${unidad}`} />
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={cardSx(theme)}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={iconContainerSx(theme)}>
                    <IconClock size={16} />
                  </Box>
                  <Typography sx={titleSx}>Historial</Typography>
                </Box>

                <Stack spacing={2} sx={{ mt: 2.5 }}>
                  {historial.map((evento) => (
                    <Box key={evento.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                      <Box
                        component="span"
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: theme.palette.success.main,
                          mt: 0.45,
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: fonts.sans,
                            fontSize: 13,
                            fontWeight: 700,
                            lineHeight: 1.3,
                            color: theme.palette.success.main,
                          }}
                        >
                          {evento.texto}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: fonts.sans,
                            fontSize: 11,
                            lineHeight: 1.3,
                            color: theme.palette.text.secondary,
                            mt: 0.2,
                          }}
                        >
                          {evento.autor}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
