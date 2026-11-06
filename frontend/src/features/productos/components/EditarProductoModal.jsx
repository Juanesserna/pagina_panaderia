import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Stack,
} from '@mui/material'
import { IconPencil } from '@tabler/icons-react'
// Botón estándar del panel
import { Button, Modal } from '@shared/ui'
import RecetaTabla from './RecetaTabla'
// Bloque de campos compartido por los formularios de producto
import CamposProducto from './formulario/CamposProducto'
// Hook de validación del formulario de producto
import { useValidacionProducto } from '../hooks/useValidacionProducto'

// Construye el estado inicial del formulario a partir del producto recibido
const construirFormulario = (producto) => ({
  // Nombre del producto, vacío si no hay producto
  nombre: producto?.nombre ?? '',
  // Categoría del producto, vacía si no hay producto
  categoria: producto?.categoria ?? '',
  // Precio de venta, vacío si no hay producto
  precioVenta: producto?.precioVenta ?? '',
  // Stock actual tomado del campo stock del producto
  stockActual: producto?.stock ?? '',
  // Stock mínimo guardado en el producto (0 si el producto aún no lo tiene)
  stockMinimo: producto?.stockMinimo ?? 0,
  // Cantidad mínima de producción guardada en el producto ('1' si no la tiene)
  cantMinimaProduccion: producto?.cantMinimaProduccion ?? '1',
  // Cantidad máxima de producción guardada en el producto ('100' si no la tiene)
  cantMaximaProduccion: producto?.cantMaximaProduccion ?? '100',
  // URL de la imagen, vacía si no hay producto
  imagen: producto?.imagenUrl ?? '',
  // Activo si el estado del producto es 'Activo'; true si no hay producto
  activo: producto ? producto.estado === 'Activo' : true,
})

export default function EditarProductoModal({
  open,
  onClose,
  onGuardar,
  producto,
}) {
  const theme = useTheme()
  const valoresIniciales = construirFormulario(producto)
  const {
    valores: formulario,
    cambiar,
    touched,
    tocar,
    validar,
    reiniciar,
  } = useValidacionProducto(valoresIniciales)
  const [errorServidor, setErrorServidor] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const handleChange = (campo) => (e) => {
    const { value } = e.target
    cambiar(campo, value)
    tocar(campo)
  }

  const handleNumber = (campo) => (e) => {
    const { value } = e.target
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      cambiar(campo, value)
    }
    tocar(campo)
  }

  const handleSwitch = (e, checked) => {
    cambiar('activo', checked ?? e.target.checked)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorServidor(null)
    const errores = validar()
    if (Object.keys(errores).length > 0) {
      Object.keys(formulario).forEach((campo) => tocar(campo))
      return
    }
    setGuardando(true)
    try {
      const datos = {
        ...formulario,
        precioVenta: Number(formulario.precioVenta) || 0,
        stockActual: Number(formulario.stockActual) || 0,
        stockMinimo: Number(formulario.stockMinimo) || 0,
        cantMinimaProduccion: Number(formulario.cantMinimaProduccion) || 0,
        cantMaximaProduccion: Number(formulario.cantMaximaProduccion) || 0,
        id: producto?.id,
        codigo: producto?.codigo,
      }
      await onGuardar(datos)
    } catch (err) {
      setErrorServidor(err.message || 'Error al guardar el producto')
    } finally {
      setGuardando(false)
    }
  }

  const handleClose = () => {
    reiniciar()
    setErrorServidor(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Editar Producto" size="lg" showDivider>
      <form onSubmit={handleSubmit}>
        {errorServidor && (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.error.main,
              mb: 2,
              backgroundColor: theme.palette.error.light,
              p: 1,
              borderRadius: 1,
            }}
          >
            {errorServidor}
          </Typography>
        )}
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            mb: 3,
          }}
        >
          Modifica los campos del producto
        </Typography>

        <CamposProducto
          formulario={formulario}
          handleChange={handleChange}
          handleNumber={handleNumber}
          handleSwitch={handleSwitch}
          errores={validar()}
          touched={touched}
          tocar={tocar}
        />

        {/* Receta del Producto */}
        <Box sx={{ mt: 4 }}>
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
                insumos={[]}
                onAgregarInsumo={() => {}}
                onEditInsumo={() => {}}
                onDeleteInsumo={() => {}}
                codigoProducto={producto?.codigo}
              />
            </CardContent>
          </Card>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', mt: 3 }}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            leftIcon={<IconPencil size={16} />}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
