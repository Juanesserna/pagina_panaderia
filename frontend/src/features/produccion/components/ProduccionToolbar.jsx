import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconPlus, IconFilter } from '@tabler/icons-react'
import { Button, SearchInput } from '@shared/ui'

export default function ProduccionToolbar({
  search,
  onSearchChange,
  onNuevaOrden,
  filtrosActivos,
  cantidadFiltrosActivos,
  onToggleFiltros,
}) {
  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center" sx={{ px: 2.5, py: 2 }}>
      <Typography variant="h6" sx={{ mr: 'auto' }}>
        Órdenes de producción
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.25 }}>
        <SearchInput placeholder="Buscar orden, NIT o producto…" value={search} onChange={(e) => onSearchChange(e.target.value)} />

        <Button size="toolbar" leftIcon={<IconPlus size={13} />} onClick={onNuevaOrden}>
          Nueva orden
        </Button>

        <Button
          variant={filtrosActivos ? 'primary' : 'secondary'}
          size="toolbar"
          leftIcon={<IconFilter size={13} />}
          onClick={onToggleFiltros}
        >
          Filtrar
          {filtrosActivos && (
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
              {cantidadFiltrosActivos}
            </Box>
          )}
        </Button>
      </Box>
    </Stack>
  )
}
