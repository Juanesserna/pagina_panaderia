import { Box, Typography, Button } from '@mui/material'
import { IconArrowLeft } from '@tabler/icons-react'
import { getColors, fonts } from '@app/theme/colors'

import logoClaro from '@assets/img/logo_claro.webp'
import logoOscuro from '@assets/img/logo_oscuro.webp'
import bakeryImage from '@assets/img/auth-bakery.webp'

export default function AuthLayout({
  open,
  onClose,
  title,
  description,
  children,
  isDark = false,
  submitting = false,
  wide = false,
  image = bakeryImage,
  backLabel = 'Volver al inicio',
}) {
  const c = getColors(isDark)

  const paperBg = isDark ? '#2A1D16' : '#FFFCF8'
  const textColor = isDark ? '#F2E9DD' : '#4A2E17'
  const mutedColor = isDark ? '#C4B5A6' : '#796655'

  if (!open) return null

  return (
    <Box
      component="main"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          md: 'minmax(0, 3fr) minmax(0, 2fr)',
        },
        width: '100%',
        minHeight: '100dvh',
        boxSizing: 'border-box',
        bgcolor: paperBg,
      }}
    >
      {/* Panel izquierdo: autenticación */}
      <Box
        component="section"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100dvh',
          boxSizing: 'border-box',
          px: { xs: 3, sm: 5, lg: 6 },
          py: wide ? 1 : 2,
        }}
      >
        {/* Navegación hacia la página principal */}
        <Button
          type="button"
          onClick={onClose}
          disabled={submitting}
          startIcon={<IconArrowLeft size={18} />}
          sx={{
            alignSelf: 'flex-start',
            color: mutedColor,
            fontFamily: fonts.sans,
            fontSize: 13,
            textTransform: 'none',
            px: 0,
            mb: wide ? 0.5 : 1,
            '&:hover': {
              color: c.accent,
              bgcolor: 'transparent',
            },
          }}
        >
          {backLabel}
        </Button>

        {/* Contenido del formulario */}
        <Box
          sx={{
            width: '100%',
            maxWidth: wide ? 620 : 440,
            minWidth: 0,
            boxSizing: 'border-box',
            mx: 'auto',
            my: 'auto',
            py: wide ? 0 : 2,
          }}
        >
          {/* Logo y encabezado centrados */}
          <Box
            key={title}
            sx={{
              textAlign: 'center',
              mb: wide ? 1.25 : 3,
              animation: 'authHeadingIn 300ms ease-out',

              '@keyframes authHeadingIn': {
                from: {
                  opacity: 0,
                  transform: 'translateY(8px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },

              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
              },
            }}
          >
            <Box
              component="img"
              src={isDark ? logoOscuro : logoClaro}
              alt="Al Horno"
              sx={{
                width: wide ? 52 : 85,
                height: wide ? 52 : 85,
                objectFit: 'contain',
                mb: wide ? 0.25 : 1.5,
              }}
            />

            <Typography
              component="h1"
              sx={{
                fontFamily: fonts.serif,
                fontSize: {
                  xs: 26,
                  sm: wide ? 28 : 36,
                },
                fontWeight: 500,
                lineHeight: 1.2,
                color: textColor,
                mb: wide ? 0.5 : 0.75,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: 13,
                lineHeight: 1.5,
                color: mutedColor,
              }}
            >
              {description}
            </Typography>
          </Box>

          {children}
        </Box>
      </Box>

      {/* Panel derecho: fotografía de marca */}
      <Box
        component="aside"
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'sticky',
          top: 0,
          height: '100dvh',
          minWidth: 0,
          boxSizing: 'border-box',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden',
          bgcolor: '#382318',
          color: '#FFFFFF',
          p: { md: 4, lg: 6 },
        }}
      >
        {image && (
          <Box
            component="img"
            src={image}
            alt=""
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 25%',
              animation: 'authImageIn 500ms ease-out',

              '@keyframes authImageIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },

              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
              },
            }}
          />
        )}

        {/* Contraste sobre la fotografía */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
                'linear-gradient(180deg, transparent 50%, rgba(30,16,8,0.15) 70%, rgba(30,16,8,0.65) 100%)',
          }}
        />

        {/* Mensaje de identidad de Al Horno */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 440,
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.serif,
              fontSize: { md: 32, lg: 44 },
              lineHeight: 1.2,
              fontWeight: 500,
              mb: 1.5,
            }}
          >
            El sabor de lo hecho con amor.
          </Typography>

          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 14,
              lineHeight: 1.7,
              color: '#F2E9DD',
            }}
          >
            Disfruta cada momento con Al Horno.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
