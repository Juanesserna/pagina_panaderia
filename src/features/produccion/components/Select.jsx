import { Select as MuiSelect, MenuItem } from '@mui/material'

export function Select({ options, value, onChange, fullWidth = true, sx }) {
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
        ...sx, // 👈 se mergea al final
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