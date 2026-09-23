import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import CloseIcon from '@mui/icons-material/Close'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { BRAND } from '@shared/utils/colors'
import { ESTADOS, siguienteCodigo } from '../services/rolesService'
import ModulosGrid from './ModulosGrid'

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

export default function RoleFormDialog({ open, mode, initialData, onClose, onSubmit, submitting }) {
  const isCreate = mode === 'create'
  const [nombre, setNombre] = useState('')
  const [estado, setEstado] = useState('Activo')
  const [modulos, setModulos] = useState([])
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setNombre(isCreate ? '' : initialData?.nombre ?? '')
      setEstado(isCreate ? 'Activo' : initialData?.estado ?? 'Activo')
      setModulos(isCreate ? [] : initialData?.modulos ?? [])
      setTouched(false)
    }
  }, [open, isCreate, initialData])

  const isValid = nombre.trim().length > 0

  const handleSubmit = () => {
    setTouched(true)
    if (!isValid) return
    if (isCreate) {
      onSubmit({ nombre: nombre.trim(), estado, modulos })
    } else {
      onSubmit({ nombre: nombre.trim(), modulos })
    }
  }

  const codigoMostrado = isCreate ? siguienteCodigo() : initialData?.codigo ?? ''

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 0 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            {isCreate ? 'Nuevo rol' : 'Editar rol'}
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 400 }}>
            Define el rol y los módulos que verán por defecto sus usuarios
          </Typography>
        </Box>
        <IconButton onClick={onClose} disabled={submitting} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isCreate
              ? '0.8fr 1.6fr 1fr'   
              : '1fr 1fr',          
            gap: 2,
            mb: 3,
          }}
        >
          {/* ID */}
          <Box>
            <FieldLabel>ID</FieldLabel>
            <TextField
              value={codigoMostrado}
              disabled
              fullWidth
              sx={inputSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>#</Typography>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* NOMBRE DEL ROL */}
          <Box>
            <FieldLabel>Nombre del rol</FieldLabel>
            <TextField
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Supervisor de turno"
              error={touched && !isValid}
              fullWidth
              sx={inputSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShieldOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* ESTADO — SOLO al crear */}
          {isCreate && (
            <Box>
              <FieldLabel>Estado</FieldLabel>
              <TextField select value={estado} onChange={(e) => setEstado(e.target.value)} fullWidth sx={inputSx}>
                {ESTADOS.map((e) => (
                  <MenuItem key={e} value={e}>
                    {e}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
        </Box>

        <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 1.2 }}>
          Módulos que verán por defecto los usuarios con este rol:
        </Typography>
        <ModulosGrid value={modulos} onChange={setModulos} />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={submitting} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          startIcon={isCreate ? <AddIcon /> : <EditIcon />}
          sx={{ bgcolor: BRAND.orange, '&:hover': { bgcolor: BRAND.orangeDark } }}
        >
          {submitting ? 'Guardando...' : isCreate ? 'Crear rol' : 'Guardar cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}