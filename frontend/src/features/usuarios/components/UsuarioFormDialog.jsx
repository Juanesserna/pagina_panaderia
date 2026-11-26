import { useEffect, useRef, useState } from 'react'
import {
  Alert, Autocomplete, Box, Button,
  CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Divider,
  MenuItem, Stack, TextField, Typography,
} from '@mui/material'

import {
  UserPlus, Pencil,
  AlertTriangle, CheckCircle2,
} from 'lucide-react'

import {
  ESTADOS, esRolCompatible, esUnicoGerente,
  fetchPerfilesDisponibles,
} from '../services/usuariosService'

import { fetchRoles } from '../../roles/services/rolesService'

const EMPTY_FORM = {
  tipoPerfil: '',
  idPerfil: '',
  email: '',
  id_rol: '',
  estado: 'Activo',
}

const TIPOS_PERFIL = ['Cliente', 'Empleado']
const CAMPOS = Object.keys(EMPTY_FORM)
const PERFILES_VACIOS = { clientes: [], empleados: [] }

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px', fontSize: 13, minHeight: 40,
    border: 0, boxShadow: 'none', overflow: 'hidden',
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: '8px', borderColor: 'divider', borderWidth: 1,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main', borderWidth: 1,
    },
    '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: 'error.main' },
    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
    '&.Mui-disabled': { opacity: 0.65 },
    '& .MuiInputBase-input': {
      border: '0 !important', borderRadius: '0 !important',
      backgroundColor: 'transparent', boxShadow: 'none',
    },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px transparent inset',
      WebkitTextFillColor: 'currentColor',
      transition: 'background-color 9999s ease-out',
    },
  },
  '& .MuiFormHelperText-root': { mx: 0.5, mt: 0.5, fontSize: 11 },
}

const filaSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 1.5,
}

function obtenerValores(usuario) {
  return {
    ...EMPTY_FORM,
    tipoPerfil: usuario?.tipoPerfil ?? '',
    idPerfil: String(usuario?.id_cliente ?? usuario?.id_empleado ?? ''),
    email: usuario?.email ?? '',
    id_rol: String(usuario?.id_rol ?? ''),
    estado: usuario?.estado ?? 'Activo',
  }
}

function normalizarEmail(email) {
  return email.trim().toLowerCase()
}

function snapshot(form) {
  return JSON.stringify({
    ...form,
    email: normalizarEmail(form.email),
  })
}

// Componentes visuales reutilizables.
function Encabezado({ icon: Icon, titulo, descripcion, color = 'primary.main' }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Box sx={{
        width: 44, height: 44, flexShrink: 0,
        display: 'grid', placeItems: 'center',
        borderRadius: 2, bgcolor: 'action.hover', color,
      }}>
        <Icon size={23} />
      </Box>
      <Box>
        <Typography sx={{ fontSize: 17, fontWeight: 700 }}>
          {titulo}
        </Typography>
        {descripcion && (
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            {descripcion}
          </Typography>
        )}
      </Box>
    </Stack>
  )
}

function Seccion({ children }) {
  return (
    <Typography sx={{
      fontSize: 11, fontWeight: 700,
      letterSpacing: 0.7, color: 'text.secondary',
      textTransform: 'uppercase',
    }}>
      {children}
    </Typography>
  )
}

function Campo({ nombre, etiqueta, children }) {
  return (
    <Box data-campo={nombre} sx={{ minWidth: 0 }}>
      <Typography
        id={`usuario-${nombre}-label`}
        component="div"
        sx={{ fontSize: 12, fontWeight: 600, mb: 0.7 }}
      >
        {etiqueta}
        <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
          *
        </Box>
      </Typography>
      {children}
    </Box>
  )
}

function Selector({ opciones, placeholder, ...props }) {
  return (
    <TextField
      select
      fullWidth
      size="small"
      sx={inputSx}
      {...props}
      slotProps={{
        select: {
          displayEmpty: true,
          SelectDisplayProps: {
            'aria-labelledby': `usuario-${props.name}-label`,
            'aria-required': true,
          },
          renderValue: (valor) =>
            opciones.find((opcion) => opcion.value === valor)?.label ||
            <Box component="span" sx={{ color: 'text.secondary' }}>
              {placeholder}
            </Box>,
        },
      }}
    >
      {opciones.map(({ value, label, disabled }) => (
        <MenuItem key={value} value={value} disabled={disabled}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default function UsuarioFormDialog({
  open, mode, initialData, onClose,
  onSubmit, onError, submitting = false,
}) {
  const esCreacion = mode === 'create'

  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})
  const [roles, setRoles] = useState([])
  const [perfiles, setPerfiles] = useState(PERFILES_VACIOS)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [confirmacion, setConfirmacion] = useState(null)

  const inicial = useRef(EMPTY_FORM)
  const enviando = useRef(false)
  const formularioRef = useRef(null)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  // Inicializar formulario y consultar datos actualizados.
  useEffect(() => {
    if (!open) return

    let vigente = true
    const valores = esCreacion
      ? { ...EMPTY_FORM }
      : obtenerValores(initialData)

    inicial.current = valores
    setForm(valores)
    setTouched({})
    setConfirmacion(null)
    setCargando(true)
    setErrorCarga('')
    setRoles([])
    setPerfiles(PERFILES_VACIOS)

    Promise.all([
      fetchRoles(),
      esCreacion
        ? fetchPerfilesDisponibles()
        : Promise.resolve(PERFILES_VACIOS),
    ])
      .then(([rolesActuales, perfilesActuales]) => {
        if (!vigente) return
        setRoles(rolesActuales)
        setPerfiles(perfilesActuales)
      })
      .catch(() => {
        if (!vigente) return
        const mensaje = 'No se pudieron cargar los roles y perfiles.'
        setErrorCarga(mensaje)
        onErrorRef.current?.(mensaje)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => { vigente = false }
  }, [open, esCreacion, initialData])

  const ocupado = submitting || cargando
  const deshabilitado = ocupado || Boolean(errorCarga)
  const protegido = !esCreacion && Boolean(initialData) && esUnicoGerente(initialData)

  const perfilesDisponibles =
    form.tipoPerfil === 'Cliente' ? perfiles.clientes :
    form.tipoPerfil === 'Empleado' ? perfiles.empleados : []

  const perfilSeleccionado = esCreacion
    ? perfilesDisponibles.find(p => String(p.id) === form.idPerfil) ?? null
    : initialData?.cliente ?? initialData?.empleado ?? null

  const rolesDisponibles = roles.filter(rol =>
    esRolCompatible(rol.id, form.tipoPerfil) &&
    (rol.estado === 'Activo' ||
      (!esCreacion && rol.id === initialData?.id_rol))
  )

  const rolSeleccionado = rolesDisponibles.find(
    rol => String(rol.id) === form.id_rol
  )

  const rolInactivo = rolSeleccionado?.estado === 'Inactivo'
  const hayCambios = snapshot(form) !== snapshot(inicial.current)
  const email = normalizarEmail(form.email)

  // Validaciones centralizadas.
  const errores = {
    tipoPerfil: !TIPOS_PERFIL.includes(form.tipoPerfil)
      ? 'Selecciona un tipo de perfil.' : '',

    idPerfil: !perfilSeleccionado
      ? 'Selecciona un perfil válido.' : '',

    email: !email
      ? 'El correo electrónico es obligatorio.'
      : email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
        ? 'Ingresa un correo electrónico válido.' : '',

    id_rol: !rolSeleccionado
      ? 'Selecciona un rol disponible.'
      : protegido && Number(form.id_rol) !== initialData?.id_rol
        ? 'No puedes cambiar el rol del único Gerente activo.' : '',

    estado: !ESTADOS.includes(form.estado)
      ? 'Selecciona un estado válido.'
      : form.estado === 'Activo' && rolInactivo
        ? 'No puedes activar una cuenta con un rol inactivo.'
        : protegido && form.estado !== 'Activo'
          ? 'No puedes desactivar al único Gerente activo.' : '',
  }

  function cambiar(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }))
  }

  function marcar(campo) {
    setTouched(prev => ({ ...prev, [campo]: true }))
  }

  function cambiarTipo(tipoPerfil) {
    setForm(prev => ({
      ...prev, tipoPerfil, idPerfil: '', id_rol: '',
    }))
    setTouched(prev => ({
      ...prev, tipoPerfil: true, idPerfil: false, id_rol: false,
    }))
  }

  function cambiarRol(id_rol) {
    const rol = rolesDisponibles.find(r => String(r.id) === id_rol)

    setForm(prev => ({
      ...prev, id_rol,
      estado: rol?.estado === 'Inactivo' ? 'Inactivo' : prev.estado,
    }))
  }

  // Validar TAB y Shift + TAB sin interferir con menús abiertos.
  function validarTab(event, campo) {
    if (event.key !== 'Tab' || deshabilitado) return
    if (event.target.getAttribute('aria-expanded') === 'true') return

    marcar(campo)

    if (errores[campo]) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  function propsCampo(campo) {
    const mensaje = touched[campo] ? errores[campo] : ''

    return {
      name: campo,
      error: Boolean(mensaje),
      helperText: mensaje,
      onBlur: () => marcar(campo),
      onKeyDown: event => validarTab(event, campo),
    }
  }

  function enfocarError() {
    requestAnimationFrame(() => {
      for (const campo of CAMPOS.filter(c => errores[c])) {
        const control = formularioRef.current
          ?.querySelector(`[data-campo="${campo}"]`)
          ?.querySelector(
            '[role="combobox"]:not([aria-disabled="true"]):not(:disabled), input:not(:disabled):not([type="hidden"])'
          )

        if (control) {
          control.focus()
          break
        }
      }
    })
  }

  function validarFormulario() {
    setTouched(Object.fromEntries(CAMPOS.map(c => [c, true])))

    if (Object.values(errores).some(Boolean)) {
      onError?.('Completa los campos obligatorios y corrige los datos ingresados.')
      enfocarError()
      return false
    }

    return true
  }

  async function guardar() {
    if (deshabilitado || enviando.current) return
    if (!validarFormulario()) return

    const datos = {
      email,
      id_rol: Number(form.id_rol),
      estado: form.estado,
      ...(esCreacion && {
        id_cliente: form.tipoPerfil === 'Cliente' ? Number(form.idPerfil) : null,
        id_empleado: form.tipoPerfil === 'Empleado' ? Number(form.idPerfil) : null,
      }),
    }

    enviando.current = true
    setConfirmacion(null)

    try {
      await onSubmit(datos)
    } catch (error) {
      onError?.(error.message || 'No se pudo guardar el usuario.')
    } finally {
      enviando.current = false
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (deshabilitado || enviando.current || (!esCreacion && !hayCambios)) return
    if (esCreacion) guardar()
    else if (validarFormulario()) setConfirmacion('guardar')
  }

  function cancelar() {
    if (submitting || enviando.current) return
    if (hayCambios) setConfirmacion('salir')
    else onClose()
  }

  function confirmarAccion() {
    const accion = confirmacion
    setConfirmacion(null)

    if (accion === 'salir') onClose()
    else if (accion === 'restaurar') {
      setForm({ ...inicial.current })
      setTouched({})
    } else guardar()
  }

  const esAdvertencia = confirmacion !== 'guardar'

  const textos = {
    salir: {
      titulo: '¿Deseas abandonar el formulario?',
      mensaje: 'Perderás los cambios que no hayas guardado.',
      boton: 'Salir del formulario',
    },
    restaurar: {
      titulo: esCreacion ? '¿Limpiar formulario?' : '¿Restaurar los datos?',
      mensaje: esCreacion
        ? 'Se eliminarán los datos ingresados.'
        : 'Se recuperarán los valores originales de la cuenta.',
      boton: esCreacion ? 'Limpiar' : 'Restaurar',
    },
    guardar: {
      titulo: '¿Guardar los cambios?',
      mensaje: 'Los cambios en el rol y estado pueden afectar el acceso del usuario.',
      boton: 'Guardar cambios',
    },
  }

  const textoConfirmacion = textos[confirmacion]

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === 'escapeKeyDown' && !confirmacion) cancelar()
        }}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <Box
          ref={formularioRef}
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          <DialogTitle sx={{ px: 2.5, py: 1.5 }}>
            <Encabezado
              icon={esCreacion ? UserPlus : Pencil}
              titulo={esCreacion ? 'Nuevo usuario' : 'Editar usuario'}
              descripcion={esCreacion
                ? 'Registra una cuenta de acceso al sistema.'
                : 'Actualiza la información de la cuenta.'}
            />
          </DialogTitle>
          <Divider />

          <DialogContent sx={{ px: 2.5, py: 1.5 }}>
            <Stack spacing={1.2}>
              {errorCarga && <Alert severity="error">{errorCarga}</Alert>}

              <Seccion>Información del perfil</Seccion>

              {esCreacion && (
                <>
                  <Box sx={{ ...filaSx, gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' } }}>
                    <Campo nombre="tipoPerfil" etiqueta="Tipo de perfil">
                      <Selector
                        {...propsCampo('tipoPerfil')}
                        value={form.tipoPerfil}
                        placeholder="Seleccionar tipo de perfil"
                        opciones={TIPOS_PERFIL.map(value => ({ value, label: value }))}
                        onChange={e => cambiarTipo(e.target.value)}
                        disabled={deshabilitado}
                      />
                    </Campo>
                    <Campo nombre="idPerfil" etiqueta="Perfil asociado">
                      <Autocomplete
                        options={perfilesDisponibles}
                        value={perfilSeleccionado}
                        loading={cargando}
                        disabled={deshabilitado || !form.tipoPerfil}
                        getOptionLabel={p => `${p.nombre} — ${p.documento}`}
                        isOptionEqualToValue={(a, b) => a.id === b.id}
                        onChange={(_, perfil) => {
                          cambiar('idPerfil', String(perfil?.id ?? ''))
                          marcar('idPerfil')
                        }}
                        noOptionsText="No hay perfiles disponibles"
                        loadingText="Cargando perfiles..."
                        renderInput={params => (
                          <TextField
                            {...params}
                            {...propsCampo('idPerfil')}
                            size="small"
                            required
                            placeholder={form.tipoPerfil
                              ? 'Buscar por nombre o documento'
                              : 'Selecciona primero el tipo de perfil'}
                            sx={inputSx}
                          />
                        )}
                      />
                    </Campo>
                  </Box>
                  {perfilSeleccionado && (
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                      {perfilSeleccionado.tipoDocumento} · {perfilSeleccionado.documento}
                    </Typography>
                  )}

                  {!cargando && form.tipoPerfil && !perfilesDisponibles.length && (
                    <Alert severity="info">
                      No hay perfiles de este tipo sin cuenta de acceso.
                    </Alert>
                  )}
                </>
              )}

              {!esCreacion && perfilSeleccionado && (
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{perfilSeleccionado.nombre}</Typography>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                    {form.tipoPerfil} · {perfilSeleccionado.tipoDocumento} · {perfilSeleccionado.documento}
                  </Typography>
                </Box>
              )}

              {!esCreacion && !perfilSeleccionado && (
                <Alert severity="warning">
                  Esta cuenta no tiene un perfil asociado válido.
                </Alert>
              )}
              <Divider />
              <Seccion>Información de la cuenta</Seccion>
              <Campo nombre="email" etiqueta="Correo electrónico">
                <TextField
                  {...propsCampo('email')}
                  fullWidth
                  required
                  size="small"
                  type="email"
                  placeholder="usuario@alhorno.mx"
                  value={form.email}
                  disabled={deshabilitado}
                  onChange={e => cambiar('email', e.target.value)}
                  onBlur={() => {
                    cambiar('email', email)
                    marcar('email')
                  }}
                  slotProps={{
                    htmlInput: {
                      maxLength: 120,
                      'aria-labelledby': 'usuario-email-label',
                    },
                  }}
                  sx={inputSx}
                />
              </Campo>
              <Box sx={filaSx}>
                <Campo nombre="id_rol" etiqueta="Rol asignado">
                  <Selector
                    {...propsCampo('id_rol')}
                    value={rolSeleccionado ? form.id_rol : ''}
                    placeholder="Seleccionar rol"
                    opciones={rolesDisponibles.map(rol => ({
                      value: String(rol.id),
                      label: rol.nombre + (rol.estado === 'Inactivo' ? ' (Inactivo)' : ''),
                    }))}
                    onChange={e => cambiarRol(e.target.value)}
                    disabled={deshabilitado || protegido || !form.tipoPerfil}
                  />
                </Campo>
                <Campo nombre="estado" etiqueta={esCreacion ? 'Estado inicial' : 'Estado'}>
                  <Selector
                    {...propsCampo('estado')}
                    value={form.estado}
                    opciones={ESTADOS.map(value => ({
                      value, label: value,
                      disabled: value === 'Activo' && rolInactivo,
                    }))}
                    onChange={e => cambiar('estado', e.target.value)}
                    disabled={deshabilitado || protegido}
                  />
                </Campo>
              </Box>

              {protegido && (
                <Alert severity="info">
                  El rol y estado del único Gerente activo están protegidos.
                </Alert>
              )}

              {rolInactivo && (
                <Alert severity="warning">
                  La cuenta debe permanecer inactiva mientras su rol esté inactivo.
                </Alert>
              )}
            </Stack>
          </DialogContent>
          <Divider />

          <DialogActions sx={{ px: 2.5, py: 1.3, flexWrap: 'wrap', gap: 1 }}>
            <Button
              color="inherit"
              disabled={ocupado || !hayCambios}
              onClick={() => setConfirmacion('restaurar')}
              sx={{ mr: 'auto' }}
            >
              {esCreacion ? 'Limpiar' : 'Restaurar'}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={cancelar}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={deshabilitado || (!esCreacion && !hayCambios)}
              startIcon={submitting
                ? <CircularProgress size={16} color="inherit" />
                : undefined}
            >
              {submitting ? 'Guardando...' :
                esCreacion ? 'Guardar usuario' : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Confirmación reutilizada para guardar, limpiar y salir. */}
      <Dialog
        open={Boolean(confirmacion)}
        onClose={(_, reason) => {
          if (reason === 'escapeKeyDown') setConfirmacion(null)
        }}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle>
          <Encabezado
            icon={esAdvertencia ? AlertTriangle : CheckCircle2}
            titulo={textoConfirmacion?.titulo}
            color={esAdvertencia ? 'warning.main' : 'primary.main'}
          />
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            {textoConfirmacion?.mensaje}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setConfirmacion(null)}
            autoFocus
          >
            {esAdvertencia ? 'Permanecer aquí' : 'Cancelar'}
          </Button>
          <Button
            variant="contained"
            color={esAdvertencia ? 'warning' : 'primary'}
            onClick={confirmarAccion}
          >
            {textoConfirmacion?.boton}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}