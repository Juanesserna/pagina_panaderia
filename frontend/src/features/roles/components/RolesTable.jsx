import { useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'

import { Eye, Pencil, Trash2, SearchX } from 'lucide-react'
import EstadoSwitch from '@shared/ui/EstadoSwitch'

import {
  GERENTE_ID,
  esEliminable,
  esRolSistema,
  esDesactivable,
} from '../services/rolesService'

const columnas = [
  { nombre: 'Rol', align: 'left' },
  { nombre: 'Usuarios', align: 'center' },
  { nombre: 'Estado', align: 'left' },
  { nombre: 'Acciones', align: 'right' },
]

const headCellSx = {
  py: 1,
  px: 2,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  color: 'text.secondary',
  bgcolor: 'action.hover',
  whiteSpace: 'nowrap',
}

const cellSx = {
  py: 0.85,
  px: 2,
  fontSize: 13,
}

// Botón de acción con descripción y soporte para estados bloqueados.
function Accion({
  titulo,
  icono: Icono,
  onClick,
  disabled = false,
  color = 'text.secondary',
}) {
  return (
    <Tooltip title={titulo}>
      <span>
        <IconButton
          size="small"
          aria-label={titulo}
          disabled={disabled}
          onClick={onClick}
          sx={{ color, width: 32, height: 32 }}
        >
          <Icono size={17} />
        </IconButton>
      </span>
    </Tooltip>
  )
}

// El Gerente permanece activo. Los demás roles pueden
// cambiar de estado respetando sus usuarios asociados.
function puedeCambiarEstado(rol) {
  return Number(rol.id) !== GERENTE_ID &&
    (rol.estado === 'Inactivo' || esDesactivable(rol))
}

export default function RolesTable({
  roles = [],
  loading = false,
  submitting = false,
  onToggleEstado,
  onVer,
  onEditar,
  onEliminar,
}) {
  const [rolPendiente, setRolPendiente] = useState(null)
  const [procesando, setProcesando] = useState(false)
  const [errorText, setErrorText] = useState('')

  const ejecutando = useRef(false)
  const ocupado = submitting || procesando
  const activando = rolPendiente?.estado === 'Inactivo'
  const accion = activando ? 'Activar' : 'Desactivar'

  function solicitarCambio(rol) {
    if (ocupado || !puedeCambiarEstado(rol)) return

    setErrorText('')
    setRolPendiente(rol)
  }

  function cancelarCambio() {
    if (ocupado || ejecutando.current) return

    setRolPendiente(null)
    setErrorText('')
  }

  async function confirmarCambio() {
    if (!rolPendiente || ocupado || ejecutando.current) return

    const actual = roles.find(rol => rol.id === rolPendiente.id)

    // Comprueba nuevamente las restricciones antes de guardar.
    if (
      !actual ||
      actual.estado !== rolPendiente.estado ||
      !puedeCambiarEstado(actual)
    ) {
      setErrorText(
        'El rol cambió o ya no cumple las condiciones. Cancela e intenta nuevamente.'
      )
      return
    }

    ejecutando.current = true
    setProcesando(true)
    setErrorText('')

    try {
      await onToggleEstado(actual.id)
      setRolPendiente(null)
    } catch (error) {
      setErrorText(
        error.message || 'No se pudo cambiar el estado del rol.'
      )
    } finally {
      ejecutando.current = false
      setProcesando(false)
    }
  }

  return (
    <>
      <TableContainer sx={{ width: '100%', overflowX: 'auto', minHeight: 300 }}>
        <Table
          size="small"
          aria-label="Listado de roles"
          sx={{ minWidth: 560 }}
        >
          <TableHead>
            <TableRow>
              {columnas.map(({ nombre, align }) => (
                <TableCell key={nombre} align={align} sx={headCellSx}>
                  {nombre}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Indicadores de carga */}
            {loading && Array.from({ length: 6 }, (_, index) => (
              <TableRow key={`loading-${index}`}>
                {columnas.map(({ nombre }) => (
                  <TableCell key={nombre} sx={cellSx}>
                    <Skeleton variant="rounded" height={28} width="80%" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {/* Estado vacío */}
            {!loading && !roles.length && (
              <TableRow>
                <TableCell colSpan={4} sx={{ py: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.secondary',
                    }}
                  >
                    <SearchX size={30} />
                    <Typography fontWeight={600} fontSize={14}>
                      No se encontraron roles
                    </Typography>
                    <Typography variant="caption">
                      Intenta realizar otra búsqueda.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {!loading && roles.map(rol => {
              const protegido = esRolSistema(rol)
              const esGerente = rol.id === GERENTE_ID
              const activo = rol.estado === 'Activo'
              const eliminable = esEliminable(rol)
              const estadoPermitido = puedeCambiarEstado(rol)

              const motivoEstado = esGerente
                ? 'El rol Gerente debe permanecer activo.'
                : !estadoPermitido
                  ? 'No se puede desactivar mientras tenga usuarios activos asignados o sus asignaciones no estén confirmadas.'
                  : activo ? 'Desactivar rol' : 'Activar rol'

              const motivoEliminar = protegido
                ? 'Este rol no se puede eliminar.'
                : !eliminable
                  ? 'Tiene usuarios asignados o no se han confirmado sus asignaciones.'
                  : 'Eliminar rol'

              return (
                <TableRow
                  key={rol.id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  {/* Nombre del rol */}
                  <TableCell sx={cellSx}>
                    <Typography
                      fontSize={13}
                      fontWeight={600}
                      sx={{ overflowWrap: 'anywhere' }}
                    >
                      {rol.nombre}
                    </Typography>
                  </TableCell>

                  {/* Usuarios asociados */}
                  <TableCell sx={cellSx} align="center">
                    <Tooltip
                      title={
                        rol.usuariosAsignados == null ||
                          rol.usuariosActivos == null
                          ? 'Asignaciones no disponibles'
                          : `${rol.usuariosActivos} activos y ${rol.usuariosAsignados - rol.usuariosActivos
                          } inactivos`
                      }
                    >
                      <Typography component="span" fontSize={13}>
                        {rol.usuariosAsignados ?? '—'}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  {/* Estado del rol */}
                  <TableCell sx={cellSx}>
                    <EstadoSwitch
                      activo={activo}
                      nombre={rol.nombre}
                      disabled={ocupado || !estadoPermitido}
                      motivo={motivoEstado}
                      onChange={() => solicitarCambio(rol)}
                    />
                  </TableCell>

                  {/* Acciones disponibles */}
                  <TableCell sx={cellSx} align="right">
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 0.25,
                      }}
                    >
                      <Accion
                        titulo="Ver detalle"
                        icono={Eye}
                        disabled={ocupado}
                        onClick={() => onVer(rol)}
                      />

                      <Accion
                        titulo={esGerente
                          ? 'El Gerente no se puede modificar.'
                          : 'Editar rol'}
                        icono={Pencil}
                        disabled={ocupado || esGerente}
                        onClick={() => onEditar(rol)}
                      />

                      <Accion
                        titulo={motivoEliminar}
                        icono={Trash2}
                        color="error.main"
                        disabled={ocupado || !eliminable}
                        onClick={() => onEliminar(rol)}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmación de cambio de estado */}
      <Dialog
        open={Boolean(rolPendiente)}
        onClose={() => { }}
        maxWidth="xs"
        fullWidth
        aria-labelledby="estado-rol-title"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle id="estado-rol-title" sx={{ fontWeight: 700 }}>
          ¿Deseas {accion.toLowerCase()} este rol?
        </DialogTitle>

        <DialogContent>
          <Typography fontSize={13.5} sx={{ mb: 2 }}>
            El rol <strong>{rolPendiente?.nombre}</strong>
            {' '}cambiará su estado a{' '}
            <Typography
              component="span"
              fontSize="inherit"
              fontWeight={600}
              color={activando ? 'success.main' : 'text.secondary'}
            >
              {activando ? 'Activo' : 'Inactivo'}
            </Typography>.
          </Typography>

          <Alert
            severity={activando ? 'info' : 'warning'}
            variant="outlined"
            sx={{ fontSize: 12.5 }}
          >
            {activando
              ? 'El rol estará disponible para nuevas asignaciones y permitirá reactivar los usuarios asociados.'
              : 'El rol no podrá asignarse a nuevos usuarios ni permitirá reactivar usuarios asociados. Los registros existentes se conservarán.'}
          </Alert>

          {errorText && (
            <Alert severity="error" sx={{ mt: 1.5 }}>
              {errorText}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            color="inherit"
            onClick={cancelarCambio}
            disabled={ocupado}
            autoFocus
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color={activando ? 'primary' : 'warning'}
            onClick={confirmarCambio}
            disabled={ocupado}
            startIcon={procesando
              ? <CircularProgress size={16} color="inherit" />
              : undefined}
          >
            {procesando ? 'Procesando...' : `${accion} rol`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
