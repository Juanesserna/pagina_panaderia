import { Box, Typography, IconButton } from '@mui/material'
import { IconBrandInstagram, IconBrandFacebook, IconBrandX, IconMapPin, IconPhone, IconMail, IconClock } from '@tabler/icons-react'
import { ImageWithFallback } from '@shared/components/ImageWithFallback'
import { fonts } from '@app/theme/colors'
import logoImg from '@assets/img/logo_claro.webp'

const navLinks = ['Carta', 'Nosotros', 'Pedidos', 'Eventos especiales', 'Blog']

const contactItems = [
  { icon: <IconMapPin size={14} stroke={1.5} />, text: 'Calle 93 #11-26, Bogotá' },
  { icon: <IconPhone size={14} stroke={1.5} />, text: '+57 301 234 5678' },
  { icon: <IconMail size={14} stroke={1.5} />, text: 'hola@alhorno.co' },
  { icon: <IconClock size={14} stroke={1.5} />, text: 'Lun–Sáb: 7am – 8pm' },
]

const socials = [
  { icon: <IconBrandInstagram size={18} stroke={1.5} />, label: 'Instagram' },
  { icon: <IconBrandFacebook size={18} stroke={1.5} />, label: 'Facebook' },
  { icon: <IconBrandX size={18} stroke={1.5} />, label: 'X' },
]

export function Footer() {
  return (
    <Box component="footer" id="footer" sx={{ bgcolor: '#241109', borderTop: '1px solid rgba(192,133,82,0.35)', pt: { xs: 8, md: 10 }, pb: 4 }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: 3,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.4fr 1fr 1.2fr 1.2fr' },
          gap: { xs: 5, md: 6 },
        }}
      >
        {/* Col 1: Logo + redes */}
        <Box>
          <Box sx={{ mb: 2.5, display: 'inline-flex', p: '2px', borderRadius: '50%', border: '1px solid rgba(192,133,82,0.35)' }}>
            <ImageWithFallback
              src={logoImg}
              alt="Al Horno — Panadería artesanal"
              style={{ height: 60, width: 60, objectFit: 'contain', borderRadius: '50%', display: 'block' }}
            />
          </Box>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 13.5, fontWeight: 300, lineHeight: 1.8, color: 'rgba(245,236,224,0.88)', mb: 3, maxWidth: 250 }}>
            Panadería artesanal colombiana con alma europea. Horneamos con amor desde hace 15 años.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.25 }}>
            {socials.map((s) => (
              <IconButton
                key={s.label}
                aria-label={s.label}
                sx={{
                  width: 36,
                  height: 36,
                  border: '1px solid rgba(192,133,82,0.45)',
                  borderRadius: '2px',
                  color: '#C88A55',
                  transition: 'border-color 0.25s ease, background-color 0.25s ease, color 0.25s ease',
                  '&:hover': { borderColor: '#C88A55', bgcolor: 'rgba(192,133,82,0.16)', color: '#FAF5EE' },
                  '&:focus-visible': { outline: '2px solid #C88A55', outlineOffset: '2px' },
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }}
              >
                {s.icon}
              </IconButton>
            ))}
          </Box>
        </Box>

        {/* Col 2: Navegación */}
        <Box>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C88A55', mb: 2.5 }}>
            Navegación
          </Typography>
          {navLinks.map((link) => (
            <Typography
              key={link}
              component="a"
              href="#"
              sx={{
                display: 'block',
                fontFamily: fonts.sans,
                fontSize: 13.5,
                fontWeight: 300,
                color: 'rgba(245,236,224,0.9)',
                textDecoration: 'none',
                mb: 1.35,
                transition: 'color 0.25s ease',
                '&:hover': { color: '#C08552' },
                '&:focus-visible': { outline: '2px solid #C88A55', outlineOffset: '2px', borderRadius: '2px' },
                '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              }}
            >
              {link}
            </Typography>
          ))}
        </Box>

        {/* Col 3: Contacto */}
        <Box>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C88A55', mb: 2.5 }}>
            Contacto
          </Typography>
          {contactItems.map((c, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.25, mb: 1.5, alignItems: 'flex-start' }}>
              <Box sx={{ color: '#C88A55', mt: 0.25, flexShrink: 0 }}>{c.icon}</Box>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13.5, fontWeight: 300, color: 'rgba(245,236,224,0.9)', lineHeight: 1.55 }}>{c.text}</Typography>
            </Box>
          ))}
        </Box>

        {/* Col 4: Mensaje */}
        <Box>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C88A55', mb: 2.5 }}>
            Atrévete
          </Typography>
          <Typography sx={{ fontFamily: fonts.serif, fontSize: 20, fontStyle: 'italic', fontWeight: 300, color: '#F3E9DC', mb: 1, lineHeight: 1.4 }}>
            Disfruta siempre de nuestro delicioso pan.
          </Typography>
          <Box sx={{ width: 32, height: '1px', bgcolor: 'rgba(192,133,82,0.45)', mt: 2 }} />
        </Box>
      </Box>

      {/* Divider + copyright */}
      <Box sx={{ borderTop: '1px solid rgba(192,133,82,0.25)', mt: 7, px: 3, maxWidth: 1200, mx: 'auto', pt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 11.5, fontWeight: 300, color: 'rgba(243,233,220,0.72)', letterSpacing: '0.04em' }}>
            © 2026 Al Horno. Todos los derechos reservados a la institución educativa SENA
          </Typography>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 11.5, fontWeight: 300, color: 'rgba(243,233,220,0.72)' }}>
            Hecho con amor en Colombia
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
