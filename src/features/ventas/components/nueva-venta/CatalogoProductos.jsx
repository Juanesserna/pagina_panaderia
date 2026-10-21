import { Box, Typography } from '@mui/material'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { Button, ImageWithFallback, Input } from '@shared/ui'
import { productoSinStock } from '../../utils/ventasHelpers'
import FilterLabel from '../FilterLabel'

// Catálogo (grilla de productos) + buscador debajo.
export default function CatalogoProductos({ productos, busqueda, onBusquedaChange, onAgregar, onAgregarPrimero }) {
  const puedeAgregarPrimero = Boolean(busqueda.trim()) && productos.length > 0

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, minWidth: 0 }}>
      <FilterLabel>Catálogo de productos</FilterLabel>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 1.25,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          p: 1.25,
          minHeight: 180,
          maxHeight: 380,
          overflowY: 'auto',
        }}
      >
        {productos.map((p) => {
          const sinStock = productoSinStock(p)
          return (
            <Box
              key={p.nombre}
              component="button"
              type="button"
              onClick={() => onAgregar(p)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 0.75,
                p: 1.25,
                font: 'inherit',
                color: 'text.primary',
                textAlign: 'left',
                cursor: sinStock ? 'not-allowed' : 'pointer',
                opacity: sinStock ? 0.5 : 1,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.alt',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              {p.imagen ? (
                <ImageWithFallback src={p.imagen} alt={p.nombre} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
              ) : (
                <Box sx={{ width: 44, height: 44, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {p.nombre.charAt(0)}
                  </Typography>
                </Box>
              )}
              <Typography variant="body1">{p.nombre}</Typography>
              <Typography variant="subtitle2">${p.precio.toFixed(2)}</Typography>
            </Box>
          )
        })}
        {productos.length === 0 && (
          <Box sx={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Sin productos que coincidan
            </Typography>
          </Box>
        )}
      </Box>

      {/* Buscar producto (debajo del catálogo) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{ flex: 1, minWidth: 0 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (puedeAgregarPrimero) onAgregarPrimero()
            }
          }}
        >
          <Input
            size="sm"
            placeholder="Buscar producto…"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            leftIcon={<IconSearch size={18} />}
          />
        </Box>
        <Button
          variant="secondary"
          size="toolbar"
          leftIcon={<IconPlus size={12} />}
          disabled={!puedeAgregarPrimero}
          onClick={onAgregarPrimero}
        >
          Agregar
        </Button>
      </Box>
    </Box>
  )
}
