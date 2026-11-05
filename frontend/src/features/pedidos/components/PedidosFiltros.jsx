import { Box, Collapse, Stack } from '@mui/material'
import { Button, Input, Select } from '@shared/ui'
import { estadoOptions, metodoOptions, canalOptions } from '../constants/pedidos.constants'
import FilterLabel from './FilterLabel'

const TODOS = { value: '', label: 'Todos' }

const CAMPOS_RANGO = [
  { key: 'totalMin', label: 'Total mín.', width: 90, type: 'number', placeholder: '$0' },
  { key: 'totalMax', label: 'Total máx.', width: 100, type: 'number', placeholder: 'Sin límite' },
  { key: 'fechaDesde', label: 'Desde', width: 140, type: 'date' },
  { key: 'fechaHasta', label: 'Hasta', width: 140, type: 'date' },
]

export default function PedidosFiltros({ abierto, filtros, onChange, onLimpiar, hayFiltrosActivos }) {
  return (
    <Collapse in={abierto}>
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="flex-end"
        sx={{ gap: 2.5, px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}
      >
        <Box sx={{ width: 140 }}>
          <FilterLabel>Estado</FilterLabel>
          <Select
            options={[TODOS, ...estadoOptions]}
            value={filtros.estado}
            onChange={(e) => onChange('estado', e.target.value)}
          />
        </Box>
        <Box sx={{ width: 130 }}>
          <FilterLabel>Método</FilterLabel>
          <Select
            options={[TODOS, ...metodoOptions]}
            value={filtros.metodo}
            onChange={(e) => onChange('metodo', e.target.value)}
          />
        </Box>
        <Box sx={{ width: 130 }}>
          <FilterLabel>Canal</FilterLabel>
          <Select
            options={[TODOS, ...canalOptions]}
            value={filtros.canal}
            onChange={(e) => onChange('canal', e.target.value)}
          />
        </Box>

        {CAMPOS_RANGO.map((c) => (
          <Box key={c.key} sx={{ width: c.width }}>
            <FilterLabel>{c.label}</FilterLabel>
            <Input
              type={c.type}
              placeholder={c.placeholder}
              value={filtros[c.key]}
              onChange={(e) => onChange(c.key, e.target.value)}
            />
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

