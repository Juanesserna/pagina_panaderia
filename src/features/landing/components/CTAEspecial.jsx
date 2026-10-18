import { Box, Typography, Button } from '@mui/material'
import { fonts } from '@app/theme/colors'

export function CTAEspecial() {
  return (
    <Box component="section" sx={{ position: 'relative', overflow: 'hidden', minHeight: 420, display: 'flex', alignItems: 'center' }}>
      <Box
        component="img"
        src="https://images.unsplash.com/photo-1749996089724-268703b8c4dc?w=1400&h=600&fit=crop&auto=format"
        alt="Panadería Al Horno para eventos"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(46,24,16,0.78)' }} />

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1200, mx: 'auto', px: 3, py: { xs: 8, md: 12 }, textAlign: 'center', width: '100%' }}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(250,245,238,0.55)', display: 'block', mb: 2.5 }}>
          Pedidos especiales
        </Typography>
        <Typography component="h2" sx={{ fontFamily: fonts.serif, fontSize: { xs: 32, md: 52 }, fontWeight: 300, color: '#FAF5EE', mb: 2.5, lineHeight: 1.15 }}>
          ¿Tienes un evento especial?
        </Typography>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 300, lineHeight: 1.75, color: 'rgba(250,245,238,0.7)', mx: 'auto', mb: 5, maxWidth: 520 }}>
          Tortas de celebración, catering artesanal y pedidos por mayor para empresas y eventos. Diseñamos
          cada propuesta a la medida de tu ocasión.
        </Typography>
        <Button
          href="#footer"
          sx={{ bgcolor: '#C08552', color: '#FAF5EE', px: 4.5, py: 1.85, fontSize: 13, '&:hover': { bgcolor: '#a8723f' } }}
        >
          Cotizar pedido
        </Button>
      </Box>
    </Box>
  )
}
