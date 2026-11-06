import { useTheme } from '@mui/material/styles'

// Colores de las gráficas (recharts) tomados del tema: así cambian solos entre modo claro y oscuro
// y no hay colores escritos a mano. Para cambiar el color de una serie se cambia AQUÍ.
export function useColoresGrafica() {
  const { palette } = useTheme()
  return {
    ventas: palette.success.main,
    compras: palette.primary.main,
    rejilla: palette.divider,
    eje: palette.text.secondary,
    tooltip: {
      contentStyle: {
        backgroundColor: palette.background.paper,
        border: `1px solid ${palette.divider}`,
        borderRadius: 8,
      },
      labelStyle: { color: palette.text.primary },
      itemStyle: { color: palette.text.secondary },
      cursor: { stroke: palette.divider, fill: palette.action.hover },
    },
  }
}
