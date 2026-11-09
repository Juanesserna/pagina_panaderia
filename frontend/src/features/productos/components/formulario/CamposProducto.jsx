// Importa los componentes de MUI que usa el bloque de campos
import { Box, Stack, Switch, TextField, Typography, useTheme } from '@mui/material'
// Importa el ícono de la vista previa de la imagen
import { IconPhoto } from '@tabler/icons-react'
// Importa los campos y selectores estándar del panel
import { Input, Select } from '@shared/ui'
// Importa las categorías del módulo Categorías (estado compartido vía CategoriasProvider)
import { useCategorias } from '@features/categorias'
// Importa la etiqueta compartida por los formularios de producto
import FieldLabel from './FieldLabel'
// Importa los estilos compartidos de los formularios de producto
import { inputSx, imagePreviewSx } from './estilos'

// Bloque con los campos del formulario de producto
export default function CamposProducto({ formulario, handleChange, handleNumber, handleSwitch, errores, touched, tocar }) {
  // Obtiene el tema actual (claro u oscuro)
  const theme = useTheme()
  // Lee todas las categorías del contexto compartido
  const { allCategorias } = useCategorias()

  // Filtra solo categorías activas de tipo Producto o Ambos
  const categoriasFiltradas = allCategorias.filter(
    (c) => c.estado === 'Activa' && (c.tipo === 'Producto' || c.tipo === 'Ambos')
  )

  const opcionesCategoria = categoriasFiltradas.map((c) => ({ value: c.nombre, label: c.nombre }))

  // Si el producto en edición tiene una categoría que no está entre las opciones,
  // la agrega para que el selector no quede en blanco
  if (formulario.categoria && !opcionesCategoria.some((o) => o.value === formulario.categoria)) {
    opcionesCategoria.push({ value: formulario.categoria, label: formulario.categoria })
  }

  // Muestra el error de un campo solo si fue tocado y hay error de validación
  const errorDe = (campo) => touched[campo] && errores[campo] ? errores[campo] : null

  return (
    <Stack spacing={3}>
      <Box>
        <FieldLabel required>NOMBRE</FieldLabel>
        <Input
          placeholder="Nombre del producto"
          value={formulario.nombre}
          onChange={handleChange('nombre')}
          onBlur={() => tocar('nombre')}
        />
        {errorDe('nombre') && (
          <Typography variant="caption" sx={{ color: theme.palette.error.main, mt: 0.5 }}>
            {errores.nombre}
          </Typography>
        )}
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
            onBlur={() => tocar('categoria')}
            options={opcionesCategoria}
          />
          {errorDe('categoria') && (
            <Typography variant="caption" sx={{ color: theme.palette.error.main, mt: 0.5 }}>
              {errores.categoria}
            </Typography>
          )}
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
            onBlur={() => tocar('precioVenta')}
            variant="outlined"
            inputProps={{ inputMode: 'decimal', min: 0, step: '0.01' }}
            sx={inputSx(theme)}
          />
          {errorDe('precioVenta') && (
            <Typography variant="caption" sx={{ color: theme.palette.error.main, mt: 0.5 }}>
              {errores.precioVenta}
            </Typography>
          )}
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
            onBlur={() => tocar('stockActual')}
          />
          {errorDe('stockActual') && (
            <Typography variant="caption" sx={{ color: theme.palette.error.main, mt: 0.5 }}>
              {errores.stockActual}
            </Typography>
          )}
        </Box>

        <Box>
          <FieldLabel required>STOCK MÍNIMO</FieldLabel>
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={formulario.stockMinimo}
            onChange={handleNumber('stockMinimo')}
            onBlur={() => tocar('stockMinimo')}
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
            onBlur={() => tocar('cantMinimaProduccion')}
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
            onBlur={() => tocar('cantMaximaProduccion')}
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
            onBlur={() => tocar('imagen')}
          />
          {errorDe('imagen') && (
            <Typography variant="caption" sx={{ color: theme.palette.error.main, mt: 0.5 }}>
              {errores.imagen}
            </Typography>
          )}
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
