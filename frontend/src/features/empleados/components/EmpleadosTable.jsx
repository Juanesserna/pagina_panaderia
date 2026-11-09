import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { Pencil } from 'lucide-react'

import UserAvatar from '@shared/components/UserAvatar'
import { formatearHorario } from '../services/empleadosService'

const headCellSx = {
  typography: 'overline',
  color: 'text.secondary',
}

export default function EmpleadosTable({
  empleados = [],
  loading = false,
  onView,
  onEdit,
}) {
  if (!loading && empleados.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No se encontraron empleados con los filtros aplicados.
        </Typography>
      </Box>
    )
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={headCellSx}>Empleado</TableCell>
          <TableCell sx={headCellSx}>Documento</TableCell>
          <TableCell sx={headCellSx}>Teléfono</TableCell>
          <TableCell sx={headCellSx}>Horario</TableCell>
          <TableCell sx={headCellSx} align="right">
            Acciones
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {empleados.map((empleado) => (
          <TableRow
            key={empleado.id}
            sx={{ '&:last-child td': { borderBottom: 0 } }}
          >
            <TableCell>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <UserAvatar name={empleado.nombre} />

                <Box>
                  <Typography variant="body1" color="text.primary">
                    {empleado.nombre}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    ID: {empleado.id}
                  </Typography>
                </Box>
              </Box>
            </TableCell>

            <TableCell>
              <Typography variant="body2" color="text.primary">
                {empleado.tipoDocumento}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {empleado.documento}
              </Typography>
            </TableCell>

            <TableCell>
              <Typography variant="body2" color="text.primary">
                {empleado.telefono}
              </Typography>
            </TableCell>

            <TableCell>
              <Typography variant="body2" color="text.primary">
                {formatearHorario(empleado)}
              </Typography>
            </TableCell>

            <TableCell align="right">
              <Tooltip title="Ver detalle">
                <IconButton
                  size="small"
                  onClick={() => onView(empleado)}
                  sx={{ color: 'text.secondary' }}
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  onClick={() => onEdit(empleado)}
                  sx={{ color: 'text.secondary' }}
                >
                  <Pencil size={18} />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
