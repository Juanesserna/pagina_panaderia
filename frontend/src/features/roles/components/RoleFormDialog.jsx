import { useEffect, useRef, useState } from 'react'
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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { ESTADOS, getNextRoleId } from '../services/rolesService'
import ModulosGrid from './ModulosGrid'

const crearSnapshot = (nombre, estado, modulos, privilegios) => {
  const ordenados = [...modulos].sort()

  return JSON.stringify({
    nombre: nombre.trim(),
    estado,
    modulos: ordenados,
    privilegios: Object.fromEntries(
      ordenados.map((modulo) => [
        modulo,
        [...(privilegios[modulo] ?? [])].sort(),
      ])
    ),
  })
}

const nombreValido = (nombre) =>
  nombre.trim().length >= 3 && /^[\p{L}\s]+$/u.test(nombre.trim())

const campoSx = {
  '& .MuiInputBase-root': { height: 38, fontSize: 13 },
  '& .MuiInputBase-input': { py: 1, px: 1.5 },
}

function Campo({ label, width, children }) {
  return (
    <Box sx={{ width, maxWidth: '100%' }}>
      <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      {children}
    </Box>
  )
}

function Confirmar({
  open,
  titulo,
  texto,
  textoConfirmar,
  colorConfirmar = 'primary',
  disabled,
  onCancel,
  onConfirm,
}) {
  return (
    <Dialog open={open} onClose={() => {}} disableEscapeKeyDown maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>{titulo}</DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {texto}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} color="inherit" disabled={disabled}>
          Seguir editando
        </Button>
        <Button
          onClick={onConfirm}
          color={colorConfirmar}
          variant="contained"
          disabled={disabled}
        >
          {textoConfirmar}
        </Button>
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
  const idMostrado = isCreate ? getNextRoleId() : initialData?.id ?? ''

  const [nombre, setNombre] = useState('')
  const [estado, setEstado] = useState('Activo')
  const [modulos, setModulos] = useState([])
  const [privilegios, setPrivilegios] = useState({})
  const [touched, setTouched] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false)

  const snapshotInicial = useRef('')
  const nombreRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const mods = [
      ...(initialData?.modulos ?? Object.keys(initialData?.privilegios ?? {})),
    ]

    const privs = Object.fromEntries(
      mods.map((modulo) => [
        modulo,
        [...(initialData?.privilegios?.[modulo] ?? [])],
      ])
    )

    const nom = initialData?.nombre ?? ''
    const est = initialData?.estado ?? 'Activo'

    setNombre(nom)
    setEstado(est)
    setModulos(mods)
    setPrivilegios(privs)
    setTouched(false)
    setConfirmOpen(false)
    setCancelConfirmOpen(false)

    snapshotInicial.current = crearSnapshot(nom, est, mods, privs)
  }, [open, initialData])

  const esNombreValido = nombreValido(nombre)

  const hayCambios =
    crearSnapshot(nombre, estado, modulos, privilegios) !== snapshotInicial.current

  const obtenerDatos = () => ({
    nombre: nombre.trim(),
    estado,
    modulos: [...modulos],
    privilegios,
  })

  const handleNombreChange = (value) => {
    if (/^[\p{L}\s]*$/u.test(value)) {
      setNombre(value)
    }
  }

  const handleTab = (e) => {
    if (e.key === 'Tab' && !esNombreValido) {
      e.preventDefault()
      setTouched(true)
      nombreRef.current?.focus()
    }
  }

  const handleCancel = () => {
    if (submitting) return

    if (hayCambios) {
      setCancelConfirmOpen(true)
      return
    }

    onClose()
  }

  const handleConfirmCancel = () => {
    if (submitting) return

    setCancelConfirmOpen(false)
    onClose()
  }

  const handleSubmit = () => {
    if (submitting) return

    setTouched(true)

    if (!esNombreValido) {
      onError?.(
        'Revisa el nombre del rol: debe tener mínimo 3 letras y no contener números ni símbolos.'
      )
      nombreRef.current?.focus()
      return
    }

    if (isCreate) {
      if (!modulos.length) {
        onError?.('Debes agregar al menos un módulo.')
        return
      }

      const moduloSinPrivilegios = modulos.find(
        (modulo) => !privilegios[modulo]?.length
      )

      if (moduloSinPrivilegios) {
        onError?.(
          `Selecciona al menos un privilegio para el módulo ${moduloSinPrivilegios}.`
        )
        return
      }

      onSubmit(obtenerDatos())
      return
    }

    setConfirmOpen(true)
  }

  const handleConfirmUpdate = () => {
    if (submitting) return

    setConfirmOpen(false)
    onSubmit(obtenerDatos())
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {}}
        disableEscapeKeyDown
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              width: '86vw',
              maxWidth: 1250,
              height: '88vh',
              maxHeight: '88vh',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
              m: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ px: 2.5, py: 1, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isCreate ? (
              <AddIcon color="primary" fontSize="small" />
            ) : (
              <EditIcon color="primary" fontSize="small" />
            )}

            <Typography variant="subtitle1" fontWeight={700}>
              {isCreate ? 'Crear rol' : 'Editar rol'}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            px: 2.5,
            py: 1.25,
            overflowY: 'auto',
            overflowX: 'hidden',
            minWidth: 0,
            flex: 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 1.5,
                pb: 0.5,
              }}
            >
              <Campo label="ID del rol" width={110}>
                <TextField
                  value={idMostrado}
                  size="small"
                  fullWidth
                  disabled
                  sx={campoSx}
                />
              </Campo>

              <Campo label="Nombre del rol *" width={260}>
                <TextField
                  inputRef={nombreRef}
                  value={nombre}
                  onChange={(e) => handleNombreChange(e.target.value)}
                  onKeyDown={handleTab}
                  onBlur={() => setTouched(true)}
                  size="small"
                  fullWidth
                  placeholder="Ej. Administrador"
                  error={touched && !esNombreValido}
                  helperText={
                    touched && !esNombreValido
                      ? 'Mínimo 3 letras. Solo letras y espacios.'
                      : ''
                  }
                  sx={{
                    ...campoSx,
                    '& .MuiFormHelperText-root': {
                      position: 'absolute',
                      top: '100%',
                      m: 0,
                      mt: '2px',
                    },
                  }}
                />
              </Campo>

              <Campo label="Estado" width={160}>
                <TextField
                  select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  size="small"
                  fullWidth
                  sx={campoSx}
                >
                  {ESTADOS.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </Campo>
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <ModulosGrid
                modulos={modulos}
                privilegios={privilegios}
                onModulosChange={setModulos}
                onPrivilegiosChange={setPrivilegios}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, py: 1.25, gap: 1, flexShrink: 0 }}>
          <Button onClick={handleCancel} color="inherit" disabled={submitting}>
            Cancelar
          </Button>

          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
            {submitting
              ? 'Guardando...'
              : isCreate
                ? 'Crear rol'
                : 'Guardar cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      <Confirmar
        open={confirmOpen}
        titulo="Confirmar cambios"
        texto="¿Deseas guardar los cambios realizados en este rol? Las modificaciones también afectarán a los usuarios que tengan asignado este rol."
        textoConfirmar="Confirmar cambios"
        disabled={submitting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmUpdate}
      />

      <Confirmar
        open={cancelConfirmOpen}
        titulo="¿Cancelar los cambios?"
        texto="Tienes cambios sin guardar. Si sales ahora, perderás las modificaciones realizadas."
        textoConfirmar="Salir sin guardar"
        colorConfirmar="error"
        disabled={submitting}
        onCancel={() => setCancelConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </>
  )
}
