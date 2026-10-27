import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Filter, X } from 'lucide-react'
import AddIcon from '@mui/icons-material/Add'
import { Button, SearchInput, Select } from '@shared/ui'
import { ROLES, ESTADOS } from '../services/usuariosService'

export default function UsuariosToolbar({
  search,
  onSearchChange,
  onNuevoUsuario,
  filtersOpen,
  onToggleFilters,
  rolFiltro,
  onRolFiltroChange,
  estadoFiltro,
  onEstadoFiltroChange,
  hayFiltrosActivos,
  onLimpiarFiltros,
}) {
  const opcionesRol = [
    { value: 'Todos', label: 'Todos los roles' },
    ...ROLES.map((rol) => ({ value: rol, label: rol })),
  ]

  const opcionesEstado = [
    { value: 'Todos', label: 'Todos' },
    ...ESTADOS.map((estado) => ({ value: estado, label: estado })),
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
          Gestión de usuarios
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <SearchInput
            placeholder="Buscar nombre o email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <Button
            size="toolbar"
            leftIcon={<AddIcon />}
            onClick={onNuevoUsuario}
          >
            Crear usuario
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
          <Box sx={{ width: 180 }}>
            <Typography variant="overline" component="label">
              ROL
            </Typography>
            <Select
              fullWidth
              value={rolFiltro}
              onChange={(e) => onRolFiltroChange(e.target.value)}
              options={opcionesRol}
            />
          </Box>

          <Box sx={{ width: 150 }}>
            <Typography variant="overline" component="label">
              ESTADO
            </Typography>
            <Select
              fullWidth
              value={estadoFiltro}
              onChange={(e) => onEstadoFiltroChange(e.target.value)}
              options={opcionesEstado}
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
