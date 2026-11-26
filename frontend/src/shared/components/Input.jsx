import { OutlinedInput, InputAdornment } from '@mui/material'

/**
 * Campo de texto compacto.
 * Acepta min, max y step directamente.
 *
 * @param {JSX.Element} [leftIcon] - Icono a la izquierda.
 */
export function Input({
  leftIcon,
  min,
  max,
  step,
  sx,
  slotProps,
  ...rest
}) {
  return (
    <OutlinedInput
      size="small"
      fullWidth
      startAdornment={
        leftIcon ? (
          <InputAdornment
            position="start"
            sx={{ color: 'text.secondary' }}
          >
            {leftIcon}
          </InputAdornment>
        ) : undefined
      }
      slotProps={{
        ...slotProps,
        input: {
          min,
          max,
          step,
          ...slotProps?.input,
        },
      }}
      sx={{
        fontSize: 13.5,
        '& .MuiOutlinedInput-input': {
          py: '10px',
        },
        '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
          borderColor: 'divider',
        },
        ...sx,
      }}
      {...rest}
    />
  )
}
