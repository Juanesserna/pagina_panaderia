import { Box, Drawer, Typography, IconButton, Button } from '@mui/material'
import { IconX, IconShoppingCart, IconTrash } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

function formatPrice(p) {
  return `$${p.toLocaleString('es-CO')}`
}

export function CartDrawer({ isOpen, onClose, items, onRemove, onUpdateQty, isDark }) {
  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0)

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: { width: 'min(420px, 100vw)', bgcolor: isDark ? '#2E1810' : '#FFFFFF', display: 'flex', flexDirection: 'column' },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5, borderBottom: '1px solid rgba(192,133,82,0.15)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <IconShoppingCart size={20} stroke={1.5} color="#C08552" />
          <Typography sx={{ fontFamily: fonts.serif, fontSize: 22, color: isDark ? '#F3E9DC' : '#2E1810' }}>Tu Pedido</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: isDark ? 'rgba(243,233,220,0.5)' : 'rgba(46,24,16,0.4)' }}>
          <IconX size={20} stroke={1.5} />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}>
        {items.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2, opacity: 0.5 }}>
            <IconShoppingCart size={48} stroke={1} color={isDark ? '#C08552' : '#5B3023'} />
            <Typography sx={{ fontFamily: fonts.serif, fontSize: 20, color: isDark ? '#F3E9DC' : '#2E1810' }}>
              Tu carrito está vacío
            </Typography>
            <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: isDark ? 'rgba(243,233,220,0.5)' : 'rgba(46,24,16,0.5)', textAlign: 'center' }}>
              Agrega productos de nuestra carta para comenzar tu pedido.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', gap: 1.75, py: 1.75, borderBottom: '1px solid rgba(192,133,82,0.1)' }}>
                <Box component="img" src={item.img} alt={item.name} sx={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 0.5, flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontFamily: fonts.serif, fontSize: 17, color: isDark ? '#F3E9DC' : '#2E1810', mb: 0.75, lineHeight: 1.2 }}>
                    {item.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        sx={{ width: 24, height: 24, border: '1px solid rgba(192,133,82,0.4)', borderRadius: 0.5, color: '#C08552', fontSize: 16 }}
                      >
                        −
                      </IconButton>
                      <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, color: isDark ? '#F3E9DC' : '#2E1810', minWidth: 16, textAlign: 'center' }}>
                        {item.qty}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        sx={{ width: 24, height: 24, border: '1px solid rgba(192,133,82,0.4)', borderRadius: 0.5, color: '#C08552', fontSize: 16 }}
                      >
                        +
                      </IconButton>
                    </Box>
                    <Typography sx={{ fontFamily: fonts.serif, fontSize: 18, color: '#C08552' }}>
                      {formatPrice(item.price * item.qty)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => onRemove(item.id)}
                  sx={{ color: 'rgba(192,133,82,0.4)', alignSelf: 'flex-start', '&:hover': { color: '#C08552' } }}
                >
                  <IconTrash size={16} stroke={1.5} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Footer */}
      {items.length > 0 && (
        <Box sx={{ px: 3, py: 2.5, borderTop: '1px solid rgba(192,133,82,0.15)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isDark ? 'rgba(243,233,220,0.55)' : 'rgba(46,24,16,0.5)',
              }}
            >
              Subtotal
            </Typography>
            <Typography sx={{ fontFamily: fonts.serif, fontSize: 26, color: isDark ? '#F3E9DC' : '#2E1810' }}>
              {formatPrice(subtotal)}
            </Typography>
          </Box>
          <Button
            fullWidth
            sx={{ bgcolor: '#5B3023', color: '#FAF5EE', py: 1.75, fontSize: 13, '&:hover': { bgcolor: '#4a2519' } }}
          >
            Confirmar pedido
          </Button>
        </Box>
      )}
    </Drawer>
  )
}
