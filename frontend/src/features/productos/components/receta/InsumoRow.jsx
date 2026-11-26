import { Box, IconButton, TableCell, TableRow, Typography, useTheme } from '@mui/material'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { CELL_SX } from '../comunes/tablaEstilos'
import { etiquetaOrigen } from './recetaUtils'

// Fila de solo lectura que muestra un insumo de la receta
export default function InsumoRow({ insumo, onEdit, onDelete, showActions }) {
  const theme = useTheme()
  const textoSx = { color: theme.palette.text.primary }
  const botonSx = { width: 28, height: 28 }
  const origen = insumo.origen ?? 'INSUMO'
  const idComp = insumo.idComponente ?? insumo.idInsumo
  const nombre = insumo.nombre ?? insumo.insumo

  return (
    <TableRow sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}>
      {/* Origen */}
      <TableCell sx={CELL_SX}>
        <Typography variant="body1" sx={textoSx}>
          {etiquetaOrigen(origen)}
        </Typography>
      </TableCell>
      {/* ID del componente y nombre */}
      <TableCell sx={CELL_SX}>
        <Typography variant="body1" sx={textoSx}>
          {`${idComp} / ${nombre}`}
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
