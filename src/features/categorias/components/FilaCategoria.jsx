import { Box, TableCell, TableRow, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import EstadoCategoria from './EstadoCategoria'
import TipoBadge from './TipoBadge'
import AccionesCategoria from './AccionesCategoria'
import { CELL_SX } from './comunes/tablaEstilos'

export default function FilaCategoria({ categoria, index, onCambiarEstado, onEditar, onEliminar }) {
  return (
    <TableRow
      sx={{
        backgroundColor: (theme) =>
          index % 2 === 1 ? alpha(theme.palette.text.primary, 0.03) : 'transparent',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <TableCell sx={CELL_SX}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: categoria.color,
              flexShrink: 0,
            }}
          />
          <Typography variant="subtitle1" component="span">
            {categoria.nombre}
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={CELL_SX}>
        <TipoBadge
          tipo={categoria.tipo}
          productosCount={categoria.productosCount}
          insumosCount={categoria.insumosCount}
        />
      </TableCell>
      <TableCell sx={CELL_SX}>
        <Typography variant="body1" color="text.secondary">
          {categoria.creada}
        </Typography>
      </TableCell>
      <TableCell sx={CELL_SX}>
        <EstadoCategoria categoria={categoria} onCambiarEstado={onCambiarEstado} />
      </TableCell>
      <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
        <AccionesCategoria categoria={categoria} onEditar={onEditar} onEliminar={onEliminar} />
      </TableCell>
    </TableRow>
  )
}