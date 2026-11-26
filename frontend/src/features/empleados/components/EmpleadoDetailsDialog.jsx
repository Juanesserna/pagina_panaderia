import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
} from '@mui/material'

import {
  IdCard,
  Phone,
  Clock3,
  ShieldCheck,
  Link2,
  Unlink,
} from 'lucide-react'

import UserAvatar from '@shared/components/UserAvatar'
import { formatearHora } from '../services/empleadosService'

// Información individual del empleado.
function DetailItem({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 600 }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          overflowWrap: 'anywhere',
        }}
      >
        {value == null || value === ''
          ? 'No registrado'
          : value}
      </Typography>
    </Box>
  )
}

// Sección reutilizable del detalle.
function DetailSection({ icon: Icon, title, children }) {
  return (
    <Box sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '8px',
      p: 1.5,
      minWidth: 0,
    }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', mb: 1.5 }}
      >
        <Box sx={{
          width: 30,
          height: 30,
          borderRadius: '8px',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'action.hover',
          color: 'text.secondary',
          flexShrink: 0,
        }}>
          <Icon size={17} />
        </Box>

        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700 }}
        >
          {title}
        </Typography>
      </Stack>

      <Stack spacing={1.2}>
        {children}
      </Stack>
    </Box>
  )
}

export default function EmpleadoDetailsDialog({
  open,
  empleado,
  onClose,
}) {
  if (!empleado) return null

  const tieneCuenta = empleado.id_usuario != null
  const IconoCuenta = tieneCuenta ? Link2 : Unlink
  const colorCuenta = tieneCuenta
    ? 'success.main'
    : 'text.secondary'

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === 'escapeKeyDown') onClose()
      }}
      fullWidth
      maxWidth="sm"
      aria-labelledby="empleado-detalle-title"
      slotProps={{
        paper: { sx: { borderRadius: 3 } },
      }}
    >
      <DialogTitle>
        <Typography
          id="empleado-detalle-title"
          sx={{ fontSize: 17, fontWeight: 700 }}
        >
          Detalles del empleado
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Información personal y laboral del empleado.
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 2 }}>
        <Stack spacing={2}>
          {/* Identificación principal. */}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center' }}
          >
            <UserAvatar name={empleado.nombre} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{
                fontWeight: 700,
                overflowWrap: 'anywhere',
              }}>
                {empleado.nombre}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Empleado #{empleado.id}
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={0.6}
              sx={{ alignItems: 'center', color: colorCuenta }}
            >
              <IconoCuenta size={16} />

              <Typography variant="caption">
                {tieneCuenta ? 'Cuenta vinculada' : 'Sin cuenta'}
              </Typography>
            </Stack>
          </Stack>

          {/* Información personal, laboral y de acceso. */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
            },
            gap: 1.5,
          }}>
            <DetailSection
              icon={IdCard}
              title="Identificación"
            >
              <DetailItem
                label="Tipo de documento"
                value={empleado.tipoDocumento}
              />

              <DetailItem
                label="Número de documento"
                value={empleado.documento}
              />
            </DetailSection>

            <DetailSection
              icon={Phone}
              title="Contacto"
            >
              <DetailItem
                label="Teléfono celular"
                value={empleado.telefono}
              />
            </DetailSection>

            <DetailSection
              icon={Clock3}
              title="Horario laboral"
            >
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.5,
              }}>
                <DetailItem
                  label="Hora de entrada"
                  value={formatearHora(empleado.horaEntrada)}
                />

                <DetailItem
                  label="Hora de salida"
                  value={formatearHora(empleado.horaSalida)}
                />
              </Box>
            </DetailSection>

            <DetailSection
              icon={ShieldCheck}
              title="Acceso al sistema"
            >
              <DetailItem
                label="Identificador de usuario"
                value={tieneCuenta
                  ? `#${empleado.id_usuario}`
                  : 'No asignado'}
              />

              <Typography
                variant="caption"
                color="text.secondary"
              >
                La cuenta y el rol se administran desde Usuarios.
              </Typography>
            </DetailSection>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
