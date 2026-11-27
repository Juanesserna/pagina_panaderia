import { Box, Drawer, Typography, IconButton, Button } from '@mui/material'
import { IconX, IconShoppingCart, IconTrash } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'


function formatPrice(p) {
  return `$${p.toLocaleString('es-CO')}`
}

export function CartDrawer({ isOpen, onClose, items, onRemove, onUpdateQty, onCheckout, isDark }) {
  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0)

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 'min(420px, 100vw)',
          borderRadius: 0,
          bgcolor: isDark ? '#2E1810' : '#FFFFFF',
          borderLeft: '1px solid rgba(192,133,82,0.22)',
          boxShadow: '-12px 0 40px rgba(46,24,16,0.14)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5, borderBottom: '1px solid rgba(192,133,82,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <IconShoppingCart size={20} stroke={1.5} color="#C08552" />
          <Typography sx={{ fontFamily: fonts.serif, fontSize: 24, fontWeight: 400, color: isDark ? '#F3E9DC' : '#2E1810' }}>
            Tu Pedido
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Cerrar carrito"
          sx={{
            color: isDark ? 'rgba(243,233,220,0.65)' : 'rgba(46,24,16,0.55)',
            borderRadius: '2px',
            '&:hover': { color: '#C08552', bgcolor: 'rgba(192,133,82,0.08)' },
            '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
          }}
        >
          <IconX size={20} stroke={1.5} />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}>
        {items.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2, px: 2 }}>
            <IconShoppingCart size={46} stroke={1.1} color="#C08552" />
            <Typography sx={{ fontFamily: fonts.serif, fontSize: 22, fontWeight: 400, color: isDark ? '#F3E9DC' : '#2E1810' }}>
              Tu carrito está vacío
            </Typography>
            <Typography sx={{ fontFamily: fonts.sans, fontSize: 13.5, fontWeight: 300, lineHeight: 1.65, color: isDark ? 'rgba(243,233,220,0.62)' : 'rgba(46,24,16,0.58)', textAlign: 'center', maxWidth: 260 }}>
              Agrega productos de nuestro catálogo para comenzar tu pedido.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {items.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', gap: 1.75, py: 2, borderBottom: '1px solid rgba(192,133,82,0.14)' }}>
                <Box
                  component="img"
                  src={item.img}
                  alt={item.name}
                  sx={{ width: 68, height: 68, objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(192,133,82,0.2)', flexShrink: 0 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontFamily: fonts.serif, fontSize: 18, fontWeight: 400, color: isDark ? '#F3E9DC' : '#2E1810', mb: 1, lineHeight: 1.2 }}>
                    {item.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        aria-label={`Disminuir cantidad de ${item.name}`}
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        sx={{
                          width: 26,
                          height: 26,
                          border: '1px solid rgba(192,133,82,0.4)',
                          borderRadius: '2px',
                          color: '#C08552',
                          fontSize: 15,
                          '&:hover': { bgcolor: '#C08552', color: '#FAF5EE', borderColor: '#C08552' },
                          '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '1px' },
                        }}
                      >
                        −
                      </IconButton>
                      <Typography sx={{ fontFamily: fonts.sans, fontSize: 13.5, fontWeight: 400, color: isDark ? '#F3E9DC' : '#2E1810', minWidth: 18, textAlign: 'center' }}>
                        {item.qty}
                      </Typography>
                      <IconButton
                        size="small"
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        sx={{
                          width: 26,
                          height: 26,
                          border: '1px solid rgba(192,133,82,0.4)',
                          borderRadius: '2px',
                          color: '#C08552',
                          fontSize: 15,
                          '&:hover': { bgcolor: '#C08552', color: '#FAF5EE', borderColor: '#C08552' },
                          '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '1px' },
                        }}
                      >
                        +
                      </IconButton>
                    </Box>
                    <Typography sx={{ fontFamily: fonts.serif, fontSize: 19, fontWeight: 400, color: '#C08552' }}>
                      {formatPrice(item.price * item.qty)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  aria-label={`Quitar ${item.name}`}
                  onClick={() => onRemove(item.id)}
                  sx={{
                    color: isDark ? 'rgba(243,233,220,0.45)' : 'rgba(46,24,16,0.4)',
                    borderRadius: '2px',
                    alignSelf: 'flex-start',
                    transition: 'color 0.25s ease',
                    '&:hover': { color: '#C08552', bgcolor: 'rgba(192,133,82,0.08)' },
                    '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
                  }}
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
        <Box sx={{ px: 3, py: 2.75, borderTop: '1px solid rgba(192,133,82,0.2)', bgcolor: isDark ? '#1A0D07' : '#FAF5EE' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2.25 }}>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: 11.5,
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: isDark ? 'rgba(243,233,220,0.65)' : 'rgba(46,24,16,0.58)',
              }}
            >
              Subtotal
            </Typography>
            <Typography sx={{ fontFamily: fonts.serif, fontSize: 28, fontWeight: 400, color: isDark ? '#F3E9DC' : '#2E1810' }}>
              {formatPrice(subtotal)}
            </Typography>
          </Box>
          <Button
            fullWidth
            onClick={onCheckout}
            sx={{
              bgcolor: '#5B3023',
              color: '#FAF5EE',
              borderRadius: '2px',
              py: 1.75,
              fontFamily: fonts.sans,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              transition: 'background-color 0.25s ease',
              '&:hover': { bgcolor: '#4a2519' },
              '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
            }}
          >
            Confirmar pedido
          </Button>
        </Box>
      )}
    </Drawer>
  )
}
