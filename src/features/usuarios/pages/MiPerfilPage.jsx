import { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Button } from '@shared/components/Button'
import UserAvatar from '@shared/components/UserAvatar'
import usePerfil from '../hooks/usePerfil'
import StatusChip from '../components/StatusChip'
import CambiarPasswordDialog from '../components/CambiarPasswordDialog'
import { cambiarPassword } from '../services/usuariosService'

function DetailRow({ icon, label, value }) {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          {icon}
          <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>{label}</Typography>
        </Box>
        <Box>{value}</Box>
      </Box>
      <Divider />
    </>
  )
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

const inputSx = {
  '& .MuiOutlinedInput-root': { bgcolor: 'action.hover', borderRadius: 2 },
}

export default function MiPerfilPage() {
  const { usuario, loading, editarPerfil } = usePerfil()
  const [cambiarPasswordOpen, setCambiarPasswordOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  // Modo visualización / edición de Correo y Teléfono.
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ email: '', telefono: '' })
  const [touched, setTouched] = useState(false)
  const [savingPerfil, setSavingPerfil] = useState(false)

  const handleCambiarPassword = async ({ actual, nueva }) => {
    setSubmitting(true)
    try {
      await cambiarPassword(usuario.id, { actual, nueva })
      setCambiarPasswordOpen(false)
      setSnackbar({ open: true, message: 'Tu contraseña ha sido actualizada.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditar = () => {
    setForm({ email: usuario.email, telefono: usuario.telefono })
    setTouched(false)
    setIsEditing(true)
  }

  const handleCancelar = () => {
    setIsEditing(false)
    setTouched(false)
  }

  const isValid = form.email.trim().length > 0 && form.email.includes('@') && form.telefono.trim().length > 0

  const handleGuardarPerfil = async () => {
    setTouched(true)
    if (!isValid) return
    setSavingPerfil(true)
    try {
      await editarPerfil({ email: form.email, telefono: form.telefono })
      setIsEditing(false)
      setSnackbar({ open: true, message: 'Tus datos de contacto han sido actualizados.' })
    } finally {
      setSavingPerfil(false)
    }
  }

  if (loading || !usuario) {
    return (
      <Box>
        <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 2 }}>Mi perfil</Typography>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography sx={{ color: 'text.secondary' }}>Cargando perfil...</Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box>
      <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 2 }}>Mi perfil</Typography>

      <Paper variant="outlined" sx={{ borderRadius: 3, maxWidth: 960 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, pt: 3, pb: 2 }}>
          <UserAvatar name={usuario.nombre} size={56} fontSize={18} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: 'text.primary' }}>
              {usuario.nombre}
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'primary.main', fontWeight: 600 }}>
              {usuario.rol}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            px: 3,
            py: 3,
          }}
        >
          {/* Columna izquierda: información personal */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Información personal
              </Typography>
              {!isEditing && (
                <Button variant="ghost" size="sm" leftIcon={<EditOutlinedIcon fontSize="small" />} onClick={handleEditar}>
                  Editar
                </Button>
              )}
            </Box>

            <DetailRow
              icon={<CreditCardOutlinedIcon fontSize="small" />}
              label="NIT / Cédula"
              value={<Typography sx={{ fontWeight: 600, fontSize: 14 }}>{usuario.cedula}</Typography>}
            />

            {!isEditing ? (
              <>
                <DetailRow
                  icon={<MailOutlinedIcon fontSize="small" />}
                  label="Correo electrónico"
                  value={<Typography sx={{ fontWeight: 600, fontSize: 14 }}>{usuario.email}</Typography>}
                />
                <DetailRow
                  icon={<PhoneOutlinedIcon fontSize="small" />}
                  label="Teléfono"
                  value={<Typography sx={{ fontWeight: 600, fontSize: 14 }}>{usuario.telefono}</Typography>}
                />
              </>
            ) : (
              <>
                <Box sx={{ pt: 2 }}>
                  <FieldLabel>Correo electrónico</FieldLabel>
                  <TextField
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    error={touched && !(form.email.trim() && form.email.includes('@'))}
                    helperText={touched && !(form.email.trim() && form.email.includes('@')) ? 'Correo inválido' : ''}
                    fullWidth
                    sx={inputSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>

                <Box sx={{ pt: 2 }}>
                  <FieldLabel>Teléfono</FieldLabel>
                  <TextField
                    value={form.telefono}
                    onChange={(e) => setForm((prev) => ({ ...prev, telefono: e.target.value }))}
                    error={touched && !form.telefono.trim()}
                    helperText={touched && !form.telefono.trim() ? 'Campo requerido' : ''}
                    fullWidth
                    sx={inputSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2 }}>
                  <Button variant="ghost" disabled={savingPerfil} onClick={handleCancelar}>
                    Cancelar
                  </Button>
                  <Button variant="primary" disabled={savingPerfil} onClick={handleGuardarPerfil}>
                    {savingPerfil ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                </Box>
              </>
            )}
          </Box>

          {/* Columna derecha: información de la cuenta (sin cambios) */}
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1.5 }}>
              Información de la cuenta
            </Typography>

            <DetailRow
              icon={<ShieldOutlinedIcon fontSize="small" />}
              label="Rol"
              value={<Typography sx={{ fontWeight: 600, fontSize: 14 }}>{usuario.rol}</Typography>}
            />
            <DetailRow
              icon={<LockOutlinedIcon fontSize="small" />}
              label="Estado"
              value={<StatusChip estado={usuario.estado} />}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
              <Button variant="secondary" onClick={() => setCambiarPasswordOpen(true)}>
                Cambiar contraseña
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      <CambiarPasswordDialog
        open={cambiarPasswordOpen}
        onClose={() => (submitting ? null : setCambiarPasswordOpen(false))}
        onSubmit={handleCambiarPassword}
        submitting={submitting}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: 3,
            fontSize: 13.5,
            fontWeight: 500,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}