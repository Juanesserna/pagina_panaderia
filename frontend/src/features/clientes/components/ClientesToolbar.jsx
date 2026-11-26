import { Box, Typography, Link } from '@mui/material'
import { Filter, X, Plus } from 'lucide-react'
import { Button, SearchInput, Select } from '@shared/ui'
import { TIPOS_DOCUMENTO } from '../services/clientesService'

const OPCIONES_DOCUMENTO = [
  { value: 'Todos', label: 'Todos los documentos' },
  ...TIPOS_DOCUMENTO.map(tipo => ({
    value: tipo,
    label: tipo,
  })),
]

const OPCIONES_CUENTA = [
  { value: 'Todos', label: 'Todas las cuentas' },
  { value: 'Con cuenta', label: 'Con cuenta vinculada' },
  { value: 'Sin cuenta', label: 'Sin cuenta vinculada' },
]

// Estructura reutilizable para los filtros.
function CampoFiltro({ etiqueta, value, onChange, options }) {
  return (
    <Box sx={{ width: { xs: '100%', sm: 220 } }}>
      <Typography
        variant="overline"
        component="div"
        sx={{ mb: 0.5 }}
      >
        {etiqueta}
      </Typography>

      <Select
        fullWidth
        value={value}
        onChange={e => onChange(e.target.value)}
        options={options}
      />
    </Box>
  )
}

export default function ClientesToolbar({
  search,
  onSearchChange,
  onNuevoCliente,
  filtersOpen,
  onToggleFilters,
  tipoDocumentoFiltro,
  onTipoDocumentoFiltroChange,
  cuentaFiltro,
  onCuentaFiltroChange,
  hayFiltrosActivos,
  onLimpiarFiltros,
}) {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          flexWrap: 'wrap',
          px: 2.5,
          py: 2,
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
            placeholder="Buscar clientes..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />

          <Button
            size="toolbar"
            leftIcon={<Plus size={16} />}
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
            {filtersOpen ? 'Ocultar filtros' : 'Filtrar'}
          </Button>
        </Box>
      </Box>

      {filtersOpen && (
        <Box
          sx={{
            bgcolor: 'background.alt',
            borderTop: '1px solid',
            borderColor: 'divider',
            px: 2.5,
            py: 1.5,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <CampoFiltro
            etiqueta="Tipo de documento"
            value={tipoDocumentoFiltro}
            onChange={onTipoDocumentoFiltroChange}
            options={OPCIONES_DOCUMENTO}
          />

          <CampoFiltro
            etiqueta="Cuenta de acceso"
            value={cuentaFiltro}
            onChange={onCuentaFiltroChange}
            options={OPCIONES_CUENTA}
          />

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
                fontSize: 12,
                mb: 1,
                '&:hover': { color: 'primary.main' },
              }}
            >
              <X size={14} />
              Limpiar filtros
            </Link>
          )}
        </Box>
      )}
    </Box>
  )
}
