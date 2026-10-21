import { TableRow, TableCell, Typography, Box, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { formatPrice } from '../services/productos.service'
import { CELL_SX } from './comunes/tablaEstilos'
import EstadoProducto from './EstadoProducto'
import AccionesProducto from './AccionesProducto'

// Fila de la tabla de productos: datos del producto y sus acciones.
// "index" se usa para alternar el color de fondo de las filas.
export default function FilaProducto({ producto: p, index, onVer, onEdit, onEliminar, onCambiarEstado }) {
  const theme = useTheme()

  return (
    <TableRow
      sx={{
        backgroundColor: index % 2 === 1 ? alpha(theme.palette.text.primary, 0.03) : 'transparent',
        '&:hover': { bgcolor: theme.palette.action.hover },
      }}
    >
      <TableCell sx={CELL_SX}>
        <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
          {p.codigo}
        </Typography>
      </TableCell>
      <TableCell sx={CELL_SX}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            component="img"
            src={p.imagenUrl}
            alt={p.nombre}
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              objectFit: 'cover',
            }}
          />
          <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
            {p.nombre}
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={CELL_SX}>
        <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
          {p.categoria}
        </Typography>
      </TableCell>
      <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
        <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary }}>
          {formatPrice(p.precioVenta)}
        </Typography>
      </TableCell>
      <TableCell sx={CELL_SX}>
        <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
          {p.stock}
        </Typography>
      </TableCell>
      <TableCell sx={CELL_SX}>
        <EstadoProducto producto={p} onCambiarEstado={onCambiarEstado} />
      </TableCell>
      <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
        <AccionesProducto producto={p} onVer={onVer} onEdit={onEdit} onEliminar={onEliminar} />
      </TableCell>
    </TableRow>
  )
}
