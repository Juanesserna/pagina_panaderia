import { Box } from '@mui/material'

/**
 * Contenedor estándar de las tarjetas KPI de la parte superior de cada módulo.
 * Se adapta solo a 2, 3 o 4 tarjetas y al ancho de la pantalla.
 * Uso:  <KPIGrid><KPICard .../><KPICard .../></KPIGrid>
 */
export function KPIGrid({ children }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
      {children}
    </Box>
  )
}
