import { useState } from 'react' // Agregado para manejar el diálogo
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
import Dialog from '@mui/material/Dialog' //Diálogo de confirmación
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { Pencil } from 'lucide-react';
import { BRAND, AVATAR_PALETTE, colorFromName } from '@shared/utils/colors'
import { esEliminable } from '../services/rolesService'
import { Trash } from 'lucide-react';

// Colores fijos para los roles que ya trae el sistema por defecto
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
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.5,
  color: 'text.secondary',
  textTransform: 'uppercase',
}

const switchSx = {
  '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: BRAND.orange,
    opacity: 1,
  },
}

export default function RolesTable({ roles, loading, onToggleEstado, onVer, onEditar, onEliminar }) {
  //  Estado para el diálogo de confirmación
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [rolPendiente, setRolPendiente] = useState(null)
  const [nuevoEstado, setNuevoEstado] = useState(null)

  //  Al tocar el switch → NO cambia todavía, guarda datos y abre mensaje
  const handleSolicitarCambio = (rol, quedaraActivo) => {
    setRolPendiente(rol)
    setNuevoEstado(quedaraActivo)
    setDialogoAbierto(true)
  }

  //  Si confirma → sí cambia el estado
  const handleConfirmar = () => {
    if (rolPendiente) {
      onToggleEstado(rolPendiente.id)
    }
    setDialogoAbierto(false)
    setRolPendiente(null)
    setNuevoEstado(null)
  }

  //  Si cancela → no hace nada
  const handleCancelar = () => {
    setDialogoAbierto(false)
    setRolPendiente(null)
    setNuevoEstado(null)
  }

  if (!loading && roles.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
        No se encontraron roles con ese nombre.
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
              <TableRow key={rol.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: nombreColor }}>
                    {rol.nombre}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{rol.codigo}</Typography>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={estaActivo}
                    onChange={(e) => handleSolicitarCambio(rol, e.target.checked)}
                    sx={switchSx}
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
                      eliminable ? 'Eliminar rol' : 'No se puede eliminar: hay usuarios con este rol'
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        disabled={!eliminable}
                        onClick={() => onEliminar(rol)}
                        sx={{ color: eliminable ? 'error.main' : undefined }}
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

      {/*  Diálogo de confirmación */}
      <Dialog open={dialogoAbierto} onClose={handleCancelar}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Cambiar Estado del Rol
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography sx={{ mb: 2 }}>
            ¿Seguro deseas <strong>{nuevoEstado ? 'activar' : 'desactivar'}</strong> el rol{' '}
            <strong>{rolPendiente?.nombre}</strong>?
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
            El estado pasará a:{' '}
            <strong style={{ color: BRAND.orange }}>
              {nuevoEstado ? 'Activo' : 'Inactivo'}
            </strong>
          </Typography>
          {!nuevoEstado && (
            <Typography sx={{ mt: 2, color: 'warning.main', fontSize: 13 }}>
               Al desactivarlo, este rol ya no podrá asignarse a nuevos usuarios.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancelar} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            variant="contained"
            sx={{ bgcolor: BRAND.orange, '&:hover': { bgcolor: BRAND.orangeDark } }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}