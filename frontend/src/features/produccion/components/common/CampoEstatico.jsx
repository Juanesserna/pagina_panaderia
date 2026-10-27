import { Box } from '@mui/material'
import { Input } from '@shared/ui'
import FilterLabel from '@features/produccion/components/common/FilterLabel'

// Campo de solo lectura (inhabilitado) con la misma apariencia que el resto de campos del modal.
export default function CampoEstatico({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <FilterLabel>{label}</FilterLabel>
      <Input value={value} onChange={() => {}} disabled />
    </Box>
  )
}
