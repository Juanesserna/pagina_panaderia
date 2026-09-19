import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

/**
 * Tarjeta de estadística (KPI): etiqueta + número grande + icono.
 * Genérica a propósito (sin lógica de "usuarios") para poder reutilizarla
 * en otros dashboards (productos, ventas, etc).
 */
export default function StatCard({ label, value, icon, iconBg }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 1,
        p: 2.5,
        borderColor: 'divider',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        minWidth: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.6,
            color: 'text.secondary',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography sx={{ fontSize: 30, fontWeight: 700, color: 'text.primary', lineHeight: 1 }}>
        {value}
      </Typography>
    </Paper>
  )
}