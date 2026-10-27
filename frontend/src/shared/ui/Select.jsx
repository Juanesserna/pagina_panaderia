import { Select as MuiSelect, MenuItem } from '@mui/material'

/**
 * Select del panel administrativo. Recibe options: [{ value, label }].
 * Se usa exactamente igual que un <select> normal: value + onChange(e).
 * sx: estilos opcionales para sobrescribir en una instancia puntual.
 */
export function Select({ options, value, onChange, fullWidth = true, sx }) {
  return (
    <MuiSelect
      size="small"
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      sx={{
        bgcolor: 'background.alt',
        borderRadius: 1.5,
        '& fieldset': { borderColor: 'divider' },
        ...sx,
      }}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </MuiSelect>
  )
}
