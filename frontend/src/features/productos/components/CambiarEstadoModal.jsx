import { useState } from 'react'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconAlertTriangle } from '@tabler/icons-react'
import { Button, Modal, Select, StatusBadge } from '@shared/ui'
import FieldLabel from './formulario/FieldLabel'
import { ESTADOS_EDITABLES, varianteEstadoProducto } from './comunes/opcionesProducto'

const OPCIONES_ESTADO = ESTADOS_EDITABLES.map((estado) => ({ value: estado, label: estado }))

// Modal para cambiar el estado de un producto desde el listado.
// Solo se asigna Activo o Inactivo; "Agotado" se calcula por stock y no se elige.
// Se monta solo cuando hay un producto seleccionado; la key reinicia el valor por producto.
export default function CambiarEstadoModal({ producto, onClose, onConfirmar }) {
  const theme = useTheme()
  const advertenciaColor = theme.palette.warning.main
  // Estado guardado (Activo/Inactivo), distinto del estado mostrado, que puede ser "Agotado"
  const estadoGuardado = producto.activo === false ? 'Inactivo' : 'Activo'
  const [estado, setEstado] = useState(estadoGuardado)

  const sinCambios = estado === estadoGuardado
  const inactivando = estado === 'Inactivo' && estadoGuardado === 'Activo'

  return (
    <Modal open onClose={onClose} title={`Cambiar estado ${producto.codigo}`} size="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Estado actual:
          </Typography>
          <StatusBadge variant={varianteEstadoProducto(producto.estado)} dot size="md">
            {producto.estado}
          </StatusBadge>
        </Box>

        {producto.estado === 'Agotado' && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Este producto figura como Agotado porque su stock es cero. El estado Agotado se calcula, no se asigna.
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <FieldLabel required={false}>Nuevo estado</FieldLabel>
          <Select
            options={OPCIONES_ESTADO}
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          />
        </Box>

        {inactivando && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              backgroundColor: alpha(advertenciaColor, 0.1),
              border: 1,
              borderColor: alpha(advertenciaColor, 0.3),
            }}
          >
            <IconAlertTriangle size={18} color={advertenciaColor} />
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Al inactivar el producto deja de estar disponible. Si es un Intermedio usado en recetas de productos activos, el sistema no lo permitirá.
            </Typography>
          </Box>
        )}

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" disabled={sinCambios} onClick={() => onConfirmar(estado)}>
            Guardar
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
