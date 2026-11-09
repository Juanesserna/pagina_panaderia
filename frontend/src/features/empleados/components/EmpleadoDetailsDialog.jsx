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
  Avatar,
} from '@mui/material'

import {
  UserRound,
  IdCard,
  Phone,
  ShieldCheck,
  BriefcaseBusiness,
  Clock3,
} from 'lucide-react'

import { formatearHora } from '../services/empleadosService'

function DetailItem({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 0.5,
          color: 'text.secondary',
          mb: 0.3,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ overflowWrap: 'anywhere' }}
      >
        {value === null || value === undefined || value === ''
          ? 'No registrado'
          : value}
      </Typography>
    </Box>
  )
}

function DetailSection({ icon: Icon, title, children }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2.5,
        p: 1.5,
        minWidth: 0,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
        <Box
          sx={{
            width: 29,
            height: 29,
            borderRadius: 1.5,
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'action.hover',
            color: 'text.secondary',
            flexShrink: 0,
          }}
        >
          <Icon size={16} />
        </Box>

        <Typography variant="subtitle2" fontWeight={700}>
          {title}
        </Typography>
      </Stack>

      {children}
    </Box>
  )
}

export default function EmpleadoDetailsDialog({
  open,
  empleado,
  onClose,
}) {
  if (!empleado) return null

  const iniciales = empleado.nombre
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()

  const tieneCuenta = empleado.id_usuario != null

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle sx={{ px: 2.5, pt: 2, pb: 1 }}>
        <Typography fontWeight={700}>
          Detalles del empleado
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Información personal y laboral del colaborador.
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 2.5, py: 1.5 }}>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
          >
            <Avatar
              sx={{
                width: 46,
                height: 46,
                bgcolor: 'action.selected',
                color: 'text.primary',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {iniciales || <UserRound size={21} />}
            </Avatar>

            <Box flex={1} minWidth={0}>
              <Typography fontWeight={700}>
                {empleado.nombre}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Empleado #{empleado.id}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
              },
              gap: 1.5,
            }}
          >
            <DetailSection icon={IdCard} title="Identificación">
              <Stack spacing={1.2}>
                <DetailItem
                  label="Tipo de documento"
                  value={empleado.tipoDocumento}
                />

                <DetailItem
                  label="Número de documento"
                  value={empleado.documento}
                />
              </Stack>
            </DetailSection>

            <DetailSection icon={Phone} title="Contacto">
              <DetailItem
                label="Teléfono celular"
                value={empleado.telefono}
              />
            </DetailSection>

            <DetailSection
              icon={BriefcaseBusiness}
              title="Información laboral"
            >
              <Stack spacing={1.2}>
                <Stack direction="row" alignItems="center" spacing={0.8}>
                  <Clock3 size={15} />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Jornada laboral
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 1.5,
                  }}
                >
                  <DetailItem
                    label="Hora de entrada"
                    value={formatearHora(empleado.horaEntrada)}
                  />

                  <DetailItem
                    label="Hora de salida"
                    value={formatearHora(empleado.horaSalida)}
                  />
                </Box>
              </Stack>
            </DetailSection>

            <DetailSection
              icon={ShieldCheck}
              title="Acceso al sistema"
            >
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: tieneCuenta
                        ? 'success.main'
                        : 'text.disabled',
                    }}
                  />

                  <Typography variant="body2" fontWeight={600}>
                    {tieneCuenta
                      ? 'Cuenta vinculada'
                      : 'Sin cuenta vinculada'}
                  </Typography>
                </Stack>

                {tieneCuenta && (
                  <DetailItem
                    label="Identificador de usuario"
                    value={empleado.id_usuario}
                  />
                )}

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1.4 }}
                >
                  La cuenta y el rol se administran desde Usuarios.
                </Typography>
              </Stack>
            </DetailSection>
          </Box>
        </Stack>
      </DialogContent>

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
