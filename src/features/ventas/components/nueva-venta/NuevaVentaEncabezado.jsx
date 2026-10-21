import { Autocomplete, Box, Checkbox, FormControlLabel, InputAdornment, TextField, Typography } from '@mui/material'
import { IconSearch } from '@tabler/icons-react'
import { Input, Select } from '@shared/ui'
import { metodoOptions } from '../../constants/ventas.constants'
import FilterLabel from '../FilterLabel'

// Estilo de los campos de MUI que no son de @shared/ui (Autocomplete): mismos tokens que <Input>.
const autocompleteSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'background.alt',
    '& fieldset': { borderColor: 'divider' },
    '&:hover fieldset': { borderColor: 'primary.main' },
    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
  },
}

// Parte superior: ID, fecha, NIT/Cédula, método de pago y pago dividido
export default function NuevaVentaEncabezado({
  id,
  fecha,
  hora,
  clientes,
  cliente,
  onClienteChange,
  onClienteInputChange,
  metodo,
  onMetodoChange,
  pagoDividido,
  onPagoDivididoChange,
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '0.8fr 1.3fr 1.5fr 1fr 1.8fr' },
        gap: 2,
        alignItems: 'end',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <FilterLabel>ID de venta</FilterLabel>
        <Input value={id} onChange={() => {}} disabled />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <FilterLabel>Fecha</FilterLabel>
        <Input value={`${fecha} · ${hora}`} onChange={() => {}} disabled />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <FilterLabel>NIT/Cédula</FilterLabel>
        <Autocomplete
          size="small"
          options={clientes}
          getOptionLabel={(c) => `${c.nit} — ${c.nombre}`}
          value={cliente}
          onChange={(_, value) => onClienteChange(value)}
          onInputChange={(_, value) => onClienteInputChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Buscar por NIT o nombre…"
              sx={autocompleteSx}
              InputProps={{
                ...(params.InputProps || {}),
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 1, color: 'text.secondary' }}>
                    <IconSearch size={18} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <FilterLabel>Método de pago</FilterLabel>
        <Select options={metodoOptions} value={metodo} onChange={(e) => onMetodoChange(e.target.value)} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <FormControlLabel
          control={<Checkbox size="small" checked={pagoDividido} onChange={(e) => onPagoDivididoChange(e.target.checked)} />}
          label={<Typography variant="body2" sx={{ color: 'text.primary' }}>Pago dividido (dos pagos del 50%)</Typography>}
          sx={{ m: 0 }}
        />
      </Box>
    </Box>
  )
}
