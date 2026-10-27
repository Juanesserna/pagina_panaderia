import { Box, Typography } from '@mui/material'
import { IconSearch } from '@tabler/icons-react'
import { Input } from '@shared/ui'
import FilterLabel from '@features/produccion/components/common/FilterLabel'

export default function CatalogoProductos({ productos, busqueda, onBusquedaChange, onAgregar, onAgregarPrimero }) {
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
        {productos.map((nombre) => (
          <Box
            key={nombre}
            component="button"
            type="button"
            onClick={() => onAgregar(nombre)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 0.75,
              p: 1.25,
              font: 'inherit',
              color: 'text.primary',
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.alt',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            <Box sx={{ width: 44, height: 44, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                {nombre.charAt(0)}
              </Typography>
            </Box>
            <Typography variant="body2">{nombre}</Typography>
          </Box>
        ))}
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
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Input
            placeholder="Buscar producto…"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (busqueda.trim() && productos.length > 0) onAgregarPrimero()
              }
            }}
            leftIcon={<IconSearch size={13} />}
          />
        </Box>
      </Box>
    </Box>
  )
}
