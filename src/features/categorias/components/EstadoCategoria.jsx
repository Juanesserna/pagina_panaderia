import { IconButton, Stack } from '@mui/material'
import { IconToggleRight } from '@tabler/icons-react'
import EstadoBadge from './EstadoBadge'

// Pastilla de estado de la categoría con el botón para cambiarlo.
// Mismo botón que usan productos y las órdenes de producción.
export default function EstadoCategoria({ categoria, onCambiarEstado }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <EstadoBadge estado={categoria.estado} />
      <IconButton
        size="small"
        title="Cambiar estado"
        aria-label="Cambiar estado"
        onClick={(e) => {
          e.stopPropagation()
          onCambiarEstado?.(categoria)
        }}
        sx={{ color: 'text.secondary' }}
      >
        <IconToggleRight size={15} />
      </IconButton>
    </Stack>
  )
}