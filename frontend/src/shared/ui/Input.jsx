import { TextField, InputAdornment } from '@mui/material'
import { CONTROL_HEIGHT } from './tokens'

/**
 * Input de texto/número/fecha del panel administrativo.
 * Los colores salen del tema (fondo: background.alt, borde: divider, foco: primary.main).
 * No pases colores por `sx`: si falta uno, se agrega al tema (app/theme/colors.js).
 *
 * leftIcon / rightIcon: ícono opcional a la izquierda / derecha (ej: lupa de búsqueda).
 * disabled: deshabilita el campo.
 * size: 'md' (por defecto, texto principal) | 'sm' (alto estándar de barra de herramientas, texto secundario; ver tokens.js).
 * sx: estilos opcionales (tamaños/espaciados) para una instancia puntual.
 */
export function Input({
  placeholder,
  value,
  onChange,
  leftIcon,
  rightIcon,
  type = 'text',
  min,
  fullWidth = true,
  disabled,
  size = 'md',
  sx,
}) {
  const isSm = size === 'sm'

  return (
    <TextField
      size="small"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      disabled={disabled}
      inputProps={type === 'number' ? { min } : undefined}
      InputProps={{
        startAdornment: leftIcon ? (
          <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
            {leftIcon}
          </InputAdornment>
        ) : undefined,
        endAdornment: rightIcon ? (
          <InputAdornment position="end" sx={{ color: 'text.secondary' }}>
            {rightIcon}
          </InputAdornment>
        ) : undefined,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: 'background.alt',
          borderRadius: isSm ? 1 : 1.5,
          ...(isSm ? { height: CONTROL_HEIGHT, fontSize: '0.75rem' } : {}),
          '& fieldset': { borderColor: 'divider' },
          '&:hover fieldset': { borderColor: 'primary.main' },
          '&.Mui-focused fieldset': { borderColor: 'primary.main' },
        },
        ...sx,
      }}
    />
  )
}
