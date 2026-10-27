import { Box, Typography, useTheme } from '@mui/material'

// Etiqueta en mayúsculas con su valor.
// variante="panel" usa el valor más compacto del panel lateral.
export default function CampoDetalle({ etiqueta, valor, destacado = false, variante = 'principal' }) {
  const theme = useTheme()
  const esPanel = variante === 'panel'
  const nivelValor = esPanel ? 'subtitle1' : destacado ? 'h5' : 'h6'

  return (
    <Box>
      <Typography
        variant="overline"
        component="p"
        sx={{ color: destacado ? theme.palette.primary.main : theme.palette.text.secondary }}
      >
        {etiqueta}
      </Typography>
      <Typography
        variant={nivelValor}
        component="p"
        sx={{ color: theme.palette.text.primary, mt: esPanel ? 0.35 : 0.4 }}
      >
        {valor}
      </Typography>
    </Box>
  )
}