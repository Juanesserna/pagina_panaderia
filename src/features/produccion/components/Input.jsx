import { TextField, InputAdornment } from '@mui/material'

/**
 * Input de texto/número/fecha del panel administrativo.
 * leftIcon: ícono opcional que se muestra a la izquierda (ej: lupa de búsqueda).
 */
export function Input({ placeholder, value, onChange, leftIcon, type = 'text', min, fullWidth = true }) {
  return (
    <TextField
      size="small"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      inputProps={type === 'number' ? { min } : undefined}
      InputProps={{
        startAdornment: leftIcon ? (
          <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
            {leftIcon}
          </InputAdornment>
        ) : undefined,
        sx: {
          bgcolor: 'background.paper',
          borderRadius: 1.5,
          fontSize: 14,
          '& fieldset': { borderColor: 'divider' },
        },
      }}
    />
  )
}
