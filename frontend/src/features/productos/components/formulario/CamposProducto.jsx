// Importa los componentes de MUI que usa el bloque de campos
import { Box, MenuItem, Stack, Switch, TextField, Typography, useTheme } from '@mui/material'
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

// Bloque con los campos del formulario de producto.
// modo: 'crear' | 'editar'. Al editar, el tipo y el stock son de solo lectura.
export default function CamposProducto({
  formulario, handleChange, handleNumber, handleSwitch, errores, touched, tocar, modo = 'crear',
}) {
  const theme = useTheme()
  const { allCategorias } = useCategorias()

  const editando = modo === 'editar'
  // Si el formulario aún no trae tipo, se asume Terminado
  const tipo = formulario.tipo ?? 'TERMINADO'
  const esIntermedio = tipo === 'INTERMEDIO'
  // Un Terminado siempre es vendible; en un Intermedio depende del toggle
  const esVendible = esIntermedio ? Boolean(formulario.esVendible) : true

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
  const errorDe = (campo) => (touched[campo] && errores[campo] ? errores[campo] : null)
  const mensajeError = (campo) =>
    errorDe(campo) ? (
      <Typography variant="caption" sx={{ color: theme.palette.error.main, mt: 0.5, display: 'block' }}>
        {errores[campo]}
      </Typography>
    ) : null

  // Al cambiar el tipo: Terminado => vendible; Intermedio => no vendible por defecto
  const handleTipo = (e) => {
    const nuevoTipo = e.target.value
    handleChange('tipo')(e)
    handleChange('esVendible')({ target: { value: nuevoTipo === 'TERMINADO' } })
  }

  const handleVendible = (_e, checked) => {
    handleChange('esVendible')({ target: { value: checked } })
  }

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
        {mensajeError('nombre')}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <Box>
          <FieldLabel required>CATEGORÍA</FieldLabel>
          <Select
            value={formulario.categoria}
            onChange={handleChange('categoria')}
            onBlur={() => tocar('categoria')}
            options={opcionesCategoria}
          />
          {mensajeError('categoria')}
        </Box>

        <Box>
          <FieldLabel required>TIPO</FieldLabel>
          <TextField
            select
            fullWidth
            size="small"
            variant="outlined"
            value={tipo}
            onChange={handleTipo}
            onBlur={() => tocar('tipo')}
            disabled={editando}
            sx={inputSx(theme)}
          >
            <MenuItem value="TERMINADO">Terminado</MenuItem>
            <MenuItem value="INTERMEDIO">Intermedio</MenuItem>
          </TextField>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 0.5, display: 'block' }}>
            {editando
              ? 'El tipo no se puede modificar una vez creado el producto.'
              : 'Un Intermedio (masa, mezcla) se usa dentro de la receta de otros productos.'}
          </Typography>
          {mensajeError('tipo')}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <Box>
          <FieldLabel required={false}>VENDIBLE</FieldLabel>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch
              checked={esVendible}
              onChange={handleVendible}
              disabled={!esIntermedio}
              color="primary"
              inputProps={{ 'aria-label': 'Producto vendible' }}
            />
            <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary }}>
              {esVendible ? 'Sí' : 'No'}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
            {esIntermedio
              ? 'Si no es vendible, solo se usa como componente de recetas.'
              : 'Un producto Terminado siempre es vendible.'}
          </Typography>
        </Box>

        {esVendible && (
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
            {mensajeError('precioVenta')}
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <Box>
          <FieldLabel required>{editando ? 'STOCK ACTUAL' : 'STOCK INICIAL'}</FieldLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            placeholder="0"
            value={formulario.stockActual}
            onChange={handleNumber('stockActual')}
            onBlur={() => tocar('stockActual')}
            disabled={editando}
            variant="outlined"
            inputProps={{ inputMode: 'numeric', min: 0, step: '1' }}
            sx={inputSx(theme)}
          />
          {editando && (
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 0.5, display: 'block' }}>
              El stock lo modifican la producción y las ventas, no se edita aquí.
            </Typography>
          )}
          {mensajeError('stockActual')}
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
          {mensajeError('stockMinimo')}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <Box>
          <FieldLabel required>CANT. MÍNIMA PRODUCCIÓN</FieldLabel>
          <Input
            type="number"
            min={1}
            placeholder="1"
            value={formulario.cantMinimaProduccion}
            onChange={handleNumber('cantMinimaProduccion')}
            onBlur={() => tocar('cantMinimaProduccion')}
          />
          {mensajeError('cantMinimaProduccion')}
        </Box>

        <Box>
          <FieldLabel required>CANT. MÁXIMA PRODUCCIÓN</FieldLabel>
          <Input
            type="number"
            min={1}
            placeholder="100"
            value={formulario.cantMaximaProduccion}
            onChange={handleNumber('cantMaximaProduccion')}
            onBlur={() => tocar('cantMaximaProduccion')}
          />
          {mensajeError('cantMaximaProduccion')}
        </Box>
      </Box>

      <Box>
        <FieldLabel required={esVendible} helperText={esVendible ? undefined : 'Opcional'}>
          IMAGEN DEL PRODUCTO
        </FieldLabel>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Input
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formulario.imagen}
            onChange={handleChange('imagen')}
            onBlur={() => tocar('imagen')}
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
        {mensajeError('imagen')}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FieldLabel required={false}>ESTADO</FieldLabel>
        <Switch
          checked={formulario.activo}
          onChange={handleSwitch}
          color="primary"
          inputProps={{ 'aria-label': 'Estado activo' }}
        />
        <Typography
          variant="subtitle1"
          sx={{ color: formulario.activo ? theme.palette.text.primary : theme.palette.text.secondary }}
        >
          {formulario.activo ? 'Activo' : 'Inactivo'}
        </Typography>
      </Box>
    </Stack>
  )
}
