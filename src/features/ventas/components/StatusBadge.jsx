import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const variantColor = {
  success: '#658237',
  process: '#F53926',
  warning: '#F4A93C',
  danger: '#c53022',
  accent: '#1976D2',
  info: '#0288D1',
}

const variantBg = {
  success: '#E9EFE0',
  process: '#F4E4DA',
  warning: '#FBE6C4',
  danger: '#FBF0EF',
  accent: 'rgba(25, 118, 210, 0.12)',
  info: 'rgba(2, 136, 209, 0.12)',
}

// 👇 Nuevos mapas para modo oscuro (mismas keys que variantColor/variantBg)
const variantColorDark = {
  success: '#A3D115', // completado
  process: '#e40d0d', // en proceso
  warning: '#F29126', // pendiente
  danger: '#F53926',  // cancelado
  accent: '#1976D2',
  info: '#0288D1',
}

const variantBgDark = {
  success: '#34372A', // completado
  process: '#3D271B', // en proceso
  warning: '#48321C', // pendiente
  danger: '#3D271B',  // cancelado
  accent: 'rgba(25, 118, 210, 0.12)',
  info: 'rgba(2, 136, 209, 0.12)',
}

export function StatusBadge({ variant = 'accent', dot = false, children }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const colorMap = isDark ? variantColorDark : variantColor
  const bgMap = isDark ? variantBgDark : variantBg

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
        bgcolor: bgMap[variant],
        color: colorMap[variant],
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
            bgcolor: colorMap[variant],
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </Box>
  )
}