import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Filter, X } from 'lucide-react'
import AddIcon from '@mui/icons-material/Add'
import { Button, SearchInput, Select } from '@shared/ui'
import { TIPOS_DOCUMENTO } from '../services/clientesService'

export default function ClientesToolbar({
  search,
  onSearchChange,
  onNuevoCliente,
  filtersOpen,
  onToggleFilters,
  tipoDocumentoFiltro,
  onTipoDocumentoFiltroChange,
  hayFiltrosActivos,
  onLimpiarFiltros,
}) {
  const opcionesTipoDocumento = [
    { value: 'Todos', label: 'Todos los documentos' },
    ...TIPOS_DOCUMENTO.map((tipo) => ({
      value: tipo,
      label: tipo,
    })),
  ]

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          p: 2.5,
        }}
      >
        <Typography variant="h5" color="text.primary">
          Gestión de clientes
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <SearchInput
            placeholder="Buscar nombre o documento..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <Button
            size="toolbar"
            leftIcon={<AddIcon />}
            onClick={onNuevoCliente}
          >
            Crear cliente
          </Button>

          <Button
            size="toolbar"
            variant="secondary"
            leftIcon={<Filter size={16} />}
            onClick={onToggleFilters}
          >
            Filtrar
          </Button>
        </Box>
      </Box>

      {filtersOpen && (
        <Box
          sx={{
            bgcolor: 'background.alt',
            px: 2.5,
            py: 2,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ width: 220 }}>
            <Typography variant="overline" component="label">
              TIPO DE DOCUMENTO
            </Typography>

            <Select
              fullWidth
              value={tipoDocumentoFiltro}
              onChange={(e) =>
                onTipoDocumentoFiltroChange(e.target.value)
              }
              options={opcionesTipoDocumento}
            />
          </Box>

          {hayFiltrosActivos && (
            <Link
              component="button"
              type="button"
              onClick={onLimpiarFiltros}
              underline="none"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
                mb: 1,
              }}
            >
              <X size={16} />
              Limpiar filtros
            </Link>
          )}
        </Box>
      )}
    </Box>
  )
}
