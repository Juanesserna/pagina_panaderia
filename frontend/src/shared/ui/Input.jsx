import { TextField, InputAdornment } from '@mui/material'
import { CONTROL_HEIGHT } from './tokens'

/**
 * Input de texto, número o fecha del panel administrativo.
 *
 * Los colores provienen del tema.
 * leftIcon / rightIcon: iconos opcionales.
 * disabled: deshabilita el campo.
 * size: 'md' o 'sm'.
 * sx: estilos opcionales para una instancia puntual.
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
      slotProps={{
        htmlInput: type === 'number'
          ? { min }
          : undefined,

        input: {
          startAdornment: leftIcon ? (
            <InputAdornment
              position="start"
              sx={{ color: 'text.secondary' }}
            >
              {leftIcon}
            </InputAdornment>
          ) : undefined,

          endAdornment: rightIcon ? (
            <InputAdornment
              position="end"
              sx={{ color: 'text.secondary' }}
            >
              {rightIcon}
            </InputAdornment>
          ) : undefined,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: 'background.alt',
          borderRadius: isSm ? 1 : 1.5,

          ...(isSm
            ? {
                height: CONTROL_HEIGHT,
                fontSize: '0.75rem',
              }
            : {}),

          '& fieldset': {
            borderColor: 'divider',
          },

          '&:hover fieldset': {
            borderColor: 'primary.main',
          },

          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
          },
        },
        ...sx,
      }}
    />
  )
}
