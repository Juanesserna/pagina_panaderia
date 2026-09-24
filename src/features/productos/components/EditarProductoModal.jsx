import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  IconButton,
  Card,
  CardContent,
  useTheme,
} from '@mui/material'
import { IconX, IconCheck, IconPhoto, IconPencil } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import RecetaTabla from './RecetaTabla'

const categoriasDefault = ['Panadería', 'Repostería', 'Snacks', 'Tortas', 'Bebidas', 'Congelados']

const valoresIniciales = {
  nombre: '',
  categoria: '',
  precioVenta: '',
  stockActual: '',
  stockMinimo: '',
  cantMinimaProduccion: '1',
  cantMaximaProduccion: '100',
  imagen: '',
  activo: true,
}

function FieldLabel({ children, required, helperText }) {
  const theme = useTheme()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
      <Typography
        component="label"
        sx={{
          fontFamily: fonts.sans,
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: required ? theme.palette.secondary.main : theme.palette.text.secondary,
        }}
      >
        {children}
        {required && (
          <Box component="span" sx={{ color: theme.palette.error.main, ml: 0.25 }}>
            *
          </Box>
        )}
      </Typography>
      {helperText && (
        <FormHelperText sx={{ color: theme.palette.text.secondary, fontSize: 11 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  )
}

const inputSx = (theme) => ({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
  '&:hover fieldset': {
    borderColor: theme.palette.divider,
  },
  '&.Mui-focused fieldset': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiInputBase-input': {
    fontFamily: fonts.sans,
    fontSize: 14,
  },
})

const selectMenuSx = (theme) => ({
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiMenuItem-root': {
    fontFamily: fonts.sans,
    fontSize: 14,
  },
})

const imagePreviewSx = (theme) => ({
  width: 72,
  height: 72,
  borderRadius: 2,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.action.hover,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  overflow: 'hidden',
})

export default function EditarProductoModal({
  open,
  onClose,
  onGuardar,
  producto,
}) {
  const theme = useTheme()
  const [formulario, setFormulario] = useState(valoresIniciales)
  const [insumos, setInsumos] = useState([
    { id: 1, idProducto: 'P-0001', idInsumo: 'I-001', insumo: 'Harina de trigo', cantidad: 500, unidad: 'kg' },
    { id: 2, idProducto: 'P-0001', idInsumo: 'I-002', insumo: 'Mantequilla', cantidad: 200, unidad: 'kg' },
    { id: 3, idProducto: 'P-0001', idInsumo: 'I-003', insumo: 'Sal', cantidad: 10, unidad: 'kg' },
    { id: 4, idProducto: 'P-0001', idInsumo: 'I-004', insumo: 'Levadura', cantidad: 5, unidad: 'kg' },
    { id: 5, idProducto: 'P-0001', idInsumo: 'I-005', insumo: 'Agua', cantidad: 300, unidad: 'L' },
  ])

  const handleAgregarInsumo = (nuevoInsumo) => {
    setInsumos((prev) => [...prev, nuevoInsumo])
  }

  const handleEditarInsumo = (id, datosActualizados) => {
    setInsumos((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...datosActualizados } : i))
    )
  }

  const handleEliminarInsumo = (id) => {
    setInsumos((prev) => prev.filter((i) => i.id !== id))
  }

  useEffect(() => {
    if (producto) {
      const initialData = {
        nombre: producto.nombre ?? '',
        categoria: producto.categoria ?? '',
        precioVenta: producto.precioVenta ?? '',
        stockActual: producto.stock ?? '',
        stockMinimo: producto.stock ?? 0,
        cantMinimaProduccion: '1',
        cantMaximaProduccion: '100',
        imagen: producto.imagenUrl ?? '',
        activo: producto.estado === 'Activo',
      }
      setFormulario(initialData)
    }
  }, [producto])

  const handleChange = (campo) => (e) => {
    const { value } = e.target
    setFormulario((prev) => ({ ...prev, [campo]: value }))
  }

  const handleNumber = (campo) => (e) => {
    const { value } = e.target
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setFormulario((prev) => ({ ...prev, [campo]: value }))
    }
  }

  const handleSwitch = (e) => {
    setFormulario((prev) => ({ ...prev, activo: e.target.checked }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const datos = {
      ...formulario,
      precioVenta: Number(formulario.precioVenta) || 0,
      stockActual: Number(formulario.stockActual) || 0,
      stockMinimo: Number(formulario.stockMinimo) || 0,
      cantMinimaProduccion: Number(formulario.cantMinimaProduccion) || 0,
      cantMaximaProduccion: Number(formulario.cantMaximaProduccion) || 0,
      id: producto?.id,
      codigo: producto?.codigo,
    }
    onGuardar(datos)
  }

  const handleClose = () => {
    setFormulario(valoresIniciales)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { maxHeight: '85vh', borderRadius: 3, overflow: 'hidden' } }}
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
          Editar Producto
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
        <DialogContent dividers sx={{ px: 3, py: 3, overflowY: 'auto' }}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 13,
              color: theme.palette.text.secondary,
              mb: 3,
            }}
          >
            Modifica los campos del producto
          </Typography>

          <Stack spacing={3}>
            <Box>
              <FieldLabel required>NOMBRE</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="Nombre del producto"
                value={formulario.nombre}
                onChange={handleChange('nombre')}
                variant="outlined"
                sx={inputSx(theme)}
              />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3,
              }}
            >
              <Box>
                <FieldLabel required>CATEGORÍA</FieldLabel>
                <FormControl fullWidth>
                  <Select
                    size="small"
                    displayEmpty
                    value={formulario.categoria}
                    onChange={handleChange('categoria')}
                    variant="outlined"
                    sx={inputSx(theme)}
                    MenuProps={{ PaperProps: { sx: selectMenuSx(theme) } }}
                  >
                    <MenuItem value="" disabled>
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontSize: 14,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        Seleccionar categoría
                      </Typography>
                    </MenuItem>
                    {categoriasDefault.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <FieldLabel required>PRECIO VENTA</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="0.00"
                  value={formulario.precioVenta}
                  onChange={handleNumber('precioVenta')}
                  variant="outlined"
                  inputProps={{ inputMode: 'decimal', min: 0, step: '0.01' }}
                  sx={inputSx(theme)}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3,
              }}
            >
              <Box>
                <FieldLabel required>STOCK ACTUAL</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="0"
                  value={formulario.stockActual}
                  onChange={handleNumber('stockActual')}
                  variant="outlined"
                  inputProps={{ inputMode: 'numeric', min: 0 }}
                  sx={inputSx(theme)}
                />
              </Box>

              <Box>
                <FieldLabel required>STOCK MÍNIMO</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="0"
                  value={formulario.stockMinimo}
                  onChange={handleNumber('stockMinimo')}
                  variant="outlined"
                  inputProps={{ inputMode: 'numeric', min: 0 }}
                  sx={inputSx(theme)}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3,
              }}
            >
              <Box>
                <FieldLabel required>CANT. MÍNIMA PRODUCCIÓN</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="1"
                  value={formulario.cantMinimaProduccion}
                  onChange={handleNumber('cantMinimaProduccion')}
                  variant="outlined"
                  inputProps={{ inputMode: 'numeric', min: 0 }}
                  sx={inputSx(theme)}
                />
              </Box>

              <Box>
                <FieldLabel required>CANT. MÁXIMA PRODUCCIÓN</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="100"
                  value={formulario.cantMaximaProduccion}
                  onChange={handleNumber('cantMaximaProduccion')}
                  variant="outlined"
                  inputProps={{ inputMode: 'numeric', min: 0 }}
                  sx={inputSx(theme)}
                />
              </Box>
            </Box>

            <Box>
              <FieldLabel required={false} helperText="Opcional">
                IMAGEN DEL PRODUCTO
              </FieldLabel>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formulario.imagen}
                  onChange={handleChange('imagen')}
                  variant="outlined"
                  sx={{ ...inputSx(theme), mt: 0.25 }}
                />
                <Box sx={imagePreviewSx(theme)}>
                  {formulario.imagen ? (
                    <Box
                      component="img"
                      src={formulario.imagen}
                      alt="preview"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement.querySelector('svg').style.display =
                          'block'
                      }}
                    />
                  ) : null}
                  <IconPhoto
                    size={24}
                    color={theme.palette.text.secondary}
                    style={{ display: formulario.imagen ? 'none' : 'block' }}
                  />
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <FieldLabel required={false}>ESTADO</FieldLabel>
              <Switch
                checked={formulario.activo}
                onChange={handleSwitch}
                color="primary"
                inputProps={{ 'aria-label': 'Estado activo' }}
              />
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: 13,
                  fontWeight: 500,
                  color: formulario.activo ? theme.palette.text.primary : theme.palette.text.secondary,
                }}
              >
                {formulario.activo ? 'Activo' : 'Inactivo'}
              </Typography>
            </Box>
          </Stack>

          {/* Receta del Producto */}
          <Box sx={{ mt: 4 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <RecetaTabla
                  insumos={insumos}
                  onAgregarInsumo={handleAgregarInsumo}
                  onEditInsumo={handleEditarInsumo}
                  onDeleteInsumo={handleEliminarInsumo}
                  codigoProducto={producto?.codigo}
                />
              </CardContent>
            </Card>
          </Box>
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
              px: 3,
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
            startIcon={<IconPencil size={16} />}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              px: 3,
              py: 1,
            }}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </form>
</Dialog>
  )
}