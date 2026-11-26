import { useState } from 'react'
import { useNavigate, useLocation, Navigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Link,
  Typography,
  useTheme,
  Alert,
} from '@mui/material'
import { IconCheck } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
// Botón estándar del panel
import { Button } from '@shared/ui'
import { ROUTES } from '@app/router/routes'
import RecetaTabla from '../components/RecetaTabla'
import { filasHaciaApi } from '../components/receta/recetaUtils'
import { productosApi } from '../api/productosApi'

export default function AgregarRecetaPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const producto = location.state?.producto
  const productoId = location.state?.productoId ?? producto?.id

  const [insumos, setInsumos] = useState([])
  const [guardando, setGuardando] = useState(false)
  const [errorServidor, setErrorServidor] = useState(null)

  if (!productoId) {
    return <Navigate to={ROUTES.PRODUCTOS} replace />
  }

  const codigo = producto?.codigo ?? `PR-${productoId ?? '000'}`
  const nombre = producto?.nombre ?? 'Producto sin nombre'

  const handleAgregarInsumo = (nuevoInsumo) => {
    setInsumos((prev) => [...prev, nuevoInsumo])
  }

  const handleEditarInsumo = (id, datosActualizados) => {
    setInsumos((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...datosActualizados } : i))
    )
  }

  const handleEliminarInsumo = (id) => {
    setInsumos((prev) => prev.filter((i) => i.id !== id))
  }

  const handleOmitir = () => {
    navigate(ROUTES.PRODUCTOS)
  }

  const handleGuardar = async () => {
    if (guardando || insumos.length === 0) return
    setGuardando(true)
    setErrorServidor(null)
    try {
      await productosApi.actualizarProducto(productoId, { receta: filasHaciaApi(insumos) })
      navigate(ROUTES.PRODUCTOS)
    } catch (err) {
      setErrorServidor(err?.message || 'No se pudo guardar la receta')
      setGuardando(false)
    }
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
      <Box sx={{ maxWidth: 960, mx: 'auto', px: 2 }}>
        {/* Breadcrumb */}
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
            sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.secondary }}
          >
            /
          </Typography>
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
            Crear Producto
          </Link>
          <Typography
            component="span"
            sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.secondary }}
          >
            /
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 13,
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Agregar Receta
          </Typography>
        </Box>

        {/* Card de confirmación */}
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
            mb: 4,
          }}
        >
          <CardContent
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: 20,
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 0.5,
                }}
              >
                Producto creado con éxito
              </Typography>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: 13,
                  color: theme.palette.text.secondary,
                }}
              >
                Ahora agrega los insumos necesarios para elaborar este producto
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', minWidth: 180, flexShrink: 0 }}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: 12,
                  fontWeight: 700,
                  color: theme.palette.text.secondary,
                  letterSpacing: '0.04em',
                }}
              >
                {codigo}
              </Typography>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: 15,
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                {nombre}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Card Receta del Producto */}
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <RecetaTabla
              insumos={insumos}
              onAgregarInsumo={handleAgregarInsumo}
              onEditInsumo={handleEditarInsumo}
              onDeleteInsumo={handleEliminarInsumo}
              codigoProducto={codigo}
            />
          </CardContent>
        </Card>

        {errorServidor && (
          <Alert severity="error" onClose={() => setErrorServidor(null)}>
            {errorServidor}
          </Alert>
        )}

        {/* Botones finales */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1,
            mt: 3,
          }}
        >
          <Button variant="secondary" onClick={handleOmitir} disabled={guardando}>
            Omitir por ahora
          </Button>
          <Button
            leftIcon={<IconCheck size={16} />}
            onClick={handleGuardar}
            disabled={guardando || insumos.length === 0}
          >
            {guardando ? 'Guardando...' : 'Guardar Receta y Finalizar'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
