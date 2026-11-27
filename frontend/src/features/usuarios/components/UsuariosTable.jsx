import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material'

import { Eye, Pencil } from 'lucide-react'

import UserAvatar from '@shared/components/UserAvatar'
import EstadoSwitch from '@shared/ui/EstadoSwitch'
import { AVATAR_PALETTE, colorFromName } from '@shared/utils/colors'

const ROLE_TEXT_COLORS = {
  Gerente: AVATAR_PALETTE[0].color,
  Panadero: AVATAR_PALETTE[2].color,
  Cliente: AVATAR_PALETTE[1].color,
  Vendedor: AVATAR_PALETTE[3].color,
}

const COLUMNAS = [
  'Cuenta de usuario',
  'Rol',
  'Estado',
  'Acciones',
]

const headCellSx = {
  typography: 'overline',
  color: 'text.secondary',
  whiteSpace: 'nowrap',
  py: 1,
}

function colorForRole(rol) {
  return (
    ROLE_TEXT_COLORS[rol] ??
    colorFromName(rol || 'Usuario').color
  )
}

function obtenerMotivoBloqueo(usuario, esUnicoGerente) {
  if (esUnicoGerente(usuario)) {
    return 'No puedes desactivar al único Gerente activo.'
  }

  if (
    usuario.estado === 'Inactivo' &&
    usuario.estadoRol !== 'Activo'
  ) {
    return 'No puedes activar esta cuenta mientras su rol esté inactivo o no esté disponible.'
  }

  return ''
}

export default function UsuariosTable({
  usuarios = [],
  loading = false,
  submitting = false,
  onVer,
  onEditar,
  onInhabilitar,
  esUnicoGerente,
}) {
  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        minHeight: 380,
      }}
    >
      <Table
        size="small"
        sx={{
          '& .MuiTableBody-root .MuiTableCell-root': {
            py: 0.5,
            verticalAlign: 'middle',
          },
        }}
      >
        <TableHead>
          <TableRow>
            {COLUMNAS.map((columna) => (
              <TableCell
                key={columna}
                sx={headCellSx}
                align={columna === 'Acciones' ? 'right' : 'left'}
              >
                {columna}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            Array.from({ length: 6 }, (_, index) => (
              <TableRow key={index}>
                {COLUMNAS.map((columna) => (
                  <TableCell key={columna}>
                    <Skeleton height={42} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : usuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMNAS.length}>
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No se encontraron usuarios con los filtros aplicados.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            usuarios.map((usuario) => {
              const titulo =
                usuario.nombre?.trim() ||
                usuario.email ||
                `Cuenta #${usuario.id}`

              const motivoBloqueo = obtenerMotivoBloqueo(
                usuario,
                esUnicoGerente
              )

              return (
                <TableRow
                  key={usuario.id}
                  hover
                  sx={{
                    '&:last-child td': {
                      borderBottom: 0,
                    },
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        minWidth: 180,
                      }}
                    >
                      <UserAvatar name={titulo} />

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            lineHeight: 1.4,
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {titulo}
                        </Typography>

                        {usuario.nombre && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              lineHeight: 1.4,
                              overflowWrap: 'anywhere',
                            }}
                          >
                            {usuario.email}
                          </Typography>
                        )}

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="div"
                          sx={{ lineHeight: 1.4 }}
                        >
                          {usuario.tipoPerfil ||
                            'Sin perfil asociado'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      sx={{
                        color: colorForRole(usuario.rol),
                        fontWeight: 600,
                      }}
                    >
                      {usuario.rol || 'Sin rol'}
                    </Typography>

                    {usuario.estadoRol === 'Inactivo' && (
                      <Typography
                        variant="caption"
                        color="warning.main"
                        component="div"
                      >
                        Rol inactivo
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <EstadoSwitch
                      activo={usuario.estado === 'Activo'}
                      nombre={titulo}
                      disabled={
                        submitting || Boolean(motivoBloqueo)
                      }
                      motivo={
                        motivoBloqueo ||
                        (submitting
                          ? 'Hay una operación en proceso.'
                          : '')
                      }
                      onChange={() => onInhabilitar(usuario)}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 0.5,
                      }}
                    >
                      <Tooltip title="Ver detalle">
                        <span>
                          <IconButton
                            size="small"
                            disabled={submitting}
                            onClick={() => onVer(usuario)}
                            aria-label={`Ver detalle de ${titulo}`}
                            sx={{ color: 'text.secondary' }}
                          >
                            <Eye size={18} />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Editar">
                        <span>
                          <IconButton
                            size="small"
                            disabled={submitting}
                            onClick={() => onEditar(usuario)}
                            aria-label={`Editar a ${titulo}`}
                            sx={{ color: 'text.secondary' }}
                          >
                            <Pencil size={18} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </Box>
  )
}
