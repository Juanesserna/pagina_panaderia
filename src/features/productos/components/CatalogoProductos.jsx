import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Divider,
  MenuItem,
  useTheme,
} from '@mui/material'
import { IconCirclePlus, IconFilter, IconSearch } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

const categoriasFiltro = ['Pan Artesanal', 'Pastelería', 'Tortas', 'Bebidas']
const estadosFiltro = ['Activo', 'Agotado']

export default function Catalogoproductos({
  onBuscar,
  onNuevoClick,
  onFiltrarClick,
  onFiltroCategoriaChange,
  onFiltroEstadoChange,
  filtroCategoria = '',
  filtroEstado = '',
}) {
  const theme = useTheme()
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const handleFiltrarClick = () => {
    setMostrarFiltros((prev) => !prev)
    if (onFiltrarClick) onFiltrarClick()
  }

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
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: 20,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Catálogo de productos
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TextField
            placeholder=" Buscar producto o código..."
            size="small"
            onChange={onBuscar}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={16} color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 280,
              '& .MuiOutlinedInput-root': {
                overflow: 'hidden',
              },
            }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<IconCirclePlus size={16} />}
            onClick={onNuevoClick}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              px: 2,
              py: 1,
            }}
          >
            Nuevo producto
          </Button>

          <Button
            variant="outlined"
            startIcon={<IconFilter size={16} />}
            onClick={handleFiltrarClick}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              px: 2,
              py: 1,
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            Filtrar
          </Button>
        </Box>
      </Box>
      <Divider />

      {mostrarFiltros && (
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 220 }}>
            <Typography
              component="label"
              sx={{
                fontFamily: fonts.sans,
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: theme.palette.text.secondary,
              }}
            >
              Categoría
            </Typography>
            <TextField
              select
              size="small"
              value={filtroCategoria}
              onChange={(e) => onFiltroCategoriaChange?.(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.divider,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '& .MuiSelect-select': {
                  fontFamily: fonts.sans,
                  fontSize: 13,
                  color: filtroCategoria ? theme.palette.text.primary : theme.palette.text.secondary,
                },
              }}
              SelectProps={{
                displayEmpty: true,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      backgroundColor: theme.palette.background.paper,
                      '& .MuiMenuItem-root': {
                        fontFamily: fonts.sans,
                        fontSize: 14,
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                Todas las categorías
              </MenuItem>
              {categoriasFiltro.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 200 }}>
            <Typography
              component="label"
              sx={{
                fontFamily: fonts.sans,
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: theme.palette.text.secondary,
              }}
            >
              Estado
            </Typography>
            <TextField
              select
              size="small"
              value={filtroEstado}
              onChange={(e) => onFiltroEstadoChange?.(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.divider,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '& .MuiSelect-select': {
                  fontFamily: fonts.sans,
                  fontSize: 13,
                  color: filtroEstado ? theme.palette.text.primary : theme.palette.text.secondary,
                },
              }}
              SelectProps={{
                displayEmpty: true,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      backgroundColor: theme.palette.background.paper,
                      '& .MuiMenuItem-root': {
                        fontFamily: fonts.sans,
                        fontSize: 14,
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                Todos los estados
              </MenuItem>
              {estadosFiltro.map((e) => (
                <MenuItem key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      )}
    </Box>
  )
}