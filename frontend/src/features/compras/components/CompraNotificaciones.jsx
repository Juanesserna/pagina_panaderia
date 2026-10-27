import { Box, Typography } from '@mui/material'

// Toasts de confirmación (misma línea visual que los de Ventas).
// TODO: mover a shared/ (no tiene nada de compras y otros módulos lo van a usar; Ventas tiene su copia).

const notificacionColor = { exito: 'success.main', advertencia: 'warning.main', error: 'error.main' }

function Notificacion({ tipo, titulo, mensaje }) {
  const color = notificacionColor[tipo] || notificacionColor.exito
  return (
    <Box
      role="status"
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderLeft: '4px solid',
        borderLeftColor: color,
        borderRadius: 2,
        px: 2.25,
        py: 1.5,
        minWidth: 270,
        maxWidth: 340,
        boxShadow: 6,
        animation: 'ah-notif-in 0.25s ease-out',
        '@keyframes ah-notif-in': {
          from: { opacity: 0, transform: 'translateX(24px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      }}
    >
      <Typography variant="subtitle1">{titulo}</Typography>
      <Typography variant="body2" sx={{ mt: 0.25 }}>
        {mensaje}
      </Typography>
    </Box>
  )
}

export function CompraNotificaciones({ notificaciones }) {
  if (notificaciones.length === 0) return null
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        pointerEvents: 'none',
      }}
    >
      {notificaciones.map((n) => (
        <Box key={n.id} sx={{ pointerEvents: 'auto' }}>
          <Notificacion tipo={n.tipo} titulo={n.titulo} mensaje={n.mensaje} />
        </Box>
      ))}
    </Box>
  )
}
