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
import { formatearHorario } from '../services/empleadosService'

const COLUMNAS = [
  'Empleado',
  'Documento',
  'Teléfono',
  'Horario',
  'Acciones',
]

const headCellSx = {
  typography: 'overline',
  color: 'text.secondary',
  whiteSpace: 'nowrap',
  py: 1,
}

// Filas temporales durante la carga.
function FilasCarga() {
  return Array.from({ length: 6 }, (_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Skeleton variant="circular" width={36} height={36} />

          <Box>
            <Skeleton width={140} />
            <Skeleton width={45} />
            <Skeleton width={90} />
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Skeleton width={120} />
        <Skeleton width={85} />
      </TableCell>

      <TableCell>
        <Skeleton width={90} />
      </TableCell>

      <TableCell>
        <Skeleton width={140} />
      </TableCell>

      <TableCell align="right">
        <Skeleton width={55} sx={{ ml: 'auto' }} />
      </TableCell>
    </TableRow>
  ))
}

// Acciones con estilo uniforme.
function Accion({ icon: Icon, label, onClick, disabled }) {
  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          size="small"
          aria-label={label}
          onClick={onClick}
          disabled={disabled}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <Icon size={18} />
        </IconButton>
      </span>
    </Tooltip>
  )
}

export default function EmpleadosTable({
  empleados = [],
  loading = false,
  submitting = false,
  onView,
  onEdit,
}) {
  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        minHeight: 360,
      }}
    >
      <Table
        size="small"
        sx={{
          '& .MuiTableBody-root .MuiTableCell-root': {
            py: 0.25,
            verticalAlign: 'middle',
          },
        }}
      >
        <TableHead>
          <TableRow>
            {COLUMNAS.map((columna, index) => (
              <TableCell
                key={columna}
                sx={headCellSx}
                align={index === COLUMNAS.length - 1 ? 'right' : 'left'}
              >
                {columna}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <FilasCarga />
          ) : empleados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMNAS.length}>
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron empleados.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            empleados.map(empleado => {
              const tieneCuenta = empleado.id_usuario != null

              return (
                <TableRow
                  key={empleado.id}
                  hover
                  sx={{
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  {/* Información del empleado. */}
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        minWidth: 180,
                      }}
                    >
                      <UserAvatar name={empleado.nombre} />

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            lineHeight: 1.4,
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {empleado.nombre}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="div"
                        >
                          ID: {empleado.id}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.6,
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: tieneCuenta
                                ? 'success.main'
                                : 'text.disabled',
                            }}
                          />

                          <Typography
                            variant="caption"
                            color={tieneCuenta
                              ? 'success.main'
                              : 'text.secondary'}
                          >
                            {tieneCuenta
                              ? 'Cuenta vinculada'
                              : 'Sin cuenta'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Documento de identidad. */}
                  <TableCell>
                    <Typography variant="body2">
                      {empleado.tipoDocumento}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      component="div"
                    >
                      {empleado.documento}
                    </Typography>
                  </TableCell>

                  {/* Información de contacto. */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {empleado.telefono}
                    </Typography>
                  </TableCell>

                  {/* Horario laboral. */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {formatearHorario(empleado)}
                    </Typography>
                  </TableCell>

                  {/* Acciones disponibles. */}
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Accion
                      icon={Eye}
                      label="Ver detalle"
                      onClick={() => onView(empleado)}
                      disabled={submitting}
                    />

                    <Accion
                      icon={Pencil}
                      label="Editar empleado"
                      onClick={() => onEdit(empleado)}
                      disabled={submitting}
                    />
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
