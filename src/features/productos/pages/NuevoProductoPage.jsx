import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { Box, Card, CardContent, Link, Typography, useTheme } from '@mui/material'
import { fonts } from '@app/theme/colors'
import { ROUTES } from '@app/router/routes'
import ProductoForm from '../components/ProductoForm'

export default function NuevoProductoPage() {
  const theme = useTheme()
  const navigate = useNavigate()

  const handleGuardar = (datos) => {
    const producto = {
      ...datos,
      id: datos.id ?? Date.now(),
      codigo: datos.codigo ?? `PR-${Math.floor(Math.random() * 900) + 100}`,
    }
    navigate(ROUTES.AGREGAR_RECETA, { state: { producto } })
  }

  const handleCancelar = () => {
    navigate(ROUTES.PRODUCTOS)
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
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Nuevo Producto
          </Typography>
        </Box>

        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: 22,
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              Nuevo Producto
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: 13,
                color: theme.palette.text.secondary,
                mb: 3,
              }}
            >
              Completa los campos para registrar un nuevo producto
            </Typography>

            <ProductoForm onGuardar={handleGuardar} onCancelar={handleCancelar} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
