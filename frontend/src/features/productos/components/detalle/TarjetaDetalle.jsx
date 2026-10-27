import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import { tarjetaSx, iconoSx } from './estilos'

// Tarjeta con título (y icono opcional). "espacio" es el margen bajo el título.
export default function TarjetaDetalle({ titulo, icono = null, espacio = 2.5, children }) {
  const theme = useTheme()

  return (
    <Card variant="outlined" sx={tarjetaSx(theme)}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: espacio }}>
          {icono && <Box sx={iconoSx(theme)}>{icono}</Box>}
          <Typography variant="h6" component="p">
            {titulo}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  )
}