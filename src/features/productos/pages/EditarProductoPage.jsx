import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import { Box, Card, CardContent, Link, Typography, useTheme } from '@mui/material'
import { IconPencil } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { ROUTES } from '@app/router/routes'
import ProductoForm from '../components/ProductoForm'
import RecetaTabla from '../components/RecetaTabla'
import { productos } from '../services/productos.service'

export default function EditarProductoPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { id } = useParams()

  const producto = productos.find((p) => p.id === Number(id))

  const initialValues = {
    nombre: producto?.nombre ?? '',
    categoria: producto?.categoria ?? '',
    precioVenta: producto?.precioVenta ?? '',
    stockActual: producto?.stock ?? '',
    stockMinimo: producto?.stock ?? 0,
    cantMinimaProduccion: '1',
    cantMaximaProduccion: '100',
    imagen: '',
    activo: producto?.estado === 'Activo',
  }

  const handleGuardar = (datos) => {
    console.log({ ...datos, id: producto?.id })
  }

  const handleCancelar = () => {
    navigate(ROUTES.PRODUCTOS)
  }

  const insumos = [
    { id: 1, idProducto: 'P-0001', idInsumo: 'I-001', insumo: 'Harina de trigo', cantidad: 500, unidad: 'kg' },
    { id: 2, idProducto: 'P-0001', idInsumo: 'I-002', insumo: 'Mantequilla', cantidad: 200, unidad: 'kg' },
    { id: 3, idProducto: 'P-0001', idInsumo: 'I-003', insumo: 'Sal', cantidad: 10, unidad: 'kg' },
    { id: 4, idProducto: 'P-0001', idInsumo: 'I-004', insumo: 'Levadura', cantidad: 5, unidad: 'kg' },
    { id: 5, idProducto: 'P-0001', idInsumo: 'I-005', insumo: 'Agua', cantidad: 300, unidad: 'L' },
  ]

  const handleEditInsumo = (insumo) => {
    console.log('Editar insumo', insumo)
  }

  const handleDeleteInsumo = (insumo) => {
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
            Editar
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
              Editar Producto
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: 13,
                color: theme.palette.text.secondary,
                mb: 3,
              }}
            >
              Modifica los campos del producto
            </Typography>

            <ProductoForm
              defaultValues={initialValues}
              onGuardar={handleGuardar}
              onCancelar={handleCancelar}
              saveLabel="Guardar Cambios"
              saveIcon={<IconPencil size={16} />}
            />
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
              onEditInsumo={handleEditInsumo}
              onDeleteInsumo={handleDeleteInsumo}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
