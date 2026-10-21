import { Box, Typography } from '@mui/material'
import { Select } from '@shared/ui'

export default function CampoFiltro({ etiqueta, opciones, value, onChange }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography component="label" variant="overline" color="text.secondary">
        {etiqueta}
      </Typography>
      <Select options={opciones} value={value} onChange={onChange} />
    </Box>
  )
}