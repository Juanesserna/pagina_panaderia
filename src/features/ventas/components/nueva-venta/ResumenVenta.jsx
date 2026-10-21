import { Box, IconButton, Typography } from '@mui/material'
import { IconMinus, IconPlus, IconX } from '@tabler/icons-react'
import { Button } from '@shared/ui'
import FilterLabel from '../FilterLabel'

// Resumen de la venta: único lugar donde se modifica la cantidad.
export default function ResumenVenta({ items, total, puedeRegistrar, onCantidad, onQuitar, onRegistrar }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, minWidth: 0, width: '100%' }}>
      <FilterLabel>Resumen</FilterLabel>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, minHeight: 180, maxHeight: 380, overflowY: 'auto', flexGrow: 1 }}>
        {items.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Sin productos agregados
            </Typography>
          </Box>
        ) : (
          items.map((item, idx) => (
            <Box key={item.nombre} sx={{ px: 1.25, py: 0.875, borderTop: idx > 0 ? '1px solid' : 'none', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'action.hover', borderRadius: 0.7, mr: 1, border: '1px solid', borderColor: 'divider' }}>
                  <IconButton size="small" onClick={() => onCantidad(item.nombre, item.cantidad - 1)}><IconMinus size={11} /></IconButton>
                  <Typography variant="body1" sx={{ width: 22, textAlign: 'center' }}>{item.cantidad}</Typography>
                  <IconButton size="small" onClick={() => onCantidad(item.nombre, item.cantidad + 1)}><IconPlus size={11} /></IconButton>
                </Box>
                <Typography variant="body1" sx={{ flex: 1 }}>{item.nombre}</Typography>
                <Typography variant="body2" sx={{ mx: 1 }}>${(item.cantidad * item.precio).toFixed(2)}</Typography>
                <IconButton size="small" sx={{ color: 'error.main' }} onClick={() => onQuitar(item.nombre)}><IconX size={13} /></IconButton>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pt: 2, mt: 'auto' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>Total a pagar</Typography>
        <Typography variant="h6">${total.toFixed(2)}</Typography>
      </Box>

      <Button variant="primary" size="sm" fullWidth disabled={!puedeRegistrar} onClick={onRegistrar}>
        Registrar venta
      </Button>
    </Box>
  )
}
