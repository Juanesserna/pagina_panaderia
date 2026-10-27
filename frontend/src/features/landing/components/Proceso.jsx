import { Box, Typography } from '@mui/material'
import { IconClipboardList, IconCheck, IconTruck } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

const steps = [
  {
    num: '01',
    icon: <IconClipboardList size={22} stroke={1.5} />,
    title: 'Elige',
    desc: 'Navega nuestra carta y selecciona tus productos favoritos con total facilidad.',
  },
  {
    num: '02',
    icon: <IconCheck size={22} stroke={1.5} />,
    title: 'Confirma',
    desc: 'Revisa tu pedido, escoge la fecha de entrega y completa tu información.',
  },
  {
    num: '03',
    icon: <IconTruck size={22} stroke={1.5} />,
    title: 'Recibe',
    desc: 'Llevamos tu pedido recién horneado directamente a la puerta de tu casa.',
  },
]

export function Proceso({ isDark }) {
  return (
    <Box component="section" id="proceso" sx={{ bgcolor: isDark ? '#150a03' : '#FFFFFF', py: { xs: 8, md: 12.5 }, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C08552', display: 'block', mb: 2 }}>
            Simple y directo
          </Typography>
          <Typography component="h2" sx={{ fontFamily: fonts.serif, fontSize: { xs: 32, md: 48 }, fontWeight: 300, color: isDark ? '#F3E9DC' : '#2E1810' }}>
            Proceso de pedido
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 6, md: 0 }, position: 'relative' }}>
          {/* Línea conectora (solo desktop) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: 40,
              left: '16.66%',
              right: '16.66%',
              height: 1,
              bgcolor: 'rgba(192,133,82,0.3)',
              zIndex: 0,
            }}
          />

          {steps.map((step, i) => (
            <Box key={i} sx={{ textAlign: 'center', px: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
              <Typography
                aria-hidden
                sx={{
                  position: 'absolute',
                  top: -24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: fonts.serif,
                  fontSize: 120,
                  fontWeight: 300,
                  color: 'rgba(91,48,35,0.07)',
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {step.num}
              </Typography>

              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  border: '1px solid rgba(192,133,82,0.3)',
                  bgcolor: isDark ? '#2E1810' : '#FAF5EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3.5,
                  color: '#C08552',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {step.icon}
              </Box>

              <Typography sx={{ fontFamily: fonts.serif, fontSize: 26, color: isDark ? '#F3E9DC' : '#2E1810', mb: 1.5 }}>{step.title}</Typography>
              <Typography
                sx={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 300, lineHeight: 1.7, color: isDark ? 'rgba(243,233,220,0.6)' : 'rgba(46,24,16,0.55)', maxWidth: 240, mx: 'auto' }}
              >
                {step.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
