import { Box } from '@mui/material'

/**
 * Contenedor estándar de tarjetas KPI del proyecto Al Horno.
 *
 * Modo normal (predeterminado):
 * - Distribuye las tarjetas de manera responsive.
 * - Aprovecha el ancho disponible.
 * - Mantiene el diseño utilizado por los demás módulos.
 *
 * Modo compacto (compact):
 * - Agrupa las tarjetas a la izquierda.
 * - Limita el ancho de cada tarjeta a 220px.
 * - Reduce el espacio entre tarjetas.
 * - Permite que pasen a otra fila si falta espacio.
 *
 * Ejemplos:
 *
 * <KPIGrid>
 *   <KPICard title="Total" value={10} />
 * </KPIGrid>
 *
 * <KPIGrid compact>
 *   <KPICard title="Total" value={10} compact />
 * </KPIGrid>
 */

export function KPIGrid({ children, compact = false }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: compact
          ? 'repeat(auto-fit, minmax(200px, 220px))'
          : 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: compact ? 1.5 : 2,
        justifyContent: compact ? 'start' : 'stretch',
      }}
    >
      {children}
    </Box>
  )
}
