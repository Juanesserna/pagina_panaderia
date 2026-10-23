import { Box, Collapse, Stack } from '@mui/material'
import { Button, Input, Select } from '@shared/ui'
import { estadoOptions, metodoOptions } from '../constants/ventas.constants'
import FilterLabel from './FilterLabel'

const TODOS = { value: '', label: 'Todos' }

// Campos de rango (cantidad, total, fecha). `key` es la llave dentro de `filtros`.
const CAMPOS_RANGO = [
  { key: 'cantidadMin', label: 'Cantidad mín.', width: 90, type: 'number', placeholder: '0' },
  { key: 'cantidadMax', label: 'Cantidad máx.', width: 100, type: 'number', placeholder: 'Sin límite' },
  { key: 'totalMin', label: 'Total mín.', width: 90, type: 'number', placeholder: '$0' },
  { key: 'totalMax', label: 'Total máx.', width: 100, type: 'number', placeholder: 'Sin límite' },
  { key: 'fechaDesde', label: 'Desde', width: 140, type: 'date' },
  { key: 'fechaHasta', label: 'Hasta', width: 140, type: 'date' },
]

export default function VentasFiltros({ abierto, filtros, onChange, onLimpiar, hayFiltrosActivos }) {
  return (
    <Collapse in={abierto}>
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="flex-end"
        sx={{ gap: 2.5, px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}
      >
        <Box sx={{ width: 130 }}>
          <FilterLabel>Estado</FilterLabel>
          <Select options={[TODOS, ...estadoOptions]} value={filtros.estado} onChange={(e) => onChange('estado', e.target.value)} />
        </Box>
        <Box sx={{ width: 130 }}>
          <FilterLabel>Método</FilterLabel>
          <Select options={[TODOS, ...metodoOptions]} value={filtros.metodo} onChange={(e) => onChange('metodo', e.target.value)} />
        </Box>

        {CAMPOS_RANGO.map((c) => (
          <Box key={c.key} sx={{ width: c.width }}>
            <FilterLabel>{c.label}</FilterLabel>
            <Input type={c.type} placeholder={c.placeholder} value={filtros[c.key]} onChange={(e) => onChange(c.key, e.target.value)} />
          </Box>
        ))}

        {hayFiltrosActivos && (
          <Button variant="ghost" size="sm" onClick={onLimpiar}>
            Limpiar filtros
          </Button>
        )}
      </Stack>
    </Collapse>
  )
}
