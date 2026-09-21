import { Box, Stack, Typography, Divider } from '@mui/material'
import { IconBread, IconTruck, IconLeaf, IconUsers } from '@tabler/icons-react'

const items = [
  { icon: <IconBread size={16} stroke={1.5} />, label: 'Horneado cada mañana' },
  { icon: <IconLeaf size={16} stroke={1.5} />, label: 'Ingredientes locales' },
  { icon: <IconTruck size={16} stroke={1.5} />, label: 'Entrega a domicilio' },
  { icon: <IconUsers size={16} stroke={1.5} />, label: '+500 clientes felices' },
]

export function TrustBar() {
  return (
    <Box sx={{ bgcolor: '#5B3023', height: 90, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        spacing={6}
        sx={{ maxWidth: 1200, mx: 'auto', px: 3, width: '100%' }}
      >
        {items.map((item, i) => (
          <Stack key={i} direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ color: 'rgba(250,245,238,0.6)', display: 'flex' }}>{item.icon}</Box>
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(250,245,238,0.8)',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </Typography>
            {i < items.length - 1 && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: 'none', sm: 'block' }, borderColor: 'rgba(250,245,238,0.2)', height: 16, my: 'auto' }}
              />
            )}
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
