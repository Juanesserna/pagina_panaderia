import { FormControl, MenuItem, Select, Typography, useTheme } from '@mui/material'

// Selector de una celda de la receta (insumo o unidad de medida).
// "opciones" es una lista de { value, etiqueta, disabled }. Con "cargando" muestra "Cargando...".
export default function SelectorReceta({
  valor,
  onChange,
  opciones,
  placeholder,
  minWidth,
  disabled = false,
  cargando = false,
}) {
  const theme = useTheme()
  const textoSx = { color: theme.palette.text.secondary }

  return (
    <FormControl fullWidth size="small" variant="outlined" sx={{ minWidth }}>
      <Select
        value={valor}
        onChange={onChange}
        displayEmpty
        disabled={disabled}
        inputProps={{ 'aria-label': placeholder }}
      >
        {/* Opción vacía que sirve de texto guía */}
        <MenuItem value="" disabled>
          <Typography variant="body1" sx={textoSx}>
            {placeholder}
          </Typography>
        </MenuItem>
        {cargando ? (
          <MenuItem disabled>
            <Typography variant="body1" sx={textoSx}>
              Cargando...
            </Typography>
          </MenuItem>
        ) : (
          opciones.map((opcion) => (
            <MenuItem key={opcion.value} value={opcion.value} disabled={opcion.disabled}>
              {opcion.etiqueta}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  )
}
