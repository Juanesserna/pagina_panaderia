
import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Divider,
  Snackbar,
  Alert,
  Chip,
  Stack,
} from '@mui/material'

import {
  UserRound,
  Mail,
  Phone,
  IdCard,
  ShieldCheck,
  LockKeyhole,
  Pencil,
  KeyRound,
  CircleCheck,
} from 'lucide-react'

import { Button } from '@shared/components/Button'
import UserAvatar from '@shared/components/UserAvatar'
import usePerfil from '../hooks/usePerfil'
import EditarPerfilDialog from '../components/EditarPerfilDialog'
import CambiarPasswordDialog from '../components/CambiarPasswordDialog'
import { cambiarPassword } from '../services/usuariosService'

function InfoItem({ icon: Icon, label, value }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 1.25,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 2,
          bgcolor: 'action.hover',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          color: 'text.secondary',
        }}
      >
        <Icon size={17} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 11.5,
            color: 'text.secondary',
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: 13.5,
            fontWeight: 600,
            color: 'text.primary',
            overflowWrap: 'anywhere',
          }}
        >
          {value || 'No registrado'}
        </Typography>
      </Box>
    </Box>
  )
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center"
      sx={{ mb: 1.5 }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 2,
          bgcolor: 'action.hover',
          color: 'primary.main',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={18} />
      </Box>

      <Box>
        <Typography fontSize={14} fontWeight={700}>
          {title}
        </Typography>

        <Typography fontSize={11.5} color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Stack>
  )
}

export default function MiPerfilPage() {
  const { usuario, loading, editarPerfil } = usePerfil()

  const [editarPerfilOpen, setEditarPerfilOpen] = useState(false)
  const [cambiarPasswordOpen, setCambiarPasswordOpen] = useState(false)
  const [savingPerfil, setSavingPerfil] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  const notify = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleGuardarPerfil = async (data) => {
    if (savingPerfil) return
    setSavingPerfil(true)

    try {
      await editarPerfil(data)
      setEditarPerfilOpen(false)
      notify('Tus datos de contacto han sido actualizados.')
    } catch (error) {
      notify(error.message || 'No se pudo actualizar el perfil.', 'error')
    } finally {
      setSavingPerfil(false)
    }
  }

  const handleCambiarPassword = async ({ actual, nueva }) => {
    if (!usuario?.id || submitting) return
    setSubmitting(true)

    try {
      await cambiarPassword(usuario.id, { actual, nueva })
      setCambiarPasswordOpen(false)
      notify('Tu contraseña ha sido actualizada.')
    } catch (error) {
      notify(error.message || 'No se pudo cambiar la contraseña.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !usuario) {
    return (
      <Box>
        <Typography fontSize={20} fontWeight={700} mb={2}>
          Mi perfil
        </Typography>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">
            {loading
              ? 'Cargando información del perfil...'
              : 'No se encontró información del perfil.'}
          </Typography>
        </Paper>
      </Box>
    )
  }

  const nombre = usuario.nombre?.trim() || 'Usuario'
  const correo = usuario.email || 'Sin correo registrado'
  const rol = usuario.rol || 'Sin rol'
  const activo = usuario.estado === 'Activo'

  return (
    <Box sx={{ width: '100%', pb: 2 }}>
      {/* Título */}
      <Box sx={{ mb: 2 }}>
        <Typography fontSize={21} fontWeight={700}>
          Mi perfil
        </Typography>

        <Typography fontSize={12.5} color="text.secondary">
          Administra tu información personal y la seguridad de tu cuenta.
        </Typography>
      </Box>

      {/* Encabezado */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: { xs: 2, md: 2.5 },
          mb: 2,
          borderTop: '3px solid',
          borderTopColor: 'primary.main',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <UserAvatar name={nombre} size={62} fontSize={20} />

            <Box>
              <Typography fontSize={18} fontWeight={700}>
                {nombre}
              </Typography>

              <Typography fontSize={12.5} color="text.secondary">
                {correo}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 0.8 }}>
                <Chip
                  size="small"
                  label={rol}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />

                <Chip
                  size="small"
                  label={usuario.estado || 'Sin estado'}
                  color={activo ? 'success' : 'default'}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
            </Box>
          </Stack>

          <Button
            variant="secondary"
            leftIcon={<Pencil size={15} />}
            onClick={() => setEditarPerfilOpen(true)}
          >
            Editar perfil
          </Button>
        </Box>
      </Paper>

      {/* Información */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
          },
          gap: 2,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            p: 2.5,
            minWidth: 0,
          }}
        >
          <SectionHeader
            icon={UserRound}
            title="Información personal"
            description="Datos asociados a tu perfil"
          />

          <Divider />

          <InfoItem
            icon={UserRound}
            label="Nombre completo"
            value={usuario.nombre}
          />

          <Divider />

          <InfoItem
            icon={IdCard}
            label="Documento de identidad"
            value={usuario.documento}
          />

          <Divider />

          <InfoItem
            icon={Phone}
            label="Teléfono"
            value={usuario.telefono}
          />
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            p: 2.5,
            minWidth: 0,
          }}
        >
          <SectionHeader
            icon={ShieldCheck}
            title="Información de la cuenta"
            description="Datos de acceso y permisos"
          />

          <Divider />

          <InfoItem
            icon={Mail}
            label="Correo electrónico"
            value={usuario.email}
          />

          <Divider />

          <InfoItem
            icon={ShieldCheck}
            label="Rol asignado"
            value={rol}
          />

          <Divider />

          <InfoItem
            icon={CircleCheck}
            label="Estado de la cuenta"
            value={usuario.estado}
          />
        </Paper>
      </Box>

      {/* Seguridad */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: 2.5,
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                bgcolor: 'action.hover',
                color: 'primary.main',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <LockKeyhole size={19} />
            </Box>

            <Box>
              <Typography fontSize={14} fontWeight={700}>
                Seguridad de la cuenta
              </Typography>

              <Typography fontSize={12} color="text.secondary">
                Actualiza tu contraseña de acceso.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="secondary"
            leftIcon={<KeyRound size={15} />}
            onClick={() => setCambiarPasswordOpen(true)}
          >
            Cambiar contraseña
          </Button>
        </Box>
      </Paper>

      {/* Diálogos */}
      <EditarPerfilDialog
        open={editarPerfilOpen}
        initialData={usuario}
        onClose={() => {
          if (!savingPerfil) setEditarPerfilOpen(false)
        }}
        onSubmit={handleGuardarPerfil}
        submitting={savingPerfil}
      />

      <CambiarPasswordDialog
        open={cambiarPasswordOpen}
        onClose={() => {
          if (!submitting) setCambiarPasswordOpen(false)
        }}
        onSubmit={handleCambiarPassword}
        submitting={submitting}
      />

      {/* Notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={(_, reason) => {
          if (reason !== 'clickaway') {
            setSnackbar((prev) => ({ ...prev, open: false }))
          }
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({ ...prev, open: false }))
          }
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
