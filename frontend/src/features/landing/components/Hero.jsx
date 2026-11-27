import { Box, Stack, Typography, Button } from '@mui/material'
import { fonts } from '@app/theme/colors'

// Imagen de fondo del Hero (croissants artesanales sobre superficie oscura)
const HERO_BG_IMAGE =
  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1920&q=85&fit=crop&auto=format'

// Intensidad de la animación de partículas de harina (0 a 1 para opacidad, duración en segundos)
const FLOUR_ANIMATION = {
  opacityScale: 0.75,
  particles: [
    { left: '6%', size: 3, duration: 11, delay: -2, opacity: 0.5, drift: 18 },
    { left: '14%', size: 2, duration: 14, delay: -7, opacity: 0.4, drift: -14 },
    { left: '22%', size: 4, duration: 12, delay: -4, opacity: 0.32, drift: 22 },
    { left: '31%', size: 2.5, duration: 15, delay: -9, opacity: 0.45, drift: -16 },
    { left: '39%', size: 3.5, duration: 10.5, delay: -1, opacity: 0.38, drift: 15 },
    { left: '48%', size: 2, duration: 13.5, delay: -6, opacity: 0.5, drift: -18 },
    { left: '56%', size: 4.5, duration: 11.5, delay: -8, opacity: 0.28, drift: 24 },
    { left: '63%', size: 2.5, duration: 14.5, delay: -3, opacity: 0.48, drift: -12 },
    { left: '70%', size: 3, duration: 12.5, delay: -10, opacity: 0.42, drift: 20 },
    { left: '78%', size: 5, duration: 16, delay: -5, opacity: 0.24, drift: -22 },
    { left: '84%', size: 2, duration: 10, delay: -4.5, opacity: 0.55, drift: 14 },
    { left: '91%', size: 3.5, duration: 13, delay: -7.5, opacity: 0.36, drift: -15 },
    { left: '18%', size: 2, duration: 12, delay: -11, opacity: 0.35, drift: 10 },
    { left: '44%', size: 3, duration: 15.5, delay: -2.5, opacity: 0.32, drift: 16 },
    { left: '66%', size: 2, duration: 11, delay: -6.5, opacity: 0.44, drift: -14 },
    { left: '74%', size: 3, duration: 13.5, delay: -1.5, opacity: 0.4, drift: 18 },
    { left: '88%', size: 2.5, duration: 14, delay: -9.5, opacity: 0.46, drift: -10 },
    { left: '95%', size: 2, duration: 12.5, delay: -3.5, opacity: 0.38, drift: -16 },
  ],
}

const reveal = (delay) => ({
  animation: 'heroFadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
  animationDelay: delay,
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
})

export function Hero({ isDark }) {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: { xs: '90vh', md: '96vh' },
        bgcolor: isDark ? '#150a03' : '#1A0D07',
        display: 'flex',
        alignItems: 'flex-start',
        pt: { xs: 14, sm: 16, md: 17 },
        pb: { xs: 9, md: 12 },
        overflow: 'hidden',
        '@keyframes heroFadeUp': {
          from: { opacity: 0, transform: 'translateY(18px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes flourFall': {
          '0%': {
            transform: 'translate3d(0, -10vh, 0)',
            opacity: 0,
          },
          '15%': {
            opacity: 1,
          },
          '85%': {
            opacity: 0.85,
          },
          '100%': {
            transform: 'translate3d(var(--flour-drift, 16px), 105vh, 0)',
            opacity: 0,
          },
        },
      }}
    >
      {/* Fotografía oscura de fondo */}
      <Box
        component="img"
        src={HERO_BG_IMAGE}
        alt="Croissants artesanales recién horneados con harina"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: { xs: '62% center', md: 'center center' },
          filter: 'brightness(0.76) contrast(1.06)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* Gradiente oscuro editorial para contraste del texto a la izquierda */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(21,10,3,0.9) 0%, rgba(26,13,7,0.74) 48%, rgba(26,13,7,0.44) 100%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(21,10,3,0.58) 0%, transparent 26%, rgba(21,10,3,0.68) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Capa sutil de harina cayendo */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 1,
          '@media (prefers-reduced-motion: reduce)': {
            display: 'none',
          },
        }}
      >
        {FLOUR_ANIMATION.particles.map((p, idx) => (
          <Box
            key={idx}
            sx={{
              position: 'absolute',
              top: 0,
              left: p.left,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              bgcolor: `rgba(250,245,238,${(p.opacity * FLOUR_ANIMATION.opacityScale).toFixed(2)})`,
              boxShadow: '0 0 6px rgba(243,233,220,0.35)',
              willChange: 'transform, opacity',
              '--flour-drift': `${p.drift}px`,
              animation: `flourFall ${p.duration}s linear ${p.delay}s infinite`,
            }}
          />
        ))}
      </Box>

      {/* Contenido alineado a la izquierda */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1200,
          mx: 'auto',
          px: 3,
          width: '100%',
        }}
      >
        <Box sx={{ maxWidth: 620 }}>
          <Stack direction="row" alignItems="center" spacing={1.75} sx={{ mb: 3, ...reveal('0.05s') }}>
            <Box sx={{ width: 44, height: '1px', bgcolor: '#C08552' }} />
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: { xs: 11, md: 11.5 },
                fontWeight: 500,
                letterSpacing: '0.22em',
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
              fontSize: { xs: 48, sm: 64, md: 82 },
              fontWeight: 300,
              lineHeight: 1.03,
              color: '#FAF5EE',
              mb: 3,
              letterSpacing: '-0.015em',
              ...reveal('0.14s'),
            }}
          >
            El sabor que{' '}
            <Box component="em" sx={{ fontStyle: 'italic', fontWeight: 400, color: '#C08552' }}>
              merece
            </Box>
            <br />
            tu mesa.
          </Typography>

          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: { xs: 15.5, md: 17 },
              fontWeight: 300,
              lineHeight: 1.75,
              color: 'rgba(243,233,220,0.84)',
              mb: 4.5,
              maxWidth: 480,
              ...reveal('0.22s'),
            }}
          >
            Pan artesanal y pastelería con ingredientes locales, horneados cada mañana con la misma
            dedicación de siempre.
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={reveal('0.3s')}>
            <Button
              href="#carta"
              variant="outlined"
              sx={{
                color: '#F3E9DC',
                borderRadius: '999px',
                px: 4.25,
                py: 1.55,
                fontFamily: fonts.sans,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderColor: 'rgba(243,233,220,0.45)',
                transition: 'border-color 0.3s ease, color 0.3s ease, background-color 0.3s ease',
                '&:hover': {
                  borderColor: '#C08552',
                  color: '#C08552',
                  bgcolor: 'rgba(243,233,220,0.06)',
                },
                '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '3px' },
                '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              }}
            >
              Ver productos
            </Button>
            <Button
              href="#proceso"
              variant="outlined"
              sx={{
                color: '#F3E9DC',
                borderRadius: '999px',
                px: 4.25,
                py: 1.55,
                fontFamily: fonts.sans,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderColor: 'rgba(243,233,220,0.45)',
                transition: 'border-color 0.3s ease, color 0.3s ease, background-color 0.3s ease',
                '&:hover': {
                  borderColor: '#C08552',
                  color: '#C08552',
                  bgcolor: 'rgba(243,233,220,0.06)',
                },
                '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '3px' },
              }}
            >
              Cómo funciona
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
