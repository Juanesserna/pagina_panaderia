import { Box, Typography } from '@mui/material'

const toastStyles = {
  exito: {
    bg: '#E2ECD8',
    dot: '#4D7C3A',
    title: '#1E3F1A',
    subtitle: '#4E6E45',
  },
  advertencia: {
    bg: '#FCECD2',
    dot: '#DE7E41',
    title: '#8A4515',
    subtitle: '#A76B3B',
  },
  error: {
    bg: '#F9D9D6',
    dot: '#C93B3B',
    title: '#7A1A1A',
    subtitle: '#9C4848',
  },
  info: {
    bg: '#D6E8EB',
    dot: '#437F8A',
    title: '#163A42',
    subtitle: '#4A6D75',
  },
}

function Notificacion({ tipo, titulo, mensaje }) {
  const config = toastStyles[tipo] || toastStyles.exito
  const tieneTitulo = Boolean(titulo)
  const tieneMensaje = Boolean(mensaje)

  const textoTitulo = tieneTitulo ? titulo : mensaje
  const textoSub = tieneTitulo && tieneMensaje ? mensaje : null

  return (
    <Box
      role="status"
      sx={{
        bgcolor: config.bg,
        borderRadius: 2,
        px: 2.25,
        py: 1.75,
        minWidth: 290,
        maxWidth: 380,
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.35,
        animation: 'ah-notif-in 0.25s ease-out',
        '@keyframes ah-notif-in': {
          from: { opacity: 0, transform: 'translateX(24px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      }}
    >
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          bgcolor: config.dot,
          mb: 0.35,
        }}
      />
      <Typography
        sx={{
          fontSize: 13.5,
          fontWeight: 700,
          color: config.title,
          lineHeight: 1.3,
        }}
      >
        {textoTitulo}
      </Typography>
      {textoSub && (
        <Typography
          sx={{
            fontSize: 12.5,
            fontWeight: 400,
            color: config.subtitle,
            lineHeight: 1.4,
          }}
        >
          {textoSub}
        </Typography>
      )}
    </Box>
  )
}

export function NotificacionesContainer({ notificaciones }) {
  if (!notificaciones || notificaciones.length === 0) return null
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 24,
        right: 24,
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
