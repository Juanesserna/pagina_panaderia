import { useState } from 'react'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { Pencil, Trash } from 'lucide-react'
import { Button, StatusBadge } from '@shared/ui'
import { AVATAR_PALETTE, colorFromName } from '@shared/utils/colors'
import { esEliminable } from '../services/rolesService'

const ROLE_TEXT_COLORS = {
  Gerente: AVATAR_PALETTE[0].color,
  Panadero: AVATAR_PALETTE[2].color,
  Cliente: AVATAR_PALETTE[1].color,
  Vendedor: AVATAR_PALETTE[0].color,
}

function colorForRole(nombre) {
  return ROLE_TEXT_COLORS[nombre] ?? colorFromName(nombre).color
}

const headCellSx = {
  typography: 'overline',
  color: 'text.secondary',
}

export default function RolesTable({
  roles,
  loading,
  onToggleEstado,
  onVer,
  onEditar,
  onEliminar,
}) {
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [rolPendiente, setRolPendiente] = useState(null)
  const [nuevoEstado, setNuevoEstado] = useState(null)

  const handleSolicitarCambio = (rol, quedaraActivo) => {
    setRolPendiente(rol)
    setNuevoEstado(quedaraActivo)
    setDialogoAbierto(true)
  }

  const handleConfirmar = () => {
    if (rolPendiente) {
      onToggleEstado(rolPendiente.id)
    }
    setDialogoAbierto(false)
    setRolPendiente(null)
    setNuevoEstado(null)
  }

  const handleCancelar = () => {
    setDialogoAbierto(false)
    setRolPendiente(null)
    setNuevoEstado(null)
  }

  if (!loading && roles.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No se encontraron roles con ese nombre.
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={headCellSx}>Rol</TableCell>
            <TableCell sx={headCellSx}>Activo</TableCell>
            <TableCell sx={headCellSx} align="right" />
          </TableRow>
        </TableHead>

        <TableBody>
          {roles.map((rol) => {
            const eliminable = esEliminable(rol)
            const nombreColor = colorForRole(rol.nombre)
            const estaActivo = rol.estado === 'Activo'

            return (
              <TableRow
                key={rol.id}
                sx={{ '&:last-child td': { borderBottom: 0 } }}
              >
                <TableCell>
                  <Typography
                    variant="body1"
                    sx={{ color: nombreColor }}
                  >
                    {rol.nombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {rol.codigo}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Switch
                    checked={estaActivo}
                    onChange={(e) =>
                      handleSolicitarCambio(rol, e.target.checked)
                    }
                  />
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Ver detalle">
                    <IconButton
                      size="small"
                      onClick={() => onVer(rol)}
                      sx={{ color: 'text.secondary' }}
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => onEditar(rol)}
                      sx={{ color: 'text.secondary' }}
                    >
                      <Pencil size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip
                    title={
                      eliminable
                        ? 'Eliminar rol'
                        : 'No se puede eliminar: hay usuarios con este rol'
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        disabled={!eliminable}
                        onClick={() => onEliminar(rol)}
                        sx={{
                          color: eliminable ? 'error.main' : undefined,
                        }}
                      >
                        <Trash size={18} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog open={dialogoAbierto} onClose={handleCancelar}>
        <DialogTitle>
          <Typography variant="h6">
            Cambiar estado del rol
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ¿Seguro deseas{' '}
            <strong>{nuevoEstado ? 'activar' : 'desactivar'}</strong> el rol{' '}
            <strong>{rolPendiente?.nombre}</strong>?
          </Typography>

          <Typography variant="body2" color="text.secondary">
            El estado pasará a:{' '}
            <StatusBadge
              variant={nuevoEstado ? 'success' : 'accent'}
              dot
            >
              {nuevoEstado ? 'Activo' : 'Inactivo'}
            </StatusBadge>
          </Typography>

          {!nuevoEstado && (
            <Typography
              variant="body2"
              color="warning.main"
              sx={{ mt: 2 }}
            >
              Al desactivarlo, este rol ya no podrá asignarse a nuevos
              usuarios.
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="secondary" onClick={handleCancelar}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmar}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
