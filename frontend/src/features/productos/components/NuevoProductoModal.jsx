import { useState } from 'react'
import {
  Typography,
  useTheme,
  Stack,
} from '@mui/material'
import { IconCheck } from '@tabler/icons-react'
// Botón estándar del panel
import { Button, Modal } from '@shared/ui'
// Bloque de campos compartido por los formularios de producto
import CamposProducto from './formulario/CamposProducto'

const valoresIniciales = {
  nombre: '',
  categoria: '',
  precioVenta: '',
  stockActual: '',
  stockMinimo: '',
  cantMinimaProduccion: '1',
  cantMaximaProduccion: '100',
  imagen: '',
  activo: true,
}

export default function NuevoProductoModal({
  open,
  onClose,
  onGuardar,
}) {
  const theme = useTheme()
  const [formulario, setFormulario] = useState(valoresIniciales)

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
    }
    onGuardar(datos)
  }

  const handleClose = () => {
    setFormulario(valoresIniciales)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Nuevo Producto" size="lg" showDivider>
      <form onSubmit={handleSubmit}>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            mb: 3,
          }}
        >
          Completa los campos para registrar un nuevo producto
        </Typography>

        <CamposProducto formulario={formulario} handleChange={handleChange} handleNumber={handleNumber} handleSwitch={handleSwitch} />
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', mt: 3 }}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" leftIcon={<IconCheck size={16} />}>
            Guardar Producto
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
