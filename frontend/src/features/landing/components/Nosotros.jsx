import { Box, Typography } from '@mui/material'
import { fonts } from '@app/theme/colors'

export function Nosotros({ isDark }) {
  return (
    <Box component="section" id="nosotros" sx={{ bgcolor: isDark ? '#1A0D07' : '#FAF5EE', py: { xs: 8, md: 12.5 } }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: 3,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 6, md: 10 },
          alignItems: 'center',
        }}
      >
        {/* Imagen con marco editorial */}
        <Box
          sx={{
            p: { xs: 1.25, md: 1.75 },
            border: '1px solid rgba(192,133,82,0.28)',
            borderRadius: '2px',
            bgcolor: isDark ? '#2E1810' : '#FFFFFF',
            boxShadow: '0 24px 60px rgba(46,24,16,0.12)',
          }}
        >
          <Box sx={{ borderRadius: '2px', overflow: 'hidden', aspectRatio: '4/5' }}>
            <Box
              component="img"
              src="https://images.unsplash.com/flagged/photo-1561668038-2742fcef75d7?w=700&h=880&fit=crop&auto=format"
              alt="Panadero artesano de Al Horno amasando"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </Box>
        </Box>

        {/* Contenido */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 2.5 }}>
            <Box sx={{ width: 36, height: '1px', bgcolor: '#C08552' }} />
            <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C08552' }}>
              Nuestra historia
            </Typography>
          </Box>

          <Typography
            component="h2"
            sx={{ fontFamily: fonts.serif, fontSize: { xs: 34, md: 48 }, fontWeight: 300, fontStyle: 'italic', lineHeight: 1.12, color: '#C08552', mb: 3.5 }}
          >
            Desde el primer pan,
            <br />
            con el mismo amor.
          </Typography>

          <Typography
            sx={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 300, lineHeight: 1.85, color: isDark ? 'rgba(243,233,220,0.74)' : 'rgba(46,24,16,0.68)', mb: 2.25 }}
          >
            Al Horno nació de una pasión profunda por el pan bien hecho: el que huele a madera encendida, el
            que tiene una corteza que cruje de verdad y una miga que abraza. Con raíces colombianas y técnica
            europea, cada hornada es un acto de amor.
          </Typography>
          <Typography
            sx={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 300, lineHeight: 1.85, color: isDark ? 'rgba(243,233,220,0.74)' : 'rgba(46,24,16,0.68)', mb: 6 }}
          >
            Trabajamos con agricultores locales, fermentaciones largas y harinas sin mezclas industriales. El
            resultado habla por sí solo en cada mesa que alcanza.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pt: 4, borderTop: '1px solid rgba(192,133,82,0.25)' }}>
            <Typography sx={{ fontFamily: fonts.serif, fontSize: { xs: 60, md: 72 }, fontWeight: 300, color: '#C08552', lineHeight: 1 }}>
              15
            </Typography>
            <Box>
              <Typography
                sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: isDark ? '#F3E9DC' : '#2E1810', mb: 0.5 }}
              >
                Años horneando
              </Typography>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 300, color: isDark ? 'rgba(243,233,220,0.6)' : 'rgba(46,24,16,0.55)' }}>
                Con el mismo amor de siempre
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
