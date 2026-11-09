
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
    ...ROLES.map((rol) => ({
      value: rol,
      label: rol,
    })),
  ]

  const opcionesEstado = [
    { value: 'Todos', label: 'Todos los estados' },
    ...ESTADOS.map((estado) => ({
      value: estado,
      label: estado,
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
          Gestión de usuarios
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            flex: '0 1 auto',
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 280,
              maxWidth: '100%',
              flex: '1 1 220px',
            }}
          >
            <SearchInput
              placeholder="Buscar por nombre o correo..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </Box>

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
            {filtersOpen ? 'Ocultar filtros' : 'Filtrar'}
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
          <Box sx={{ width: 180, maxWidth: '100%' }}>
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

          <Box sx={{ width: 180, maxWidth: '100%' }}>
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
                cursor: 'pointer',
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
