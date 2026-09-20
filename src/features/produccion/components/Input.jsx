import { TextField, InputAdornment } from '@mui/material'

export function Input({ placeholder, value, onChange, leftIcon, type = 'text', min, fullWidth = true, sx }) {
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
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: 'background.paper',
          borderRadius: 1.5,
          fontSize: 14,
          '& fieldset': { borderColor: 'divider' },
        },
        ...sx, // 👈 ahora se mergea a nivel de TextField root, pisando el selector anidado también
      }}
    />
  )
}