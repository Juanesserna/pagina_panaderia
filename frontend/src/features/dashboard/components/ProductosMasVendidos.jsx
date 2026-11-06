import { Box, IconButton, Stack, Typography } from '@mui/material'
import { IconDotsVertical } from '@tabler/icons-react'
import { formatearMoneda } from '../utils/dashboardHelpers'

export function ProductosMasVendidos({ productos }) {
  return (
    <Box sx={{ borderRadius: 2.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Box>
          <Typography variant="h6">Más vendidos</Typography>
          <Typography variant="body2" sx={{ mt: 0.25 }}>
            Este mes
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: 'text.dim' }}>
          <IconDotsVertical size={16} />
        </IconButton>
      </Stack>

      {productos.map((p, i) => (
        <Stack
          key={p.name}
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              typography: 'subtitle2',
              bgcolor: i === 0 ? 'action.selected' : 'action.hover',
              color: i === 0 ? 'primary.main' : 'text.dim',
            }}
          >
            {i + 1}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body1" noWrap>
              {p.name}
            </Typography>
            <Typography variant="caption">{p.unidades} uds.</Typography>
          </Box>
          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
            <Typography variant="subtitle1">{formatearMoneda(p.ingresos)}</Typography>
            <Typography variant="caption" sx={{ color: p.tendencia >= 0 ? 'success.main' : 'error.main' }}>
              {p.tendencia >= 0 ? '+' : ''}
              {p.tendencia}%
            </Typography>
          </Box>
        </Stack>
      ))}
    </Box>
  )
}
