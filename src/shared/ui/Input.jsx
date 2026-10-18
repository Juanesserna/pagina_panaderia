import { TextField, InputAdornment } from '@mui/material'
import { useTheme } from '@mui/material/styles'

/**
 * Input de texto/número/fecha del panel administrativo.
 *
 * leftIcon / rightIcon: ícono opcional a la izquierda / derecha (ej: lupa de búsqueda).
 * disabled: deshabilita el campo.
 * size: 'md' (por defecto, 14px) | 'sm' (alto 35px, 12px; el tamaño del buscador de las tablas).
 * tone: 'default' (fondo del tema) | 'beige' (fondo beige, como el buscador de Ventas/Producción).
 * sx: estilos opcionales para sobrescribir en una instancia puntual.
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
  tone = 'default',
  sx,
}) {
  const isDark = useTheme().palette.mode === 'dark'
  const isSm = size === 'sm'

  const beigeSx = {
    bgcolor: isDark ? '#32251F' : '#F4EFEA',
    '& fieldset': { borderColor: isDark ? 'transparent' : '#E5DCD3' },
    '&:hover fieldset': { borderColor: '#C97A45' },
    '&.Mui-focused fieldset': { borderColor: '#C97A45' },
  }

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
          bgcolor: 'background.paper',
          borderRadius: isSm ? 1 : 1.5,
          fontSize: isSm ? 12 : 14,
          ...(isSm ? { height: 35 } : {}),
          '& fieldset': { borderColor: 'divider' },
          ...(tone === 'beige' ? beigeSx : {}),
        },
        ...sx,
      }}
    />
  )
}