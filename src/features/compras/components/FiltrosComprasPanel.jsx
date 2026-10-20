import { Box, Collapse, Stack } from '@mui/material'
import { Button, Input, Select } from '@shared/ui'
import { categoriaOptions, estadoOptions } from '../constants/compras.constants'
import { opcionesProveedor } from '../utils/comprasHelpers'
import { Campo } from './Campo'

// Panel desplegable de filtros (estado, categoría, proveedor y rango de fechas).
export function FiltrosComprasPanel({ abierto, filtros, proveedores, onChange, onLimpiar, hayFiltros }) {
  return (
    <Collapse in={abierto}>
      <Stack
        direction="row"
        sx={{ flexWrap: 'wrap', alignItems: 'flex-end', gap: 2.5, px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}
      >
        <Box sx={{ width: 140 }}>
          <Campo label="Estado">
            <Select
              options={[{ value: '', label: 'Todos' }, ...estadoOptions]}
              value={filtros.estado}
              onChange={(e) => onChange('estado', e.target.value)}
            />
          </Campo>
        </Box>
        <Box sx={{ width: 160 }}>
          <Campo label="Categoría">
            <Select
              options={[{ value: '', label: 'Todas' }, ...categoriaOptions]}
              value={filtros.categoria}
              onChange={(e) => onChange('categoria', e.target.value)}
            />
          </Campo>
        </Box>
        <Box sx={{ width: 210 }}>
          <Campo label="Proveedor">
            <Select
              options={[{ value: '', label: 'Todos' }, ...opcionesProveedor(proveedores)]}
              value={filtros.proveedorId}
              onChange={(e) => onChange('proveedorId', e.target.value)}
            />
          </Campo>
        </Box>
        <Box sx={{ width: 140 }}>
          <Campo label="Desde">
            <Input type="date" value={filtros.fechaDesde} onChange={(e) => onChange('fechaDesde', e.target.value)} />
          </Campo>
        </Box>
        <Box sx={{ width: 140 }}>
          <Campo label="Hasta">
            <Input type="date" value={filtros.fechaHasta} onChange={(e) => onChange('fechaHasta', e.target.value)} />
          </Campo>
        </Box>
        {hayFiltros && (
          <Button variant="ghost" size="sm" onClick={onLimpiar}>
            Limpiar filtros
          </Button>
        )}
      </Stack>
    </Collapse>
  )
}
