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

const headCellSx = {
  typography: 'overline',
  color: 'text.secondary',
}

export default function ClientesTable({
  clientes,
  loading,
  onVer,
  onEditar,
}) {
  if (!loading && clientes.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No se encontraron clientes con los filtros aplicados.
        </Typography>
      </Box>
    )
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={headCellSx}>Cliente</TableCell>
          <TableCell sx={headCellSx}>Documento</TableCell>
          <TableCell sx={headCellSx}>Cuenta</TableCell>
          <TableCell sx={headCellSx} align="right">
            Acciones
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {clientes.map((cliente) => (
          <TableRow
            key={cliente.id}
            sx={{ '&:last-child td': { borderBottom: 0 } }}
          >
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UserAvatar name={cliente.nombre} />

                <Box>
                  <Typography variant="body1" color="text.primary">
                    {cliente.nombre}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    ID: {cliente.id}
                  </Typography>
                </Box>
              </Box>
            </TableCell>

            <TableCell>
              <Typography variant="body2" color="text.primary">
                {cliente.tipoDocumento}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {cliente.documento}
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant="body2"
                color={cliente.id_usuario != null ? 'success.main' : 'text.secondary'}
              >
                {cliente.id_usuario != null
                  ? 'Cuenta vinculada'
                  : 'Sin cuenta'}
              </Typography>
            </TableCell>

            <TableCell align="right">
              <Tooltip title="Ver detalle">
                <IconButton
                  size="small"
                  onClick={() => onVer(cliente)}
                  sx={{ color: 'text.secondary' }}
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  onClick={() => onEditar(cliente)}
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
