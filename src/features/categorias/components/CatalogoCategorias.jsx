import { Box, Divider, Typography } from '@mui/material'
import { IconPlus, IconFilter } from '@tabler/icons-react'
import { Button, SearchInput } from '@shared/ui'

export default function CatalogoCategorias({
  onBuscar,
  onNuevoClick,
  onFiltrarClick,
  valorBusqueda = '',
}) {
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography variant="h5" component="p">
          Categorías
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SearchInput
            placeholder="Buscar categoría..."
            value={valorBusqueda}
            onChange={onBuscar}
          />
          <Button size="toolbar" leftIcon={<IconPlus size={16} />} onClick={onNuevoClick}>
            Nueva categoría
          </Button>
          <Button
            variant="secondary"
            size="toolbar"
            leftIcon={<IconFilter size={16} />}
            onClick={onFiltrarClick}
          >
            Filtrar
          </Button>
        </Box>
      </Box>
      <Divider />
    </Box>
  )
}