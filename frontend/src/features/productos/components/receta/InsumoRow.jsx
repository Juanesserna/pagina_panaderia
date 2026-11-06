import { Box, IconButton, TableCell, TableRow, Typography, useTheme } from '@mui/material'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { CELL_SX } from '../comunes/tablaEstilos'

// Fila de solo lectura que muestra un insumo de la receta
export default function InsumoRow({ insumo, onEdit, onDelete, showActions }) {
  const theme = useTheme()
  const textoSx = { color: theme.palette.text.primary }
  const botonSx = { width: 28, height: 28 }

  return (
    <TableRow sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}>
      {/* ID del producto */}
      <TableCell sx={CELL_SX}>
        <Typography variant="body1" sx={textoSx}>
          {insumo.idProducto}
        </Typography>
      </TableCell>
      {/* ID del insumo y nombre */}
      <TableCell sx={CELL_SX}>
        <Typography variant="body1" sx={textoSx}>
          {`${insumo.idInsumo} / ${insumo.insumo}`}
        </Typography>
      </TableCell>
      {/* Unidad de medida (va antes que la cantidad) */}
      <TableCell sx={CELL_SX}>
        <Typography variant="body1" sx={textoSx}>
          {insumo.unidad}
        </Typography>
      </TableCell>
      {/* Cantidad alineada a la derecha */}
      <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
        <Typography variant="body1" sx={textoSx}>
          {insumo.cantidad}
        </Typography>
      </TableCell>
      {/* Acciones, solo si showActions es true */}
      {showActions && (
        <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
            <IconButton
              size="small"
              onClick={() => onEdit?.(insumo)}
              sx={{ ...botonSx, color: theme.palette.text.secondary }}
              aria-label="Editar insumo"
            >
              <IconPencil size={15} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete?.(insumo.id)}
              sx={{ ...botonSx, color: theme.palette.error.main }}
              aria-label="Eliminar insumo"
            >
              <IconTrash size={15} />
            </IconButton>
          </Box>
        </TableCell>
      )}
    </TableRow>
  )
}
