import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Divider, Button, Stack,
} from '@mui/material'

import {
  IdCard, ShieldCheck, Link2, Unlink,
} from 'lucide-react'

import UserAvatar from '@shared/components/UserAvatar'

// Presentación compacta de cada dato.
function DetailItem({ label, value, color = 'text.primary' }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        component="div"
        sx={{ fontWeight: 600, mb: 0.3 }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color,
          overflowWrap: 'anywhere',
        }}
      >
        {value ?? 'No registrado'}
      </Typography>
    </Box>
  )
}

// Tarjeta de información reutilizable.
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
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '8px',
          bgcolor: 'action.hover',
          color: 'text.secondary',
        }}>
          <Icon size={17} />
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Stack>

      <Stack spacing={1.5}>
        {children}
      </Stack>
    </Box>
  )
}

export default function ClienteDetailDialog({
  open,
  cliente,
  onClose,
}) {
  if (!cliente) return null

  const tieneCuenta = cliente.id_usuario != null
  const IconoCuenta = tieneCuenta ? Link2 : Unlink

  const textoCuenta = tieneCuenta
    ? 'Cuenta vinculada'
    : 'Sin cuenta vinculada'

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
      aria-labelledby="cliente-detalle-titulo"
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle sx={{ px: 2.5, py: 2 }}>
        <Typography
          id="cliente-detalle-titulo"
          sx={{ fontSize: 17, fontWeight: 700 }}
        >
          Detalles del cliente
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Información personal y de acceso del cliente.
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 2.5, py: 2 }}>
        <Stack spacing={2}>
          {/* Resumen del cliente. */}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', flexWrap: 'wrap' }}
          >
            <UserAvatar name={cliente.nombre} />

            <Box sx={{ flex: 1, minWidth: 120 }}>
              <Typography sx={{
                fontWeight: 700,
                fontSize: 15,
                overflowWrap: 'anywhere',
              }}>
                {cliente.nombre}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Cliente #{cliente.id}
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              color: colorCuenta,
            }}>
              <IconoCuenta size={16} />

              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {textoCuenta}
              </Typography>
            </Box>
          </Stack>

          {/* Información distribuida en dos tarjetas. */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
            },
            gap: 1.5,
          }}>
            <DetailSection icon={IdCard} title="Identificación">
              <DetailItem
                label="Tipo de documento"
                value={cliente.tipoDocumento}
              />

              <DetailItem
                label="Número de documento"
                value={cliente.documento}
              />
            </DetailSection>

            <DetailSection icon={ShieldCheck} title="Acceso al sistema">
              <DetailItem
                label="Cuenta de acceso"
                value={textoCuenta}
                color={colorCuenta}
              />

              <DetailItem
                label="Identificador de usuario"
                value={tieneCuenta
                  ? `#${cliente.id_usuario}`
                  : 'No asignado'}
              />
            </DetailSection>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button variant="contained" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
