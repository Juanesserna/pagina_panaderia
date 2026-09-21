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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { Pencil } from 'lucide-react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { BRAND, AVATAR_PALETTE, colorFromName } from '@shared/utils/colors'
import { esEliminable } from '../services/rolesService'
import { Trash } from 'lucide-react';



// Colores fijos para los roles que ya trae el sistema por defecto, para que
// coincidan exactamente con el diseño (no dependen del hash de colorFromName).
// Cualquier rol nuevo que no esté en este mapa sigue recibiendo un color
// automático y consistente vía colorFromName.
const ROLE_TEXT_COLORS = {
  Gerente: AVATAR_PALETTE[0].color, // durazno
  Panadero: AVATAR_PALETTE[2].color, // azul
  Cliente: AVATAR_PALETTE[1].color, // verde menta
  Vendedor: AVATAR_PALETTE[0].color, // durazno
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
  if (!loading && roles.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
        No se encontraron roles con ese nombre.
      </Box>
    )
  }

  return (
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
                  checked={rol.estado === 'Activo'}
                  onChange={() => onToggleEstado(rol.id)}
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
  )
}