import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Divider,
  useTheme,
} from '@mui/material'
import { IconCirclePlus, IconFilter, IconSearch } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

export default function CatalogoProductos({ onBuscar, onNuevoClick, onFiltrarClick }) {
  const theme = useTheme()

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
            placeholder="Buscar producto o código..."
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
            onClick={onFiltrarClick}
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
    </Box>
  )
}