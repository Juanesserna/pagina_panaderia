// src/features/landing/pages/CheckoutPage.jsx
import { Link as RouterLink, useNavigate, useOutletContext } from 'react-router-dom'
import { Box, Typography, Button, IconButton } from '@mui/material'
import { IconInfoCircle, IconTrash, IconBuildingStore } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { formatPrice } from '../components/Products'
import { useCart } from '../context/CartContext'
import { ROUTES } from '@app/router/routes' // ← ajusta esta ruta

export default function CheckoutPage() {
  const { isDark } = useOutletContext()
  const navigate = useNavigate()
  const { items, count, subtotal, updateQty, removeItem } = useCart()

  const text = isDark ? '#F3E9DC' : '#2E1810'
  const muted = isDark ? 'rgba(243,233,220,0.6)' : 'rgba(46,24,16,0.55)'
  const cardBg = isDark ? '#2E1810' : '#FFFFFF'
  const wrap = {
    bgcolor: isDark ? '#150a03' : '#F7F0E6',
    pt: { xs: 14, md: 16 },
    pb: { xs: 8, md: 12.5 },
    minHeight: '100vh',
  }

  // Sin datos por ahora: al pagar se envía al login (el carrito queda guardado)
  const handlePagar = () => navigate(ROUTES.LOGIN, { state: { from: ROUTES.CHECKOUT } })

  /* ───────── Carrito vacío ───────── */
  if (items.length === 0) {
    return (
      <Box component="section" sx={wrap}>
        <Box sx={{ maxWidth: 560, mx: 'auto', px: 3, textAlign: 'center' }}>
          <Typography component="h1" sx={{ fontFamily: fonts.serif, fontSize: 36, fontWeight: 300, color: text, mb: 2 }}>
            Tu pedido está vacío
          </Typography>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, color: muted, mb: 4 }}>
            Agrega productos del catálogo para continuar.
          </Typography>
          <Button
            component={RouterLink}
            to={ROUTES.CATALOGO}
            sx={{ bgcolor: '#5B3023', color: '#FAF5EE', px: 4, py: 1.5, fontSize: 13, '&:hover': { bgcolor: '#4a2519' } }}
          >
            Ver catálogo
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box component="section" sx={wrap}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3 }}>
        <Typography
          component="h1"
          sx={{ fontFamily: fonts.serif, fontSize: { xs: 34, md: 46 }, fontWeight: 300, color: text, mb: 3 }}
        >
          Tu pedido
        </Typography>

        {/* Aviso informativo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            bgcolor: isDark ? 'rgba(192,133,82,0.12)' : 'rgba(192,133,82,0.1)',
            border: '1px solid rgba(192,133,82,0.35)',
            borderRadius: 1,
            px: 2.5,
            py: 2,
            mb: 5,
          }}
        >
          <Box sx={{ color: '#C08552', display: 'flex', mt: 0.25 }}>
            <IconInfoCircle size={20} stroke={1.5} />
          </Box>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, lineHeight: 1.6, color: text }}>
            Para realizar un pedido debes estar registrado. Al pagar te llevaremos a iniciar sesión y tus
            productos seguirán guardados en tu carrito.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' },
            gap: { xs: 4, md: 5 },
            alignItems: 'start',
          }}
        >
          {/* ───────── Artículos ───────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  gap: { xs: 2, sm: 2.5 },
                  bgcolor: cardBg,
                  borderRadius: 1,
                  p: 2,
                  boxShadow: '0 2px 12px rgba(46,24,16,0.06)',
                }}
              >
                <Box
                  component="img"
                  src={item.img}
                  alt={item.name}
                  sx={{ width: { xs: 84, sm: 112 }, height: { xs: 84, sm: 112 }, objectFit: 'cover', borderRadius: 0.75, flexShrink: 0 }}
                />

                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontFamily: fonts.serif, fontSize: { xs: 18, sm: 21 }, color: text, lineHeight: 1.2 }}>
                        {item.name}
                      </Typography>
                      <Typography sx={{ fontFamily: fonts.sans, fontSize: 12, color: muted, mt: 0.5 }}>
                        {formatPrice(item.price)} c/u
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => removeItem(item.id)}
                      aria-label={`Quitar ${item.name}`}
                      sx={{ color: 'rgba(192,133,82,0.5)', alignSelf: 'flex-start', '&:hover': { color: '#C08552' } }}
                    >
                      <IconTrash size={18} stroke={1.5} />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label="Disminuir cantidad"
                        sx={{ width: 28, height: 28, border: '1px solid rgba(192,133,82,0.4)', borderRadius: 0.5, color: '#C08552', fontSize: 16 }}
                      >
                        −
                      </IconButton>
                      <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, color: text, minWidth: 20, textAlign: 'center' }}>
                        {item.qty}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label="Aumentar cantidad"
                        sx={{ width: 28, height: 28, border: '1px solid rgba(192,133,82,0.4)', borderRadius: 0.5, color: '#C08552', fontSize: 16 }}
                      >
                        +
                      </IconButton>
                    </Box>
                    <Typography sx={{ fontFamily: fonts.serif, fontSize: 20, color: '#C08552' }}>
                      {formatPrice(item.price * item.qty)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* ───────── Resumen de pago ───────── */}
          <Box
            sx={{
              bgcolor: cardBg,
              borderRadius: 1,
              p: 3,
              boxShadow: '0 2px 12px rgba(46,24,16,0.06)',
              position: { md: 'sticky' },
              top: { md: 88 },
            }}
          >
            <Typography sx={{ fontFamily: fonts.serif, fontSize: 24, color: text, mb: 2.5 }}>
              Resumen de pago
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.25 }}>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, color: muted }}>
                Productos ({count})
              </Typography>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, color: text }}>{formatPrice(subtotal)}</Typography>
            </Box>

            <Box sx={{ borderTop: '1px solid rgba(192,133,82,0.2)', mt: 2, pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted }}>
                Total
              </Typography>
              <Typography sx={{ fontFamily: fonts.serif, fontSize: 30, color: text }}>{formatPrice(subtotal)}</Typography>
            </Box>

            <Button
              fullWidth
              onClick={handlePagar}
              sx={{ mt: 3, bgcolor: '#5B3023', color: '#FAF5EE', py: 1.75, fontSize: 13, '&:hover': { bgcolor: '#4a2519' } }}
            >
              Confirmar y pagar
            </Button>
            <Button
              component={RouterLink}
              to={ROUTES.CATALOGO}
              fullWidth
              sx={{ mt: 1, color: '#C08552', fontSize: 13, '&:hover': { bgcolor: 'rgba(192,133,82,0.08)' } }}
            >
              Seguir comprando
            </Button>

            {/* Nota de recogida */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.25,
                mt: 2.5,
                pt: 2.5,
                borderTop: '1px solid rgba(192,133,82,0.2)',
              }}
            >
              <Box sx={{ color: '#C08552', display: 'flex', mt: 0.25 }}>
                <IconBuildingStore size={18} stroke={1.5} />
              </Box>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, lineHeight: 1.6, color: muted }}>
                El pedido se debe recoger en el local.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}