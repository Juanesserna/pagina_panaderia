import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  IconButton,
  Typography,
  Box,
  Stack,
  useTheme,
} from '@mui/material'
import { IconX } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

export default function EditarCategoriaModal({
  open,
  onClose,
  onSubmit,
  categoria,
}) {
  const theme = useTheme()
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('Producto')
  const [estado, setEstado] = useState('Activa')

  useEffect(() => {
    if (open && categoria) {
      setNombre(categoria.nombre)
      setTipo(categoria.tipo)
      setEstado(categoria.estado)
    }
  }, [open, categoria])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (nombre.trim()) {
      onSubmit(categoria.id, { nombre: nombre.trim(), tipo, estado })
      setNombre('')
      setTipo('Producto')
      setEstado('Activa')
      onClose()
    }
  }

  const handleClose = () => {
    setNombre('')
    setTipo('Producto')
    setEstado('Activa')
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          padding: 0,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: fonts.sans,
            fontSize: 18,
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          Editar categoría
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': { bgcolor: theme.palette.action.hover },
          }}
          aria-label="Cerrar"
        >
          <IconX size={20} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Stack spacing={3}>
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
                NOMBRE
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="ej. Repostería"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    overflow: 'hidden',
                  },
                }}
              />
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
                TIPO DE CATEGORÍA
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={tipo}
                  label="TIPO DE CATEGORÍA"
                  onChange={(e) => setTipo(e.target.value)}
                  variant="outlined"
                >
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
                  label="ESTADO"
                  onChange={(e) => setEstado(e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="Activa">Activa</MenuItem>
                  <MenuItem value="Inactiva">Inactiva</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
            justifyContent: 'flex-end',
            gap: 1.5,
          }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              px: 2.5,
              py: 1,
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              '&:hover': {
                borderColor: theme.palette.text.secondary,
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!nombre.trim()}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              px: 2.5,
              py: 1,
            }}
          >
            Guardar cambios
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}