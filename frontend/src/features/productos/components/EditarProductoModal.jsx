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
import { filasDesdeApi, filasHaciaApi } from './receta/recetaUtils'
// Bloque de campos compartido por los formularios de producto
import CamposProducto from './formulario/CamposProducto'
// Hook de validación del formulario de producto
import { useValidacionProducto } from '../hooks/useValidacionProducto'

// Construye el estado inicial del formulario a partir del producto recibido
const construirFormulario = (producto) => ({
  nombre: producto?.nombre ?? '',
  categoria: producto?.categoria ?? '',
  // El tipo no se puede cambiar: se muestra bloqueado
  tipo: producto?.tipo ?? 'TERMINADO',
  esVendible: producto?.esVendible ?? true,
  // Un producto no vendible no tiene precio de venta
  precioVenta: producto?.esVendible === false ? '' : (producto?.precioVenta ?? ''),
  // El stock actual se muestra solo de lectura
  stockActual: producto?.stock ?? '',
  stockMinimo: producto?.stockMinimo ?? 0,
  cantMinimaProduccion: producto?.cantMinimaProduccion ?? '1',
  cantMaximaProduccion: producto?.cantMaximaProduccion ?? '100',
  imagen: producto?.imagenUrl ?? '',
  // Estado guardado (Activo/Inactivo). "Agotado" no es un estado guardado: se calcula por stock
  activo: producto ? producto.activo !== false : true,
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
  const [insumos, setInsumos] = useState(() => filasDesdeApi(producto?.receta))

  const handleAgregarInsumo = (nueva) => setInsumos((prev) => [...prev, nueva])
  const handleEditarInsumo = (id, datos) => setInsumos((prev) => prev.map((i) => (i.id === id ? { ...i, ...datos } : i)))
  const handleEliminarInsumo = (id) => setInsumos((prev) => prev.filter((i) => i.id !== id))

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
      const esVendible = formulario.tipo === 'TERMINADO' ? true : Boolean(formulario.esVendible)
      const datos = {
        ...formulario,
        esVendible,
        precioVenta: esVendible ? Number(formulario.precioVenta) || 0 : 0,
        stockActual: Number(formulario.stockActual) || 0,
        stockMinimo: Number(formulario.stockMinimo) || 0,
        cantMinimaProduccion: Number(formulario.cantMinimaProduccion) || 1,
        cantMaximaProduccion: Number(formulario.cantMaximaProduccion) || 1,
        id: producto?.id,
        codigo: producto?.codigo,
        receta: filasHaciaApi(insumos),
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
    setInsumos(filasDesdeApi(producto?.receta))
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
          modo="editar"
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
