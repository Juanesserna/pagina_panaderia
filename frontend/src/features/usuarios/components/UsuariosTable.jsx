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
import { Pencil, ToggleLeft, ToggleRight } from 'lucide-react'
import UserAvatar from '@shared/components/UserAvatar'
import { AVATAR_PALETTE, colorFromName } from '@shared/utils/colors'
import StatusChip from './StatusChip'

const ROLE_TEXT_COLORS = {
  Gerente: AVATAR_PALETTE[0].color,
  Panadero: AVATAR_PALETTE[2].color,
  Cliente: AVATAR_PALETTE[1].color,
  Vendedor: AVATAR_PALETTE[3].color,
}

function colorForRole(rol) {
  return ROLE_TEXT_COLORS[rol] ?? colorFromName(rol).color
}

const headCellSx = {
  typography: 'overline',
  color: 'text.secondary',
}

export default function UsuariosTable({
  usuarios,
  loading,
  onVer,
  onEditar,
  onInhabilitar,
}) {
  if (!loading && usuarios.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No se encontraron usuarios con los filtros aplicados.
        </Typography>
      </Box>
    )
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={headCellSx}>Usuario</TableCell>
          <TableCell sx={headCellSx}>Rol</TableCell>
          <TableCell sx={headCellSx}>Estado</TableCell>
          <TableCell sx={headCellSx} align="right">
            Acciones
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {usuarios.map((usuario) => (
          <TableRow
            key={usuario.id}
            sx={{ '&:last-child td': { borderBottom: 0 } }}
          >
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UserAvatar name={usuario.nombre} />

                <Box>
                  <Typography variant="body1" color="text.primary">
                    {usuario.nombre}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {usuario.email}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    CC: {usuario.cedula}
                  </Typography>
                </Box>
              </Box>
            </TableCell>

            <TableCell>
              <Typography
                variant="body1"
                sx={{ color: colorForRole(usuario.rol) }}
              >
                {usuario.rol}
              </Typography>
            </TableCell>

            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StatusChip estado={usuario.estado} />

                <Tooltip
                  title={
                    usuario.estado === 'Activo'
                      ? 'Inhabilitar'
                      : 'Reactivar'
                  }
                >
                  <IconButton
                    size="small"
                    onClick={() => onInhabilitar(usuario)}
                    sx={{ color: 'text.secondary' }}
                  >
                    {usuario.estado === 'Activo' ? (
                      <ToggleRight size={18} />
                    ) : (
                      <ToggleLeft size={18} />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>

            <TableCell align="right">
              <Tooltip title="Ver detalle">
                <IconButton
                  size="small"
                  onClick={() => onVer(usuario)}
                  sx={{ color: 'text.secondary' }}
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  onClick={() => onEditar(usuario)}
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
