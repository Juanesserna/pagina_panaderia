import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconFilter, IconPlus } from '@tabler/icons-react'
import { Button, SearchInput } from '@shared/ui'

// Encabezado de la tabla: título + buscador + "Nueva compra" + "Filtrar" (mismo patrón que Ventas).
export function ComprasToolbar({ busqueda, onBusquedaChange, onNueva, onToggleFiltros, cantidadFiltros }) {
  const hayFiltros = cantidadFiltros > 0
  return (
    <Stack direction="row" sx={{ flexWrap: 'wrap', alignItems: 'center', px: 2.5, py: 2 }}>
      <Typography variant="h6" sx={{ mr: 'auto' }}>
        Órdenes de compra
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.25 }}>
        <SearchInput placeholder="Buscar orden o proveedor…" value={busqueda} onChange={(e) => onBusquedaChange(e.target.value)} />
        <Button size="toolbar" leftIcon={<IconPlus size={13} />} onClick={onNueva}>
          Nueva compra
        </Button>
        <Button
          variant={hayFiltros ? 'primary' : 'secondary'}
          size="toolbar"
          leftIcon={<IconFilter size={13} />}
          onClick={onToggleFiltros}
        >
          Filtrar
          {hayFiltros && (
            <Box
              component="span"
              sx={{
                ml: 0.75,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 16,
                width: 16,
                borderRadius: '50%',
                typography: 'overline',
                bgcolor: (t) => alpha(t.palette.common.white, 0.3),
                color: 'inherit',
              }}
            >
              {cantidadFiltros}
            </Box>
          )}
        </Button>
      </Box>
    </Stack>
  )
}
