import { Box } from '@mui/material'

const variantColor = {
  success: '#658237',   // Verde (Completado)
  process: '#F53926',   // Terracota / Rojizo oscuro (En proceso)
  warning: '#F4A93C',   // Naranja/Amarillo (Pendiente)
  danger: '#c53022',    // 👈 Rojo más intenso para "Cancelado"
  accent: '#1976D2',
  info: '#0288D1',
}

const variantBg = {
  success: '#E9EFE0',   // Fondo verde claro
  process: '#F4E4DA',   // Fondo rosa/terracota claro (En proceso)
  warning: '#FBE6C4',   // Fondo amarillo claro
  danger: '#FBF0EF',    // Fondo rojo/rosado suave (Cancelado)
  accent: 'rgba(25, 118, 210, 0.12)',
  info: 'rgba(2, 136, 209, 0.12)',
}

export function StatusBadge({ variant = 'accent', dot = false, children }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.4,
        borderRadius: 5,
        bgcolor: variantBg[variant],
        color: variantColor[variant],
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {dot && (
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: variantColor[variant],
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </Box>
  )
}