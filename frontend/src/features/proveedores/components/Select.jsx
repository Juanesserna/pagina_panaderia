import { Select as MuiSelect, MenuItem } from '@mui/material'

/**
 * Select del panel administrativo. Recibe options: [{ value, label }].
 * Se usa exactamente igual que un <select> normal: value + onChange(e).
 */
export function Select({ options, value, onChange, fullWidth = true }) {
  return (
    <MuiSelect
      size="small"
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1.5,
        fontSize: 14,
        '& fieldset': { borderColor: 'divider' },
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
