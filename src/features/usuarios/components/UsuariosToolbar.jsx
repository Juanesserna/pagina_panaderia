import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Link from '@mui/material/Link'
import { Search } from 'lucide-react';
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { Filter } from 'lucide-react'
import { BRAND } from '@shared/utils/colors'
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
        <Typography sx={{ fontWeight: 700, fontSize: 18, color: 'text.primary' }}>
          Gestión de usuarios
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TextField
            size="small"
            placeholder="Buscar nombre o email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              width: 260,
              '& .MuiOutlinedInput-root': { bgcolor: 'action.hover', borderRadius: 2 },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                    <Search size={18} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onNuevoUsuario}
            sx={{ bgcolor: BRAND.orange, '&:hover': { bgcolor: BRAND.orangeDark } }}
          >
            Crear usuario
          </Button>
          <Button
            variant="outlined"
            startIcon={<Filter size={16} />}
            onClick={onToggleFilters}
            sx={{
              borderColor: 'divider',       //  Borde neutro
              color: 'text.secondary',      //  Gris neutro — igual que la referencia
              '&:hover': {
                borderColor: 'text.disabled',
                color: 'text.primary',     // Se aclara sutil al pasar el cursor
                bgcolor: 'action.hover',
              },
            }}
          >
            Filtrar
          </Button>
        </Box>
      </Box>
      {filtersOpen && (
        <Box
          sx={{
            bgcolor: 'action.hover',
            px: 2.5,
            py: 2,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              ROL
            </Typography>
            <TextField
              select
              size="small"
              value={rolFiltro}
              onChange={(e) => onRolFiltroChange(e.target.value)}
              sx={{ width: 180, bgcolor: 'background.paper', borderRadius: 2 }}
            >
              <MenuItem value="Todos">Todos los roles</MenuItem>
              {ROLES.map((rol) => (
                <MenuItem key={rol} value={rol}>
                  {rol}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              ESTADO
            </Typography>
            <TextField
              select
              size="small"
              value={estadoFiltro}
              onChange={(e) => onEstadoFiltroChange(e.target.value)}
              sx={{ width: 150, bgcolor: 'background.paper', borderRadius: 2 }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              {ESTADOS.map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </TextField>
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
                fontSize: 13,
                color: 'text.secondary',
                mb: 1,
              }}
            >
              <CloseIcon sx={{ fontSize: 16 }} /> Limpiar filtros
            </Link>
          )}
        </Box>
      )}
    </Box>
  )
}