import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material'
import {
  Shield,
  Lock,
  Plus,
  Pencil,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import {
  ESTADOS,
  MODULOS,
  PRIVILEGIOS_POR_MODULO,
  PRIVILEGIOS_PROTEGIDOS_GERENTE,
  GERENTE_ID,
  esRolSistema,
  normalizarNombreRol,
  validarNombreRol,
} from '../services/rolesService'
import ModulosGrid from './ModulosGrid'

// Obtiene únicamente los privilegios reconocidos por el sistema.
function obtenerPermisos(privilegios = {}) {
  return Object.fromEntries(
    MODULOS.map(modulo => [
      modulo,
      PRIVILEGIOS_POR_MODULO[modulo]
        .map(({ id }) => id)
        .filter(id => privilegios[modulo]?.includes(id)),
    ]).filter(([, ids]) => ids.length > 0)
  )
}

function obtenerValores(rol) {
  return {
    nombre: rol?.nombre ?? '',
    estado: rol?.estado ?? 'Activo',
    privilegios: obtenerPermisos(rol?.privilegios),
  }
}

function crearSnapshot(datos) {
  return JSON.stringify({
    nombre: normalizarNombreRol(datos.nombre),
    estado: datos.estado,
    privilegios: obtenerPermisos(datos.privilegios),
  })
}

const campoSx = {
  '& .MuiInputBase-root': {
    minHeight: 40,
    fontSize: 13,
  },
  '& .MuiFormHelperText-root': {
    mx: 0,
  },
}

function Confirmar({
  open,
  tipo,
  onCancel,
  onConfirm,
  submitting,
}) {
  const esSalida = tipo === 'salir'
  const esRestaurar = tipo === 'restaurar'
  const esAdvertencia = esSalida || esRestaurar

  const titulo = esSalida
    ? '¿Deseas abandonar el formulario?'
    : esRestaurar
      ? '¿Deseas descartar los cambios?'
      : '¿Deseas guardar los cambios?'

  const mensaje = esSalida
    ? 'Si sales del formulario, perderás la información que has ingresado.'
    : esRestaurar
      ? 'Se descartarán los cambios realizados en el formulario.'
      : 'Los cambios en los privilegios afectarán a los usuarios que tengan asignado este rol. Si lo desactivas, no estará disponible para nuevas asignaciones ni para reactivar usuarios asociados.'

  const Icono = esAdvertencia ? AlertTriangle : CheckCircle2

  return (
    <Dialog
      open={open}
      onClose={() => { }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 42,
              height: 42,
              flexShrink: 0,
              borderRadius: 2,
              bgcolor: esAdvertencia
                ? 'warning.main'
                : 'primary.main',
              color: esAdvertencia
                ? 'warning.contrastText'
                : 'primary.contrastText',
            }}
          >
            <Icono size={22} />
          </Box>

          <Typography fontWeight={700}>
            {titulo}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {mensaje}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        {esAdvertencia ? (
          <>
            <Button
              color="warning"
              variant="outlined"
              onClick={onConfirm}
              disabled={submitting}
            >
              {esSalida ? 'Salir del formulario' : 'Descartar cambios'}
            </Button>

            <Button
              variant="contained"
              onClick={onCancel}
              disabled={submitting}
              autoFocus
            >
              Permanecer aquí
            </Button>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={onCancel}
              disabled={submitting}
            >
              Seguir editando
            </Button>

            <Button
              variant="contained"
              onClick={onConfirm}
              disabled={submitting}
            >
              Confirmar cambios
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default function RoleFormDialog({
  open,
  mode = 'create',
  initialData,
  onClose,
  onSubmit,
  onError,
  submitting = false,
}) {
  const isCreate = mode === 'create'
  const protegido = !isCreate && esRolSistema(initialData)
  const esGerente = !isCreate && Number(initialData?.id) === GERENTE_ID
  const tieneUsuariosActivos = (initialData?.usuariosActivos ?? 0) > 0

  const [datos, setDatos] = useState(() => obtenerValores())
  const [touched, setTouched] = useState(false)
  const [intentoGuardar, setIntentoGuardar] = useState(false)
  const [confirmacion, setConfirmacion] = useState(null)

  const inicial = useRef(obtenerValores())
  const nombreRef = useRef(null)
  const enviando = useRef(false)

  useEffect(() => {
    if (!open) return

    const valores = obtenerValores(isCreate ? null : initialData)

    inicial.current = valores
    setDatos(valores)
    setTouched(false)
    setIntentoGuardar(false)
    setConfirmacion(null)
  }, [open, initialData, isCreate])

  const actualizar = (campo, valor) => {
    setDatos(prev => ({ ...prev, [campo]: valor }))
  }

  const permisos = obtenerPermisos(datos.privilegios)
  const modulos = Object.keys(permisos)

  const errorNombre = validarNombreRol(
    datos.nombre,
    isCreate ? null : initialData?.id
  )

  const hayCambios =
    crearSnapshot(datos) !== crearSnapshot(inicial.current)

  const errorPermisos = !modulos.length
    ? 'Selecciona al menos un privilegio.'
    : ''

  // Conserva los permisos esenciales incluso al deseleccionar todos.
  const cambiarPrivilegios = nuevos => {
    if (submitting) return

    const resultado = obtenerPermisos(nuevos)

    if (esGerente) {
      Object.entries(PRIVILEGIOS_PROTEGIDOS_GERENTE)
        .forEach(([modulo, ids]) => {
          resultado[modulo] = [
            ...new Set([
              ...(resultado[modulo] ?? []),
              ...ids,
            ]),
          ]
        })
    }

    actualizar('privilegios', resultado)
  }

  function validarFormulario() {
    setTouched(true)
    setIntentoGuardar(true)

    if (errorNombre) {
      onError?.(errorNombre)
      nombreRef.current?.focus()
      return false
    }

    if (errorPermisos) {
      onError?.(errorPermisos)
      return false
    }

    if (!ESTADOS.includes(datos.estado)) {
      onError?.('Selecciona un estado válido.')
      return false
    }

    if (esGerente) {
      onError?.('El rol Gerente no se puede modificar.')
      return false
    }

    if (
      protegido &&
      normalizarNombreRol(datos.nombre) !== initialData.nombre
    ) {
      onError?.('El nombre de este rol está protegido.')
      return false
    }

    if (
      esGerente &&
      Object.entries(PRIVILEGIOS_PROTEGIDOS_GERENTE)
        .some(([modulo, ids]) =>
          ids.some(id => !permisos[modulo]?.includes(id))
        )
    ) {
      onError?.('Los privilegios esenciales del Gerente están protegidos.')
      return false
    }

    return true
  }

  async function guardar() {
    if (submitting || enviando.current) return
    if (!validarFormulario()) return

    enviando.current = true
    setConfirmacion(null)

    try {
      await onSubmit({
        nombre: normalizarNombreRol(datos.nombre),
        estado: datos.estado,
        modulos,
        privilegios: permisos,
      })
    } finally {
      enviando.current = false
    }
  }

  function handleSubmit() {
    if (submitting || enviando.current) return
    if (!isCreate && !hayCambios) return
    if (!validarFormulario()) return

    if (isCreate) {
      guardar()
    } else {
      setConfirmacion('guardar')
    }
  }

  function handleCancel() {
    if (submitting || enviando.current) return

    if (hayCambios) {
      setConfirmacion('salir')
    } else {
      onClose()
    }
  }

  function restaurar() {
    setDatos(obtenerValores(inicial.current))
    setTouched(false)
    setIntentoGuardar(false)
    setConfirmacion(null)
  }

  function confirmarAccion() {
    if (submitting || enviando.current) return

    if (confirmacion === 'salir') {
      setConfirmacion(null)
      onClose()
    } else if (confirmacion === 'restaurar') {
      restaurar()
    } else {
      guardar()
    }
  }

  const IconoTitulo = isCreate ? Plus : Pencil

  return (
    <>
      <Dialog
        open={open}
        onClose={() => { }}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              width: '94vw',
              maxWidth: 1250,
              height: '88dvh',
              maxHeight: '88dvh',
              borderRadius: 3,
              overflow: 'hidden',
              m: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ px: 2.5, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 2,
                bgcolor: 'action.hover',
                color: 'primary.main',
              }}
            >
              <IconoTitulo size={21} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={700}>
                {isCreate ? 'Crear rol' : 'Editar rol'}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Configura la información y los permisos de acceso.
              </Typography>
            </Box>

            {protegido && (
              <Chip
                size="small"
                icon={<Shield size={15} />}
                label="Predeterminado"
                variant="outlined"
              />
            )}
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 2, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Información general */}
            <Box
              sx={{
                border: 1,
                borderColor: 'divider',
                borderTop: 3,
                borderTopColor: 'primary.main',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography fontWeight={600} fontSize={14} sx={{ mb: 2 }}>
                Información del rol
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 2fr 1fr',
                  },
                  gap: 2,
                  alignItems: 'start',
                }}
              >
                <TextField
                  label="Identificador"
                  value={isCreate ? 'Automático' : initialData?.id ?? ''}
                  disabled
                  size="small"
                  fullWidth
                  sx={campoSx}
                />

                <TextField
                  label="Nombre del rol"
                  required
                  inputRef={nombreRef}
                  value={datos.nombre}
                  onChange={e => actualizar('nombre', e.target.value)}
                  onBlur={() => {
                    actualizar('nombre', normalizarNombreRol(datos.nombre))
                    setTouched(true)
                  }}
                  disabled={protegido || submitting}
                  placeholder="Ej. Auxiliar administrativo"
                  error={touched && Boolean(errorNombre)}
                  helperText={
                    protegido
                      ? 'Nombre protegido por el sistema.'
                      : touched && errorNombre
                        ? errorNombre
                        : 'Entre 3 y 60 caracteres.'
                  }
                  slotProps={{
                    htmlInput: { maxLength: 60 },
                  }}
                  size="small"
                  fullWidth
                  sx={campoSx}
                />

                <TextField
                  select
                  label="Estado"
                  value={datos.estado}
                  onChange={e => actualizar('estado', e.target.value)}
                  disabled={esGerente || submitting}
                  size="small"
                  fullWidth
                  sx={campoSx}
                  helperText={
                    esGerente
                      ? 'El Gerente debe permanecer activo.'
                      : tieneUsuariosActivos
                        ? 'Tiene usuarios activos asignados.'
                        : !isCreate && initialData?.usuariosActivos == null
                          ? 'Asignaciones no confirmadas.'
                          : ''
                  }
                >
                  {ESTADOS.map(estado => (
                    <MenuItem
                      key={estado}
                      value={estado}
                      disabled={
                        estado === 'Inactivo' &&
                        (
                          esGerente ||
                          tieneUsuariosActivos ||
                          (!isCreate && initialData?.usuariosActivos == null)
                        )
                      }
                    >
                      {estado}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {protegido && (
              <Alert severity="info" icon={<Lock size={19} />}>
                {esGerente
                  ? 'El rol Gerente está protegido permanentemente.'
                  : 'El nombre de este rol está protegido. Puedes modificar sus privilegios y cambiar su estado según los usuarios asociados.'}
              </Alert>
            )}

            {intentoGuardar && errorPermisos && (
              <Alert severity="error">
                {errorPermisos}
              </Alert>
            )}

            <Box
              sx={{
                pointerEvents: submitting ? 'none' : 'auto',
                opacity: submitting ? 0.7 : 1,
              }}
              inert={submitting || undefined}
            >
              <ModulosGrid
                privilegios={datos.privilegios}
                onPrivilegiosChange={cambiarPrivilegios}
                privilegiosProtegidos={
                  esGerente ? PRIVILEGIOS_PROTEGIDOS_GERENTE : {}
                }
                disabled={submitting}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 2.5,
            py: 1.5,
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Button
            color="inherit"
            startIcon={<RotateCcw size={16} />}
            disabled={!hayCambios || submitting}
            onClick={() => setConfirmacion('restaurar')}
          >
            {isCreate ? 'Limpiar formulario' : 'Restaurar valores'}
          </Button>

          <Box sx={{ flex: 1 }} />

          <Button
            color="inherit"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || (!isCreate && !hayCambios)}

          >
            {submitting
              ? 'Guardando...'
              : isCreate
                ? 'Crear rol'
                : 'Guardar cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      <Confirmar
        open={Boolean(confirmacion)}
        tipo={confirmacion}
        onCancel={() => setConfirmacion(null)}
        onConfirm={confirmarAccion}
        submitting={submitting}
      />
    </>
  )
}
