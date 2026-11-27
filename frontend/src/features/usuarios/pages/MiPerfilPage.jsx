import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Divider,
  Alert,
  Chip,
  Stack,
  Skeleton,
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

import {
  NotificacionesContainer,
  useNotificaciones,
} from '@shared/notifications'

import usePerfil from '../hooks/usePerfil'
import EditarPerfilDialog from '../components/EditarPerfilDialog'
import CambiarPasswordDialog from '../components/CambiarPasswordDialog'
import { cambiarPassword } from '../services/usuariosService'

const cardSx = {
  borderRadius: 3,
  borderColor: 'divider',
  p: 2.5,
  minWidth: 0,
}

// Contenedor reutilizable para los iconos.
function IconoCaja({ icon: Icon, destacado = false }) {
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: 2,
        bgcolor: 'action.hover',
        color: destacado
          ? 'primary.main'
          : 'text.secondary',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={18} />
    </Box>
  )
}

// Elemento de información de solo lectura.
function InfoItem({ icon, label, value, color }) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        alignItems: 'center',
        py: 1.25,
        minWidth: 0,
      }}
    >
      <IconoCaja icon={icon} />

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 11.5,
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: 13.5,
            fontWeight: 600,
            color: color || 'text.primary',
            overflowWrap: 'anywhere',
          }}
        >
          {value || 'No registrado'}
        </Typography>
      </Box>
    </Stack>
  )
}

// Encabezado compartido por las secciones del perfil.
function SectionHeader({ icon, title, description }) {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{
        alignItems: 'center',
        mb: 1.5,
      }}
    >
      <IconoCaja icon={icon} destacado />

      <Box>
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 12,
            color: 'text.secondary',
          }}
        >
          {description}
        </Typography>
      </Box>
    </Stack>
  )
}

function TituloPerfil() {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        component="h1"
        sx={{
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1.4,
        }}
      >
        Mi perfil
      </Typography>

      <Typography
        sx={{
          fontSize: 12.5,
          color: 'text.secondary',
          mt: 0.25,
        }}
      >
        Administra tu información personal y la seguridad de tu cuenta.
      </Typography>
    </Box>
  )
}

// Estado visual durante la consulta inicial.
function PerfilSkeleton() {
  return (
    <Stack spacing={2}>
      <Paper
        variant="outlined"
        sx={{
          ...cardSx,
          borderTop: '4px solid',
          borderTopColor: 'primary.main',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center' }}
        >
          <Skeleton
            variant="circular"
            width={62}
            height={62}
          />

          <Box sx={{ flex: 1 }}>
            <Skeleton width="45%" height={26} />
            <Skeleton width="35%" height={20} />
            <Skeleton width={120} height={24} />
          </Box>
        </Stack>
      </Paper>

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
        {[0, 1].map((item) => (
          <Paper
            key={item}
            variant="outlined"
            sx={cardSx}
          >
            <Skeleton width="55%" height={25} />
            <Skeleton width="75%" height={20} />

            <Divider sx={{ my: 1.5 }} />

            {[0, 1, 2].map((fila) => (
              <Stack
                key={fila}
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                  py: 1.25,
                }}
              >
                <Skeleton
                  variant="rounded"
                  width={36}
                  height={36}
                />

                <Box sx={{ flex: 1 }}>
                  <Skeleton width="40%" />
                  <Skeleton width="65%" />
                </Box>
              </Stack>
            ))}
          </Paper>
        ))}
      </Box>

      <Paper variant="outlined" sx={cardSx}>
        <Skeleton width="45%" height={24} />
        <Skeleton width="60%" height={20} />
      </Paper>
    </Stack>
  )
}

export default function MiPerfilPage() {
  const {
    usuario,
    loading,
    error,
    submitting: savingPerfil,
    editarPerfil,
  } = usePerfil()

  const [editarPerfilOpen, setEditarPerfilOpen] =
    useState(false)

  const [cambiarPasswordOpen, setCambiarPasswordOpen] =
    useState(false)

  const [savingPassword, setSavingPassword] =
    useState(false)

  const {
    notificaciones,
    mostrarNotificacion,
    cerrarNotificacion,
  } = useNotificaciones()

  const ocupado = savingPerfil || savingPassword

  // Actualiza los datos de contacto del usuario.
  const handleGuardarPerfil = async (data) => {
    if (ocupado) return false

    try {
      await editarPerfil(data)

      setEditarPerfilOpen(false)

      mostrarNotificacion(
        'exito',
        'Tus datos de contacto han sido actualizados.'
      )

      return true
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo actualizar el perfil.'
      )

      return false
    }
  }

  // Cambio de contraseña simulado hasta conectar el backend.
  const handleCambiarPassword = async ({ actual, nueva }) => {
    if (!usuario?.id || ocupado) return false

    setSavingPassword(true)

    try {
      await cambiarPassword(usuario.id, {
        actual,
        nueva,
      })

      setCambiarPasswordOpen(false)

      mostrarNotificacion(
        'exito',
        'Cambio de contraseña simulado correctamente.'
      )

      return true
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo cambiar la contraseña.'
      )

      return false
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ width: '100%', minWidth: 0 }}>
        <TituloPerfil />
        <PerfilSkeleton />
      </Box>
    )
  }

  if (error || !usuario) {
    return (
      <Box sx={{ width: '100%', minWidth: 0 }}>
        <TituloPerfil />

        <Alert severity="error">
          {error || 'No se encontró información del perfil.'}
        </Alert>
      </Box>
    )
  }

  const nombre = usuario.nombre?.trim() || 'Usuario'
  const correo = usuario.email || 'Sin correo registrado'
  const rol = usuario.rol || 'Sin rol'
  const activo = usuario.estado === 'Activo'
  const esEmpleado = usuario.tipoPerfil === 'Empleado'

  const documento = [
    usuario.tipoDocumento,
    usuario.documento,
  ].filter(Boolean).join(' · ')

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        pb: 2,
      }}
    >
      <TituloPerfil />

      {/* Encabezado del perfil */}
      <Paper
        variant="outlined"
        sx={{
          ...cardSx,
          p: { xs: 2, md: 2.5 },
          mb: 2,
          borderTop: '4px solid',
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
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
              minWidth: 0,
            }}
          >
            <UserAvatar
              name={nombre}
              size={62}
              fontSize={20}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                  overflowWrap: 'anywhere',
                }}
              >
                {nombre}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12.5,
                  color: 'text.secondary',
                  overflowWrap: 'anywhere',
                }}
              >
                {correo}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mt: 0.8,
                  flexWrap: 'wrap',
                  rowGap: 0.5,
                }}
              >
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
            disabled={ocupado || !activo}
            onClick={() => setEditarPerfilOpen(true)}
          >
            Editar perfil
          </Button>
        </Box>
      </Paper>

      {/* Información personal y de la cuenta */}
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
        <Paper variant="outlined" sx={cardSx}>
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
            value={documento}
          />

          {esEmpleado && (
            <>
              <Divider />

              <InfoItem
                icon={Phone}
                label="Teléfono"
                value={usuario.telefono}
              />
            </>
          )}
        </Paper>

        <Paper variant="outlined" sx={cardSx}>
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
            color={
              activo
                ? 'success.main'
                : 'text.secondary'
            }
          />
        </Paper>
      </Box>

      {/* Seguridad de la cuenta */}
      <Paper
        variant="outlined"
        sx={{
          ...cardSx,
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
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center' }}
          >
            <IconoCaja
              icon={LockKeyhole}
              destacado
            />

            <Box>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Seguridad de la cuenta
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: 'text.secondary',
                }}
              >
                Actualiza tu contraseña de acceso.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="secondary"
            leftIcon={<KeyRound size={15} />}
            disabled={ocupado || !activo}
            onClick={() => setCambiarPasswordOpen(true)}
          >
            Cambiar contraseña
          </Button>
        </Box>
      </Paper>

      {/* Formularios del perfil */}
      <EditarPerfilDialog
        open={editarPerfilOpen}
        initialData={usuario}
        onClose={() => {
          if (!savingPerfil) {
            setEditarPerfilOpen(false)
          }
        }}
        onSubmit={handleGuardarPerfil}
        onError={(mensaje) =>
          mostrarNotificacion('error', mensaje)
        }
        submitting={savingPerfil}
      />

      <CambiarPasswordDialog
        open={cambiarPasswordOpen}
        onClose={() => {
          if (!savingPassword) {
            setCambiarPasswordOpen(false)
          }
        }}
        onSubmit={handleCambiarPassword}
        onError={(mensaje) =>
          mostrarNotificacion('error', mensaje)
        }
        submitting={savingPassword}
      />

      <NotificacionesContainer
        notificaciones={notificaciones}
        onClose={cerrarNotificacion}
      />
    </Box>
  )
}