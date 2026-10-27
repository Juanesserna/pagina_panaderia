import { Box, Stack } from '@mui/material'
import { Button, Input, Select } from '@shared/ui'
import { estadoOptions, nivelStockOptions } from '../constants/insumos.constants'
import { getCategorias, getUnidadesMedida } from '../services/insumosService'
import { Campo } from './Campo'

/**
 * Filtros en línea, debajo del toolbar de la tabla.
 * Aplica en vivo: cada cambio actualiza filtrosActivos directamente,
 * mismo patrón que FiltrosProveedoresPanel.
 */
export function FiltrosInsumosPanel({ filtrosActivos, onChange, onLimpiar }) {
  const categorias = getCategorias()
  const unidades = getUnidadesMedida()
  const set = (campo) => (e) => onChange({ ...filtrosActivos, [campo]: e.target.value })

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      alignItems="flex-end"
      sx={{ gap: 2.5, px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}
    >
      <Box sx={{ flex: '1 1 170px', minWidth: 150 }}>
        <Campo label="Categoría">
          <Select
            options={[{ value: '', label: 'Todas' }, ...categorias.map((c) => ({ value: c.id, label: c.nombre }))]}
            value={filtrosActivos.idCategoria}
            onChange={set('idCategoria')}
          />
        </Campo>
      </Box>

      <Box sx={{ flex: '1 1 130px', minWidth: 110 }}>
        <Campo label="Estado">
          <Select
            options={[{ value: '', label: 'Todos' }, ...estadoOptions]}
            value={filtrosActivos.estado}
            onChange={set('estado')}
          />
        </Campo>
      </Box>

      <Box sx={{ flex: '1 1 150px', minWidth: 130 }}>
        <Campo label="Nivel de stock">
          <Select
            options={[{ value: '', label: 'Todos' }, ...nivelStockOptions]}
            value={filtrosActivos.nivelStock}
            onChange={set('nivelStock')}
          />
        </Campo>
      </Box>

      <Box sx={{ flex: '1 1 130px', minWidth: 110 }}>
        <Campo label="Unidad">
          <Select
            options={[{ value: '', label: 'Todas' }, ...unidades.map((u) => ({ value: u.id, label: u.abreviatura }))]}
            value={filtrosActivos.idUnidadMedida}
            onChange={set('idUnidadMedida')}
          />
        </Campo>
      </Box>

      <Box sx={{ flex: '1 1 110px', minWidth: 100 }}>
        <Campo label="Stock mín.">
          <Input type="number" placeholder="0" value={filtrosActivos.stockMinimoDesde} onChange={set('stockMinimoDesde')} />
        </Campo>
      </Box>

      <Box sx={{ flex: '1 1 110px', minWidth: 100 }}>
        <Campo label="Stock máx.">
          <Input type="number" placeholder="Sin límite" value={filtrosActivos.stockMinimoHasta} onChange={set('stockMinimoHasta')} />
        </Campo>
      </Box>

      <Button variant="ghost" size="sm" onClick={onLimpiar}>
        Limpiar filtros
      </Button>
    </Stack>
  )
}
