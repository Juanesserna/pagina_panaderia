// Importa los componentes de MUI que usa la fila
import { Box, IconButton, TableCell, TableRow, Typography, useTheme } from '@mui/material'
// Importa los iconos de editar y eliminar
import { IconPencil, IconTrash } from '@tabler/icons-react'
// Importa la fuente definida en el tema de la app
import { fonts } from '@app/theme/colors'
// Importa el estilo compartido de las celdas
import { CELL_SX } from '../comunes/tablaEstilos'

// Fila de solo lectura que muestra un insumo de la receta
export default function InsumoRow({ insumo, onEdit, onDelete, showActions }) {
  // Obtiene el tema actual (claro u oscuro)
  const theme = useTheme()
  return (
    // Fila con efecto hover
    <TableRow sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}>
      {/* Columna: ID del producto */}
      <TableCell sx={CELL_SX}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary }}>
          {insumo.idProducto}
        </Typography>
      </TableCell>
      {/* Columna: ID del insumo y nombre */}
      <TableCell sx={CELL_SX}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary }}>
          {`${insumo.idInsumo} / ${insumo.insumo}`}
        </Typography>
      </TableCell>
      {/* Columna: cantidad alineada a la derecha */}
      <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary }}>
          {insumo.cantidad}
        </Typography>
      </TableCell>
      {/* Columna: unidad de medida */}
      <TableCell sx={CELL_SX}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary }}>
          {insumo.unidad}
        </Typography>
      </TableCell>
      {/* Columna de acciones, solo si showActions es true */}
      {showActions && (
        <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
          {/* Contenedor de los botones de acción */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
            {/* Botón editar */}
            <IconButton
              size="small"
              onClick={() => onEdit?.(insumo)}
              sx={{
                color: theme.palette.text.secondary,
                width: 28,
                height: 28,
              }}
            >
              <IconPencil size={15} />
            </IconButton>
            {/* Botón eliminar */}
            <IconButton
              size="small"
              onClick={() => onDelete?.(insumo.id)}
              sx={{
                color: theme.palette.error.main,
                width: 28,
                height: 28,
              }}
            >
              <IconTrash size={15} />
            </IconButton>
          </Box>
        </TableCell>
      )}
    </TableRow>
  )
}
