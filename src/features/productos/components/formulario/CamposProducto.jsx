// Importa los componentes de MUI que usa el bloque de campos
import { Box, Stack, Switch, TextField, Typography, useTheme } from '@mui/material'
// Importa el ícono de la vista previa de la imagen
import { IconPhoto } from '@tabler/icons-react'
// Importa los campos y selectores estándar del panel
import { Input, Select } from '@shared/ui'
// Importa las categorías disponibles para los productos
import { CATEGORIAS_PRODUCTO } from '../comunes/opcionesProducto'
// Importa la etiqueta compartida por los formularios de producto
import FieldLabel from './FieldLabel'
// Importa los estilos compartidos de los formularios de producto
import { inputSx, imagePreviewSx } from './estilos'

// Bloque con los campos del formulario de producto
export default function CamposProducto({ formulario, handleChange, handleNumber, handleSwitch }) {
  // Obtiene el tema actual (claro u oscuro)
  const theme = useTheme()
  return (
    <Stack spacing={3}>
      <Box>
        <FieldLabel required>NOMBRE</FieldLabel>
        <Input
          placeholder="Nombre del producto"
          value={formulario.nombre}
          onChange={handleChange('nombre')}
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
          <Select
            value={formulario.categoria}
            onChange={handleChange('categoria')}
            options={CATEGORIAS_PRODUCTO.map((c) => ({ value: c, label: c }))}
          />
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
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={formulario.stockActual}
            onChange={handleNumber('stockActual')}
          />
        </Box>

        <Box>
          <FieldLabel required>STOCK MÍNIMO</FieldLabel>
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={formulario.stockMinimo}
            onChange={handleNumber('stockMinimo')}
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
          <Input
            type="number"
            min={0}
            placeholder="1"
            value={formulario.cantMinimaProduccion}
            onChange={handleNumber('cantMinimaProduccion')}
          />
        </Box>

        <Box>
          <FieldLabel required>CANT. MÁXIMA PRODUCCIÓN</FieldLabel>
          <Input
            type="number"
            min={0}
            placeholder="100"
            value={formulario.cantMaximaProduccion}
            onChange={handleNumber('cantMaximaProduccion')}
          />
        </Box>
      </Box>

      <Box>
        <FieldLabel required={false} helperText="Opcional">
          IMAGEN DEL PRODUCTO
        </FieldLabel>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Input
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formulario.imagen}
            onChange={handleChange('imagen')}
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
                  e.currentTarget.parentElement.querySelector('svg').style.display = 'block'
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
          variant="subtitle1"
          sx={{
            color: formulario.activo ? theme.palette.text.primary : theme.palette.text.secondary,
          }}
        >
          {formulario.activo ? 'Activo' : 'Inactivo'}
        </Typography>
      </Box>
    </Stack>
  )
}
