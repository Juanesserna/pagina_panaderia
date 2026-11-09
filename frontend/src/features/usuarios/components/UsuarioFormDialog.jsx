import { useEffect, useMemo, useRef, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material'

import {
  MailOutlined as MailOutlinedIcon,
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material'

import { BRAND } from '@shared/utils/colors'
import { ESTADOS } from '../services/usuariosService'
import { fetchRoles } from '../../roles/services/rolesService'

const EMPTY_FORM = {
  email: '',
  id_rol: '',
  estado: 'Activo',
  password: '',
  confirmPassword: '',
}

const CAMPOS = Object.keys(EMPTY_FORM)
const CAMPOS_EDICION = ['email', 'id_rol', 'estado']

const inputSx = {
  '& .MuiOutlinedInput-root': { bgcolor: 'action.hover', borderRadius: 2 },
}

function FieldLabel({ children }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        color: 'text.secondary',
        textTransform: 'uppercase',
        mb: 0.5,
      }}
    >
      {children}
    </Typography>
  )
}

const validadores = {
  email: (v) =>
    !v
      ? 'El correo electrónico es obligatorio.'
      : v.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
        ? 'Ingresa un correo electrónico válido.'
        : '',

  id_rol: (v, _form, roles) =>
    !v
      ? 'Debes seleccionar un rol.'
      : !roles.some((rol) => rol.id === Number(v))
        ? 'Selecciona un rol disponible.'
        : '',

  estado: (v) => (ESTADOS.includes(v) ? '' : 'Selecciona un estado válido.'),

  password: (_v, form, _roles, esCreacion) =>
    !esCreacion
      ? ''
      : !form.password
        ? 'La contraseña es obligatoria.'
        : form.password.length < 6
          ? 'La contraseña debe tener mínimo 6 caracteres.'
          : '',

  confirmPassword: (_v, form, _roles, esCreacion) =>
    !esCreacion
      ? ''
      : !form.confirmPassword
        ? 'Debes confirmar la contraseña.'
        : form.confirmPassword !== form.password
          ? 'Las contraseñas no coinciden.'
          : '',
}

function validarCampo(campo, form, roles, esCreacion) {
  const valor = String(form[campo] ?? '').trim()
  return validadores[campo]?.(valor, form, roles, esCreacion) ?? ''
}

export default function UsuarioFormDialog({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
  onError,
  submitting = false,
}) {
  const esCreacion = mode === 'create'

  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [rolesDisponibles, setRolesDisponibles] = useState([])
  const [confirmarSalida, setConfirmarSalida] = useState(false)

  const initialFormRef = useRef(EMPTY_FORM)
  const fieldRefs = useRef({})

  const rolId = Number(form.id_rol)

  // Cargar los roles registrados.
  useEffect(() => {
    if (!open) return

    let activo = true

    fetchRoles()
      .then((roles) => {
        if (activo) setRolesDisponibles(Array.isArray(roles) ? roles : [])
      })
      .catch(() => {
        if (activo) onError?.('No se pudieron cargar los roles disponibles.')
      })

    return () => {
      activo = false
    }
  }, [open, onError])

  // Preparar los datos iniciales.
  useEffect(() => {
    if (!open) return

    const datosIniciales = esCreacion
      ? { ...EMPTY_FORM }
      : {
          ...EMPTY_FORM,
          email: initialData?.email ?? '',
          id_rol: initialData?.id_rol ? String(initialData.id_rol) : '',
          estado: initialData?.estado ?? 'Activo',
        }

    setForm(datosIniciales)
    initialFormRef.current = datosIniciales
    setTouched({})
    setShowPassword(false)
    setConfirmarSalida(false)
  }, [open, esCreacion, initialData])

  const errores = useMemo(
    () =>
      Object.fromEntries(
        CAMPOS.map((c) => [
          c,
          validarCampo(c, form, rolesDisponibles, esCreacion),
        ])
      ),
    [form, rolesDisponibles, esCreacion]
  )

  const camposValidar = esCreacion ? CAMPOS : CAMPOS_EDICION
  const formularioValido = camposValidar.every((c) => !errores[c])
  const formularioModificado =
    JSON.stringify(form) !== JSON.stringify(initialFormRef.current)

  const cambiarCampo = (campo) => (event) => {
    const valor = event.target.value
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  const marcarCampo = (campo) =>
    setTouched((prev) => ({ ...prev, [campo]: true }))

  const obtenerError = (campo) => (touched[campo] ? errores[campo] : '')

  // Evitar avanzar con TAB si el campo actual es inválido.
  const controlarTabulacion = (campo) => (event) => {
    if (event.key !== 'Tab') return

    if (validarCampo(campo, form, rolesDisponibles, esCreacion)) {
      event.preventDefault()
      marcarCampo(campo)
      fieldRefs.current[campo]?.focus()
    }
  }

  const handleSubmit = () => {
    if (submitting) return

    setTouched(Object.fromEntries(camposValidar.map((c) => [c, true])))

    if (!formularioValido) {
      const primerInvalido = camposValidar.find((c) => errores[c])
      if (primerInvalido) fieldRefs.current[primerInvalido]?.focus()

      onError?.(
        'Completa los campos obligatorios y corrige los datos ingresados.'
      )
      return
    }

    const datos = {
      email: form.email.trim().toLowerCase(),
      id_rol: rolId,
      estado: form.estado,
    }

    if (esCreacion) datos.password = form.password

    onSubmit(datos)
  }

  const handleCancelar = () => {
    if (submitting) return

    if (formularioModificado) {
      setConfirmarSalida(true)
      return
    }

    onClose()
  }

  const salirSinGuardar = () => {
    setConfirmarSalida(false)
    onClose()
  }

  // Constructor de campos.
  const campo = (
    nombre,
    etiqueta,
    { Icono, endAdornment, selectProps, children, ...rest } = {}
  ) => (
    <Box key={nombre}>
      <FieldLabel>{etiqueta}</FieldLabel>

      <TextField
        inputRef={(el) => {
          fieldRefs.current[nombre] = el
        }}
        value={form[nombre]}
        onChange={cambiarCampo(nombre)}
        onBlur={() => marcarCampo(nombre)}
        onKeyDown={controlarTabulacion(nombre)}
        error={Boolean(obtenerError(nombre))}
        helperText={obtenerError(nombre)}
        fullWidth
        sx={inputSx}
        slotProps={{
          input: Icono
            ? {
                startAdornment: (
                  <InputAdornment position="start">
                    <Icono fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment,
              }
            : undefined,
          select: selectProps,
        }}
        {...rest}
      >
        {children}
      </TextField>
    </Box>
  )

  const rolesVisibles = rolesDisponibles.filter(
    (rol) => rol.estado === 'Activo' || rol.id === rolId
  )

  const propsPassword = {
    Icono: LockOutlinedIcon,
    type: showPassword ? 'text' : 'password',
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {}}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
          }
        }}
        fullWidth
        maxWidth="sm"
        disableEscapeKeyDown
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            {esCreacion ? 'Nuevo usuario' : 'Editar usuario'}
          </Typography>

          <Typography
            sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 400 }}
          >
            {esCreacion
              ? 'Registra una nueva cuenta de acceso al sistema.'
              : 'Actualiza el correo, rol y estado de la cuenta.'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            {campo('email', 'Correo electrónico', {
              Icono: MailOutlinedIcon,
              placeholder: 'usuario@alhorno.mx',
              type: 'email',
            })}

            {campo('id_rol', 'Rol asignado', {
              select: true,
              selectProps: {
                displayEmpty: true,
                renderValue: (selected) =>
                  rolesDisponibles.find((r) => r.id === Number(selected))
                    ?.nombre || (
                    <Box sx={{ color: 'text.disabled' }}>
                      Seleccionar rol...
                    </Box>
                  ),
              },
              children: rolesVisibles.map((rol) => (
                <MenuItem key={rol.id} value={String(rol.id)}>
                  {rol.nombre}
                </MenuItem>
              )),
            })}

            {campo('estado', esCreacion ? 'Estado inicial' : 'Estado', {
              select: true,
              children: ESTADOS.map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              )),
            })}

            {esCreacion && (
              <>
                {campo('password', 'Contraseña', {
                  ...propsPassword,
                  placeholder: 'Mínimo 6 caracteres',
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                })}

                {campo('confirmPassword', 'Confirmar contraseña', {
                  ...propsPassword,
                  placeholder: 'Repetir contraseña',
                })}
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCancelar} disabled={submitting} color="inherit">
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            startIcon={esCreacion ? <AddIcon /> : <EditIcon />}
            sx={{
              bgcolor: BRAND.orange,
              '&:hover': { bgcolor: BRAND.orangeDark },
            }}
          >
            {submitting
              ? 'Guardando...'
              : esCreacion
                ? 'Guardar usuario'
                : 'Guardar cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmarSalida}
        onClose={() => {}}
        disableEscapeKeyDown
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 17 }}>
          ¿Descartar los cambios?
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary" fontSize={14}>
            Si sales ahora, los cambios realizados no se guardarán.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmarSalida(false)} color="inherit">
            Seguir editando
          </Button>

          <Button onClick={salirSinGuardar} variant="contained" color="error">
            Salir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}