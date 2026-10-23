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
  // El estado inicial se calcula una sola vez al montar el modal (con inicializador perezoso)
  const [formulario, setFormulario] = useState(() => construirFormulario(producto))
  const [insumos, setInsumos] = useState([
    { id: 1, idProducto: 'P-0001', idInsumo: 'I-001', insumo: 'Harina de trigo', cantidad: 500, unidad: 'kg' },
    { id: 2, idProducto: 'P-0001', idInsumo: 'I-002', insumo: 'Mantequilla', cantidad: 200, unidad: 'kg' },
    { id: 3, idProducto: 'P-0001', idInsumo: 'I-003', insumo: 'Sal', cantidad: 10, unidad: 'kg' },
    { id: 4, idProducto: 'P-0001', idInsumo: 'I-004', insumo: 'Levadura', cantidad: 5, unidad: 'kg' },
    { id: 5, idProducto: 'P-0001', idInsumo: 'I-005', insumo: 'Agua', cantidad: 300, unidad: 'L' },
  ])

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

  const handleChange = (campo) => (e) => {
    const { value } = e.target
    setFormulario((prev) => ({ ...prev, [campo]: value }))
  }

  const handleNumber = (campo) => (e) => {
    const { value } = e.target
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setFormulario((prev) => ({ ...prev, [campo]: value }))
    }
  }

  const handleSwitch = (e) => {
    setFormulario((prev) => ({ ...prev, activo: e.target.checked }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
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
    onGuardar(datos)
  }

  const handleClose = () => {
    // Ya no hace falta reiniciar el formulario: el modal se desmonta al cerrar
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Editar Producto" size="lg" showDivider>
      <form onSubmit={handleSubmit}>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            mb: 3,
          }}
        >
          Modifica los campos del producto
        </Typography>

        <CamposProducto formulario={formulario} handleChange={handleChange} handleNumber={handleNumber} handleSwitch={handleSwitch} />

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
                insumos={insumos}
                onAgregarInsumo={handleAgregarInsumo}
                onEditInsumo={handleEditarInsumo}
                onDeleteInsumo={handleEliminarInsumo}
                codigoProducto={producto?.codigo}
              />
            </CardContent>
          </Card>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', mt: 3 }}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" leftIcon={<IconPencil size={16} />}>
            Guardar Cambios
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
