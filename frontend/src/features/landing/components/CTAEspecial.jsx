import { Box, Typography, Button } from '@mui/material'
import { fonts } from '@app/theme/colors'

export function CTAEspecial() {
  return (
    <Box component="section" sx={{ position: 'relative', overflow: 'hidden', minHeight: 460, display: 'flex', alignItems: 'center', py: { xs: 8, md: 12 } }}>
      <Box
        component="img"
        src="https://images.unsplash.com/photo-1749996089724-268703b8c4dc?w=1400&h=600&fit=crop&auto=format"
        alt="Panadería Al Horno para eventos"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(46,24,16,0.86) 0%, rgba(91,48,35,0.74) 100%)',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1200, mx: 'auto', px: 3, width: '100%' }}>
        <Box
          sx={{
            maxWidth: 780,
            mx: 'auto',
            px: { xs: 3, md: 8 },
            py: { xs: 6, md: 8 },
            textAlign: 'center',
            border: '1px solid rgba(192,133,82,0.32)',
            borderRadius: '20px',
            bgcolor: 'rgba(46,24,16,0.32)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Box sx={{ width: 24, height: '1px', bgcolor: '#C08552' }} />
            <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C08552' }}>
              Pedidos especiales
            </Typography>
            <Box sx={{ width: 24, height: '1px', bgcolor: '#C08552' }} />
          </Box>
          <Typography component="h2" sx={{ fontFamily: fonts.serif, fontSize: { xs: 34, md: 52 }, fontWeight: 300, color: '#FAF5EE', mb: 2.5, lineHeight: 1.12 }}>
            ¿Tienes un evento especial?
          </Typography>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: 'rgba(250,245,238,0.8)', mx: 'auto', mb: 4.5, maxWidth: 520 }}>
            Tortas de celebración, catering artesanal y pedidos por mayor para empresas y eventos. Diseñamos
            cada propuesta a la medida de tu ocasión.
          </Typography>
          <Button
            href="#footer"
            sx={{
              bgcolor: '#5B3023',
              color: '#FAF5EE',
              border: '1px solid rgba(192,133,82,0.45)',
              borderRadius: '999px',
              px: 3,
              py: 1,
              fontFamily: fonts.sans,
              fontSize: 11.5,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'background-color 0.25s ease, border-color 0.25s ease',
              '&:hover': { bgcolor: '#4a2519', borderColor: '#C08552' },
              '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            }}
          >
            Cotizar pedido
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
