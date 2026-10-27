import { Box, Stack, Typography, useTheme } from '@mui/material'
import { IconClock } from '@tabler/icons-react'
import TarjetaDetalle from './TarjetaDetalle'

// Tarjeta con la lista de eventos del producto
export default function HistorialProducto({ eventos }) {
  const theme = useTheme()

  return (
    <TarjetaDetalle titulo="Historial" icono={<IconClock size={16} />}>
      <Stack spacing={2}>
        {eventos.map((evento) => (
          <Box key={evento.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: theme.palette.success.main,
                mt: 0.45,
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{ color: theme.palette.success.main }}
              >
                {evento.texto}
              </Typography>
              <Typography
                variant="caption"
                component="p"
                sx={{ color: theme.palette.text.secondary, mt: 0.2 }}
              >
                {evento.autor}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </TarjetaDetalle>
  )
}