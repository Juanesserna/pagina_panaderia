import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  Alert,
} from '@mui/material'

import {
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
  LayoutGrid,
  CheckCircle2,
} from 'lucide-react'

import UserAvatar from '@shared/components/UserAvatar'
import StatusChip from './StatusChip'

import { getModulosVisibles } from '../services/usuariosService'
import { formatearHora } from '../../empleados/services/empleadosService'

function Dato({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: 'text.secondary',
          mb: 0.25,
        }}
      >
        {label}
      </Typography>

      <Typography
        component="div"
        sx={{
          fontSize: 13,
          fontWeight: 600,
          overflowWrap: 'anywhere',
          lineHeight: 1.4,
        }}
      >
        {value == null || value === ''
          ? 'No registrado'
          : value}
      </Typography>
    </Box>
  )
}

function Seccion({ icon: Icon, titulo, extra, children }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 1.5,
        minWidth: 0,
      }}
    >
      <Stack
        direction="row"
        spacing={0.8}
        sx={{
          alignItems: 'center',
          flexWrap: 'wrap',
          mb: 1.3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            color: 'text.secondary',
          }}
        >
          <Icon size={17} />
        </Box>

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            flex: 1,
          }}
        >
          {titulo}
        </Typography>

        {extra}
      </Stack>

      {children}
    </Box>
  )
}

// Información del perfil vinculado a la cuenta.
function PerfilCard({ perfil, tipo }) {
  const esCliente = tipo === 'Cliente'

  const horario =
    perfil.horaEntrada && perfil.horaSalida
      ? `${formatearHora(perfil.horaEntrada)} – ${formatearHora(perfil.horaSalida)}`
      : perfil.horario || null

  return (
    <Seccion
      icon={esCliente ? UserRound : BriefcaseBusiness}
      titulo={`Perfil de ${tipo.toLowerCase()}`}
      extra={
        <Chip
          label="Vinculado"
          color="success"
          variant="outlined"
          size="small"
          sx={{ height: 22, fontSize: 10.5 }}
        />
      }
    >
      <Stack spacing={1.2}>
        <Dato
          label={perfil.tipoDocumento || 'Documento'}
          value={perfil.documento}
        />

        {!esCliente && (
          <>
            <Dato
              label="Teléfono"
              value={perfil.telefono}
            />

            <Dato
              label="Horario laboral"
              value={horario}
            />
          </>
        )}
      </Stack>
    </Seccion>
  )
}

// Resumen compacto de los accesos heredados del rol.
function ModulosDisponibles({ usuario }) {
  const modulos = getModulosVisibles(usuario)

  const totalPrivilegios = modulos.reduce(
    (total, modulo) => total + modulo.acciones.length,
    0
  )

  const mensaje =
    usuario.estado !== 'Activo'
      ? 'La cuenta está inactiva y no tiene accesos habilitados.'
      : usuario.estadoRol !== 'Activo'
        ? 'El rol está inactivo o no está disponible.'
        : 'El rol no tiene privilegios asignados.'

  return (
    <Seccion
      icon={LayoutGrid}
      titulo="Módulos disponibles"
      extra={
        <Typography
          sx={{
            fontSize: 11,
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          {modulos.length} módulos · {totalPrivilegios} privilegios
        </Typography>
      }
    >
      <Typography
        sx={{
          fontSize: 11.5,
          color: 'text.secondary',
          mb: 1.3,
        }}
      >
        Accesos heredados del rol asignado.
        Los privilegios se administran desde Roles.
      </Typography>

      {modulos.length === 0 ? (
        <Alert severity="info">
          {mensaje}
        </Alert>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
            },
            columnGap: 1.5,
            rowGap: 1.2,
          }}
        >
          {modulos.map((modulo) => (
            <Stack
              key={modulo.nombre}
              direction="row"
              spacing={0.8}
              sx={{
                alignItems: 'center',
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  color: 'success.main',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={15} />
              </Box>

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  overflowWrap: 'anywhere',
                }}
              >
                {modulo.nombre}
              </Typography>
            </Stack>
          ))}
        </Box>
      )}
    </Seccion>
  )
}

export default function UsuarioDetailDialog({
  open,
  usuario,
  onClose,
}) {
  if (!usuario) return null

  const nombre =
    usuario.nombre?.trim() ||
    usuario.email ||
    `Usuario #${usuario.id}`

  const tieneCliente = Boolean(usuario.cliente)
  const tieneEmpleado = Boolean(usuario.empleado)

  const perfilInvalido = tieneCliente === tieneEmpleado

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            m: { xs: 1, sm: 2 },
            maxHeight: 'calc(100dvh - 32px)',
          },
        },
      }}
    >
      <DialogTitle sx={{ px: 2.5, py: 1.8 }}>
        <Typography
          sx={{ fontSize: 18, fontWeight: 700 }}
        >
          Detalles del usuario
        </Typography>

        <Typography
          sx={{
            fontSize: 12,
            color: 'text.secondary',
          }}
        >
          Información de la cuenta y accesos asignados.
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: { xs: 1.5, sm: 2.5 },
          py: 1.8,
        }}
      >
        <Stack spacing={1.5}>
          {/* Identificación de la cuenta */}
          <Stack
            direction="row"
            spacing={1.3}
            sx={{ alignItems: 'center' }}
          >
            <UserAvatar name={nombre} size={44} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  overflowWrap: 'anywhere',
                }}
              >
                {nombre}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: 'text.secondary',
                }}
              >
                Cuenta #{usuario.id}
                {usuario.tipoPerfil
                  ? ` · ${usuario.tipoPerfil}`
                  : ''}
              </Typography>
            </Box>

            <StatusChip estado={usuario.estado} />
          </Stack>

          {perfilInvalido && (
            <Alert severity="warning">
              {tieneCliente && tieneEmpleado
                ? 'La cuenta tiene más de un perfil asociado.'
                : 'La cuenta no tiene un perfil asociado.'}
            </Alert>
          )}

          {/* Cuenta y perfil distribuidos horizontalmente */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
              },
              gap: 1.5,
            }}
          >
            <Seccion
              icon={ShieldCheck}
              titulo="Información de la cuenta"
            >
              <Stack spacing={1.2}>
                <Dato
                  label="Correo electrónico"
                  value={usuario.email}
                />

                <Dato
                  label="Rol asignado"
                  value={usuario.rol}
                />

                <Dato
                  label="Estado del rol"
                  value={
                    usuario.estadoRol
                      ? <StatusChip estado={usuario.estadoRol} />
                      : 'No disponible'
                  }
                />
              </Stack>
            </Seccion>

            {tieneCliente && (
              <PerfilCard
                perfil={usuario.cliente}
                tipo="Cliente"
              />
            )}

            {tieneEmpleado && (
              <PerfilCard
                perfil={usuario.empleado}
                tipo="Empleado"
              />
            )}
          </Box>

          <ModulosDisponibles usuario={usuario} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          size="small"
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
