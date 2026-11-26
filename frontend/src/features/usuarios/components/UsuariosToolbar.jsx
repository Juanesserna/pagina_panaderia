import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import { Filter, X } from 'lucide-react'
import AddIcon from '@mui/icons-material/Add'

import { Button, SearchInput, Select } from '@shared/ui'

import { ESTADOS } from '../services/usuariosService'
import { fetchRoles } from '../../roles/services/rolesService'

const opcionesEstado = [
  { value: 'Todos', label: 'Todos los estados' },
  ...ESTADOS.map((estado) => ({
    value: estado,
    label: estado,
  })),
]

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
  const [roles, setRoles] = useState([])
  const [cargandoRoles, setCargandoRoles] = useState(false)
  const [errorRoles, setErrorRoles] = useState('')

  // Consultar los roles actuales al abrir los filtros.
  useEffect(() => {
    if (!filtersOpen) return

    let activo = true

    setCargandoRoles(true)
    setErrorRoles('')

    fetchRoles()
      .then((data) => {
        if (activo) setRoles(data)
      })
      .catch(() => {
        if (activo) {
          setErrorRoles('No se pudieron cargar los roles.')
        }
      })
      .finally(() => {
        if (activo) setCargandoRoles(false)
      })

    return () => {
      activo = false
    }
  }, [filtersOpen])

  const opcionesRol = [
    { value: 'Todos', label: 'Todos los roles' },
    ...roles.map((rol) => ({
      value: rol.nombre,
      label:
        rol.estado === 'Inactivo'
          ? `${rol.nombre} (Inactivo)`
          : rol.nombre,
    })),
  ]

  // Conservar temporalmente el filtro seleccionado.
  if (
    rolFiltro !== 'Todos' &&
    !opcionesRol.some((opcion) => opcion.value === rolFiltro)
  ) {
    opcionesRol.push({
      value: rolFiltro,
      label: rolFiltro,
    })
  }

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
              placeholder="Buscar usuarios..."
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
              disabled={cargandoRoles || Boolean(errorRoles)}
            />

            {cargandoRoles && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Cargando roles...
              </Typography>
            )}

            {errorRoles && (
              <Typography variant="caption" color="error">
                {errorRoles}
              </Typography>
            )}
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
