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
// Hook de validación del formulario de producto
import { useValidacionProducto } from '../hooks/useValidacionProducto'

const VALORES_INICIALES = {
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
  const {
    valores: formulario,
    cambiar,
    touched,
    tocar,
    validar,
    reiniciar,
  } = useValidacionProducto(VALORES_INICIALES)
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
    <Modal open={open} onClose={handleClose} title="Nuevo Producto" size="lg" showDivider>
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
          Completa los campos para registrar un nuevo producto
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
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', mt: 3 }}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            leftIcon={<IconCheck size={16} />}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar Producto'}
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
