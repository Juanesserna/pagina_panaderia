import { Box, Stack, Typography, Button } from '@mui/material'
import { fonts } from '@app/theme/colors'

export function Hero({ isDark }) {
  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        bgcolor: isDark ? '#1A0D07' : '#FAF5EE',
        display: 'flex',
        alignItems: 'center',
        pt: 8,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: 3,
          py: { xs: 7, md: 12 },
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 5, md: 10 },
          alignItems: 'center',
        }}
      >
        {/* Izquierda */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3.5 }}>
            <Box sx={{ width: 40, height: 1, bgcolor: '#C08552' }} />
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#C08552',
              }}
            >
              Hecho a mano · Horneado fresco
            </Typography>
          </Stack>

          <Typography
            component="h1"
            sx={{
              fontFamily: fonts.serif,
              fontSize: { xs: 44, md: 72 },
              fontWeight: 300,
              lineHeight: 1.08,
              color: isDark ? '#F3E9DC' : '#2E1810',
              mb: 3,
              letterSpacing: '-0.01em',
            }}
          >
            El sabor que{' '}
            <Box component="em" sx={{ fontStyle: 'italic', color: '#C08552' }}>
              merece
            </Box>
            <br />
            tu mesa.
          </Typography>

          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 15,
              fontWeight: 300,
              lineHeight: 1.75,
              color: isDark ? 'rgba(243,233,220,0.7)' : 'rgba(46,24,16,0.65)',
              mb: 5,
              maxWidth: 420,
            }}
          >
            Pan artesanal y pastelería con ingredientes locales, horneados cada mañana con la misma
            dedicación de siempre.
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              href="#carta"
              sx={{
                bgcolor: '#5B3023',
                color: '#FAF5EE',
                px: 4,
                py: 1.75,
                fontSize: 13,
                '&:hover': { bgcolor: '#4a2519' },
              }}
            >
              Ver carta
            </Button>
            <Button
              href="#proceso"
              variant="outlined"
              sx={{
                color: isDark ? '#F3E9DC' : '#5B3023',
                px: 4,
                py: 1.6,
                fontSize: 13,
                borderColor: isDark ? 'rgba(243,233,220,0.25)' : 'rgba(91,48,35,0.25)',
                '&:hover': { borderColor: '#C08552', color: '#C08552', bgcolor: 'transparent' },
              }}
            >
              Cómo funciona
            </Button>
          </Stack>
        </Box>

        {/* Derecha — imagen con corte diagonal */}
        <Box sx={{ position: 'relative', height: { xs: 320, md: 560 } }}>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)',
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(46,24,16,0.18)',
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1725297952102-ab28892a31ab?w=800&h=900&fit=crop&auto=format"
              alt="Pan artesanal Al Horno"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: isDark
                  ? 'linear-gradient(to bottom, transparent 60%, rgba(26,13,7,0.4))'
                  : 'linear-gradient(to bottom, transparent 60%, rgba(250,245,238,0.2))',
              }}
            />
          </Box>

          {/* Badge flotante */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 40,
              left: -20,
              bgcolor: isDark ? '#2E1810' : '#FFFFFF',
              border: '1px solid rgba(192,133,82,0.2)',
              borderRadius: 1,
              px: 2.5,
              py: 2,
              boxShadow: '0 8px 32px rgba(46,24,16,0.12)',
            }}
          >
            <Typography sx={{ fontFamily: fonts.serif, fontSize: 28, color: '#C08552', lineHeight: 1 }}>
              +500
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: 11,
                color: isDark ? 'rgba(243,233,220,0.6)' : 'rgba(46,24,16,0.55)',
                mt: 0.5,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Clientes felices
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
