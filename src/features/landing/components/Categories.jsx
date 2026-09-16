import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { fonts } from '@app/theme/colors'

const categories = [
  {
    name: 'Pan Artesanal',
    img: 'https://images.unsplash.com/photo-1587912001191-0cd4f14fd89e?w=600&h=600&fit=crop&auto=format',
    alt: 'Pan artesanal recién horneado',
  },
  {
    name: 'Pastelería',
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop&auto=format',
    alt: 'Croissants y pastelería fina',
  },
  {
    name: 'Tortas Personalizadas',
    img: 'https://images.unsplash.com/photo-1604413191066-4dd20bedf486?w=600&h=600&fit=crop&auto=format',
    alt: 'Tortas de celebración personalizadas',
  },
  {
    name: 'Bebidas Calientes',
    img: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&h=600&fit=crop&auto=format',
    alt: 'Café artesanal',
  },
]

export function Categories({ isDark }) {
  const [hovered, setHovered] = useState(null)

  return (
    <Box component="section" id="carta" sx={{ bgcolor: isDark ? '#1A0D07' : '#FAF5EE', py: { xs: 8, md: 12.5 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#C08552',
              display: 'block',
              mb: 2,
            }}
          >
            Lo que preparamos
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: fonts.serif,
              fontSize: { xs: 36, md: 48 },
              fontWeight: 300,
              color: isDark ? '#F3E9DC' : '#2E1810',
              lineHeight: 1.15,
            }}
          >
            Nuestra Carta
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {categories.map((cat, i) => (
            <Box
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              sx={{
                bgcolor: isDark ? '#2E1810' : '#FFFFFF',
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: hovered === i ? '0 8px 32px rgba(46,24,16,0.14)' : '0 2px 12px rgba(46,24,16,0.06)',
                borderBottom: hovered === i ? '2px solid #C08552' : '2px solid transparent',
                transition: 'box-shadow 0.25s, border-color 0.25s',
              }}
            >
              <Box sx={{ aspectRatio: '1/1', overflow: 'hidden' }}>
                <Box
                  component="img"
                  src={cat.img}
                  alt={cat.alt}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                    transform: hovered === i ? 'scale(1.04)' : 'scale(1)',
                  }}
                />
              </Box>
              <Box sx={{ px: 2.5, pt: 2.5, pb: 2.75 }}>
                <Typography
                  sx={{
                    fontFamily: fonts.serif,
                    fontSize: 20,
                    color: isDark ? '#F3E9DC' : '#2E1810',
                    letterSpacing: '0.01em',
                  }}
                >
                  {cat.name}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
