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
          gap: { xs: 5, md: 10 },
          alignItems: 'center',
        }}
      >
        {/* Imagen */}
        <Box sx={{ borderRadius: 1, overflow: 'hidden', boxShadow: '0 24px 64px rgba(46,24,16,0.14)', aspectRatio: '4/5' }}>
          <Box
            component="img"
            src="https://images.unsplash.com/flagged/photo-1561668038-2742fcef75d7?w=700&h=880&fit=crop&auto=format"
            alt="Panadero artesano de Al Horno amasando"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </Box>

        {/* Contenido */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Box sx={{ width: 32, height: 1, bgcolor: '#C08552' }} />
            <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C08552' }}>
              Nuestra historia
            </Typography>
          </Box>

          <Typography
            component="h2"
            sx={{ fontFamily: fonts.serif, fontSize: { xs: 32, md: 48 }, fontWeight: 300, fontStyle: 'italic', lineHeight: 1.15, color: '#C08552', mb: 3.5 }}
          >
            Desde el primer pan,
            <br />
            con el mismo amor.
          </Typography>

          <Typography
            sx={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: isDark ? 'rgba(243,233,220,0.7)' : 'rgba(46,24,16,0.65)', mb: 2 }}
          >
            Al Horno nació de una pasión profunda por el pan bien hecho: el que huele a madera encendida, el
            que tiene una corteza que cruje de verdad y una miga que abraza. Con raíces colombianas y técnica
            europea, cada hornada es un acto de amor.
          </Typography>
          <Typography
            sx={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: isDark ? 'rgba(243,233,220,0.7)' : 'rgba(46,24,16,0.65)', mb: 6 }}
          >
            Trabajamos con agricultores locales, fermentaciones largas y harinas sin mezclas industriales. El
            resultado habla por sí solo en cada mesa que alcanza.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pt: 4, borderTop: '1px solid rgba(192,133,82,0.2)' }}>
            <Typography sx={{ fontFamily: fonts.serif, fontSize: 72, fontWeight: 300, color: '#C08552', lineHeight: 1 }}>15</Typography>
            <Box>
              <Typography
                sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: isDark ? '#F3E9DC' : '#2E1810', mb: 0.5 }}
              >
                Años horneando
              </Typography>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 300, color: isDark ? 'rgba(243,233,220,0.55)' : 'rgba(46,24,16,0.5)' }}>
                Con el mismo amor de siempre
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
