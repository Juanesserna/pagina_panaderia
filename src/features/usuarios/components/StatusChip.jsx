import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { useTheme, alpha } from '@mui/material/styles'

// Mismo criterio que el chip de estado de Ventas: el color sale SIEMPRE del
// theme (success/text.secondary), nunca de un hex pastel fijo, y el fondo se
// calcula con alpha() sobre ese color. Así el chip se ve bien tanto en claro
// como en oscuro sin tener que mantener dos paletas a mano.
export default function StatusChip({ estado }) {
  const theme = useTheme()
  const activo = estado === 'Activo'
  const color = activo ? theme.palette.success.main : theme.palette.text.secondary

  return (
    <Chip
      size="small"
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
          {estado}
        </Box>
      }
      sx={{
        bgcolor: alpha(color, 0.15),
        color,
        fontWeight: 600,
      }}
    />
  )
}