import { Box, Typography, IconButton } from '@mui/material'
import { IconBrandInstagram, IconBrandFacebook, IconBrandX, IconMapPin, IconPhone, IconMail, IconClock } from '@tabler/icons-react'
import { ImageWithFallback } from '@shared/components/ImageWithFallback'
import { fonts } from '@app/theme/colors'
import logoImg from '@assets/img/logo_claro.png'

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
    <Box component="footer" id="footer" sx={{ bgcolor: '#2E1810', pt: 9 }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: 3,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.4fr 1fr 1.2fr 1.2fr' },
          gap: 6,
        }}
      >
        {/* Col 1: Logo + redes */}
        <Box>
          <Box sx={{ mb: 2 }}>
            <ImageWithFallback
              src={logoImg}
              alt="Al Horno — Panadería artesanal"
              style={{ height: 64, width: 'auto', objectFit: 'contain', borderRadius: '50%', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
            />
          </Box>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 300, lineHeight: 1.75, color: 'rgba(243,233,220,0.5)', mb: 3, maxWidth: 240 }}>
            Panadería artesanal colombiana con alma europea. Horneamos con amor desde hace 15 años.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {socials.map((s) => (
              <IconButton
                key={s.label}
                aria-label={s.label}
                sx={{
                  width: 36,
                  height: 36,
                  border: '1px solid rgba(192,133,82,0.25)',
                  borderRadius: 1,
                  color: '#C08552',
                  '&:hover': { borderColor: '#C08552', bgcolor: 'rgba(192,133,82,0.1)' },
                }}
              >
                {s.icon}
              </IconButton>
            ))}
          </Box>
        </Box>

        {/* Col 2: Navegación */}
        <Box>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C08552', mb: 2.5 }}>
            Navegación
          </Typography>
          {navLinks.map((link) => (
            <Typography
              key={link}
              component="a"
              href="#"
              sx={{ display: 'block', fontFamily: fonts.sans, fontSize: 13, fontWeight: 300, color: 'rgba(243,233,220,0.55)', textDecoration: 'none', mb: 1.25, '&:hover': { color: '#C08552' } }}
            >
              {link}
            </Typography>
          ))}
        </Box>

        {/* Col 3: Contacto */}
        <Box>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C08552', mb: 2.5 }}>
            Contacto
          </Typography>
          {contactItems.map((c, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.25, mb: 1.5, alignItems: 'flex-start' }}>
              <Box sx={{ color: '#C08552', mt: 0.25, flexShrink: 0 }}>{c.icon}</Box>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 300, color: 'rgba(243,233,220,0.55)', lineHeight: 1.5 }}>{c.text}</Typography>
            </Box>
          ))}
        </Box>

        {/* Col 4: Mensaje */}
        <Box>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C08552', mb: 1.5 }}>
            Atrévete
          </Typography>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 300, color: 'rgba(243,233,220,0.5)', mb: 2, lineHeight: 1.6 }}>
            Disfruta siempre de nuestro delicioso pan.
          </Typography>
        </Box>
      </Box>

      {/* Divider + copyright */}
      <Box sx={{ borderTop: '1px solid rgba(192,133,82,0.2)', mt: 7, px: 3, maxWidth: 1200, mx: 'auto', pt: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, color: 'rgba(243,233,220,0.3)', letterSpacing: '0.04em' }}>
            © 2026 Al Horno. Todos los derechos reservados a la institución educativa SENA
          </Typography>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, color: 'rgba(243,233,220,0.3)' }}>Hecho con amor en Colombia</Typography>
        </Box>
      </Box>
      <Box sx={{ height: 24 }} />
    </Box>
  )
}
