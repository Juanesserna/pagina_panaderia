import { IconButton, Stack } from '@mui/material'
import { IconToggleRight } from '@tabler/icons-react'
import { StatusBadge } from '@shared/ui'
import { varianteEstadoProducto } from './comunes/opcionesProducto'

// Pastilla de estado del producto con el botón para cambiarlo.
// Mismo botón que usa el listado de órdenes de producción.
export default function EstadoProducto({ producto, onCambiarEstado }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <StatusBadge variant={varianteEstadoProducto(producto.estado)} dot size="md">
        {producto.estado}
      </StatusBadge>
      <IconButton
        size="small"
        title="Cambiar estado"
        aria-label="Cambiar estado"
        onClick={(e) => {
          e.stopPropagation()
          onCambiarEstado?.(producto)
        }}
        sx={{ color: 'text.secondary' }}
      >
        <IconToggleRight size={15} />
      </IconButton>
    </Stack>
  )
}