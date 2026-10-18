import { Box, Typography } from '@mui/material'
import { IconStar } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

const testimonials = [
  {
    name: 'María Camila Ríos',
    review:
      'El sourdough de Al Horno es, sin exagerar, el mejor que he comido fuera de Europa. La corteza, la miga, el sabor... todo es perfecto.',
    stars: 5,
    label: 'Cliente desde 2020',
  },
  {
    name: 'Andrés Felipe Torres',
    review:
      'Pedí la torta para el cumpleaños de mi esposa y todos quedaron sin palabras. Visualmente impecable y el sabor superó las expectativas.',
    stars: 5,
    label: 'Cliente desde 2019',
  },
  {
    name: 'Valentina Morales',
    review:
      'Los croissants llegan siempre frescos y crujientes. Es un lujo tenerlos en casa un domingo por la mañana. No cambio a Al Horno por nada.',
    stars: 5,
    label: 'Cliente desde 2022',
  },
]

export function Testimonios() {
  return (
    <Box component="section" sx={{ bgcolor: '#5B3023', py: { xs: 8, md: 12.5 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(250,245,238,0.5)', display: 'block', mb: 2 }}>
            Lo que dicen
          </Typography>
          <Typography component="h2" sx={{ fontFamily: fonts.serif, fontSize: { xs: 32, md: 48 }, fontWeight: 300, color: '#FAF5EE' }}>
            Palabras que nos inspiran
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {testimonials.map((t, i) => (
            <Box key={i} sx={{ bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(192,133,82,0.15)', borderRadius: 1, p: 3.5 }}>
              <Box sx={{ display: 'flex', gap: 0.5, mb: 2.5 }}>
                {Array.from({ length: t.stars }).map((_, si) => (
                  <IconStar key={si} size={14} stroke={0} fill="#C08552" color="#C08552" />
                ))}
              </Box>

              <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 300, lineHeight: 1.75, color: 'rgba(250,245,238,0.75)', mb: 3, fontStyle: 'italic' }}>
                "{t.review}"
              </Typography>

              <Box>
                <Typography sx={{ fontFamily: fonts.serif, fontSize: 17, color: '#C08552', mb: 0.25 }}>{t.name}</Typography>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, letterSpacing: '0.08em', color: 'rgba(250,245,238,0.35)', textTransform: 'uppercase' }}>
                  {t.label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
