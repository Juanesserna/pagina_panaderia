import { Box, Typography } from '@mui/material'
import { ResponsiveContainer } from 'recharts'
import { CHART_HEIGHT } from '../constants/dashboard.constants'

// Tarjeta contenedora de una gráfica: título, subtítulo y el área (responsive) donde va el chart de recharts.
export function ChartCard({ title, subtitle, children }) {
  return (
    <Box sx={{ borderRadius: 2.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', p: 2.5 }}>
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="h6">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {/* El tamaño del texto de los ejes sale del nivel "caption" del tema, no de un fontSize a mano */}
      <Box sx={{ height: CHART_HEIGHT, '& .recharts-cartesian-axis-tick-value': { typography: 'caption' } }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}
