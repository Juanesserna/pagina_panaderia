import { Box, IconButton, useTheme } from '@mui/material'
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react'

// Botones de acción de una fila de la tabla de productos: ver, editar y eliminar
export default function AccionesProducto({ producto, onVer, onEdit, onEliminar }) {
  const theme = useTheme()

  // Tamaño común de los tres botones
  const botonSx = { width: 28, height: 28 }

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
      <IconButton
        size="small"
        aria-label="Ver detalle"
        onClick={() => onVer?.(producto)}
        sx={{ ...botonSx, color: theme.palette.text.secondary }}
      >
        <IconEye size={15} />
      </IconButton>
      <IconButton
        size="small"
        aria-label="Editar producto"
        onClick={() => onEdit?.(producto)}
        sx={{ ...botonSx, color: theme.palette.text.secondary }}
      >
        <IconPencil size={15} />
      </IconButton>
      <IconButton
        size="small"
        aria-label="Eliminar producto"
        onClick={() => onEliminar?.(producto)}
        sx={{ ...botonSx, color: theme.palette.error.main }}
      >
        <IconTrash size={15} />
      </IconButton>
    </Box>
  )
}
