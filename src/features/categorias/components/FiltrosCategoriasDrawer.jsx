import { useState } from 'react'
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material'
import { IconFilter, IconX } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

const FILTROS_INICIALES = {
  tipo: 'Todos los tipos',
  estado: 'Todas',
}

const SELECT_SX = {
  backgroundColor: '#F0EBE3',
  borderRadius: '8px',
  overflow: 'hidden',
  '&.MuiOutlinedInput-root': {
    backgroundColor: '#F0EBE3',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  '& .MuiSelect-select': {
    backgroundColor: '#F0EBE3',
    borderRadius: '8px',
    overflow: 'hidden',
  },
}

const BUTTON_SX = {
  textTransform: 'none',
  fontSize: 13,
  fontWeight: 500,
  py: 1,
  borderRadius: '8px',
  justifyContent: 'flex-start',
  paddingLeft: 2,
}

export default function FiltrosCategoriasDrawer({
  open,
  onClose,
  filtros,
  onApply,
  onClear,
}) {
  const theme = useTheme()
  const [tipo, setTipo] = useState(
    filtros?.tipo ?? FILTROS_INICIALES.tipo
  )
  const [estado, setEstado] = useState(
    filtros?.estado ?? FILTROS_INICIALES.estado
  )

  const handleApply = () => {
    onApply({ tipo, estado })
  }

  const handleClear = () => {
    setTipo(FILTROS_INICIALES.tipo)
    setEstado(FILTROS_INICIALES.estado)
    onClear()
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 360,
          maxWidth: '100vw',
          height: '100%',
          borderLeft: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: 'background.paper',
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconFilter size={20} color={theme.palette.text.primary} />
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: 18,
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              Filtros
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': { bgcolor: theme.palette.action.hover },
            }}
            aria-label="Cerrar filtros"
          >
            <IconX size={20} />
          </IconButton>
        </Box>

        <Divider />

        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
              component="label"
              sx={{
                fontFamily: fonts.sans,
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: theme.palette.text.secondary,
              }}
            >
              TIPO
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={tipo}
                onChange={(evento) => setTipo(evento.target.value)}
                notched={false}
                variant="outlined"
                aria-label="Tipo"
                sx={SELECT_SX}
              >
                <MenuItem value={FILTROS_INICIALES.tipo}>
                  Todos los tipos
                </MenuItem>
                <MenuItem value="Producto">Producto</MenuItem>
                <MenuItem value="Insumo">Insumo</MenuItem>
                <MenuItem value="Ambos">Ambos</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
              component="label"
              sx={{
                fontFamily: fonts.sans,
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: theme.palette.text.secondary,
              }}
            >
              ESTADO
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={estado}
                onChange={(evento) => setEstado(evento.target.value)}
                notched={false}
                variant="outlined"
                aria-label="Estado"
                sx={SELECT_SX}
              >
                <MenuItem value={FILTROS_INICIALES.estado}>Todas</MenuItem>
                <MenuItem value="Activa">Activa</MenuItem>
                <MenuItem value="Inactiva">Inactiva</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        <Box
          sx={{
            px: 3,
            pt: 2,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Button
            type="button"
            fullWidth
            variant="contained"
            onClick={handleApply}
            sx={{
              ...BUTTON_SX,
              backgroundColor: '#C97A45',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#C97A45',
                color: '#FFFFFF',
              },
              '&.Mui-focusVisible': {
                color: '#FFFFFF',
              },
            }}
          >
            Aplicar filtros
          </Button>

          <Button
            type="button"
            fullWidth
            variant="contained"
            onClick={handleClear}
            sx={{
              ...BUTTON_SX,
              backgroundColor: '#F0EBE3',
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.text.primary,
              },
            }}
          >
            Limpiar filtros
          </Button>

          <Button
            type="button"
            fullWidth
            variant="text"
            onClick={onClose}
            sx={{
              ...BUTTON_SX,
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.text.primary,
              },
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
