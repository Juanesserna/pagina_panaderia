import { Box, Typography, IconButton } from '@mui/material'
import { IconPlus, IconMinus, IconX } from '@tabler/icons-react'
import { Button } from '@shared/ui'
import FilterLabel from '@features/produccion/components/common/FilterLabel'

// Resumen (único lugar donde se modifica la cantidad)
export default function ResumenOrden({ items, onQuitar, onActualizarCantidad, onConfirmar }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 0 }}>
      <FilterLabel>Resumen</FilterLabel>
      <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 1.5, overflowY: 'auto', minHeight: 180, maxHeight: 380, flexGrow: 1, border: '1px solid', borderColor: 'divider' }}>
        {items.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, px: 1.5, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'text.dim' }}>
              Sin productos agregados
            </Typography>
          </Box>
        ) : (
          items.map((item, idx) => (
            <Box
              key={item.nombre}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.75,
                px: 1.5,
                py: 1,
                bgcolor: 'background.alt',
                borderTop: idx > 0 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="body1" noWrap sx={{ color: 'text.primary' }}>
                  {item.nombre}
                </Typography>
                <IconButton size="small" onClick={() => onQuitar(item.nombre)} aria-label={`Quitar ${item.nombre}`} sx={{ color: 'text.dim' }}>
                  <IconX size={14} />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                  <IconButton
                    size="small"
                    onClick={() => onActualizarCantidad(item.nombre, item.cantidad - 1)}
                    aria-label={`Disminuir cantidad de ${item.nombre}`}
                    sx={{ height: 24, width: 24, borderRadius: 0, color: 'text.secondary' }}
                  >
                    <IconMinus size={12} />
                  </IconButton>
                  <Typography variant="body1" sx={{ width: 28, textAlign: 'center', color: 'text.primary' }}>
                    {item.cantidad}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onActualizarCantidad(item.nombre, item.cantidad + 1)}
                    aria-label={`Aumentar cantidad de ${item.nombre}`}
                    sx={{ height: 24, width: 24, borderRadius: 0, color: 'text.secondary' }}
                  >
                    <IconPlus size={12} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>
      <Button variant="primary" size="sm" fullWidth disabled={items.length === 0} onClick={onConfirmar}>
        Ordenar
      </Button>
    </Box>
  )
}
