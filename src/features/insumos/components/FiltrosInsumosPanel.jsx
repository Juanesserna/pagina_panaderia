import { Stack, Box } from '@mui/material'
import { Select } from '@features/produccion/components/Select'
import { Input } from '@features/produccion/components/Input'
import { Button } from '@features/produccion/components/Button'
import { Campo } from './Campo'
import { getCategorias, getUnidadesMedida } from '../services/insumosService'

const NIVELES_STOCK = [
  { value: '', label: 'Todos' },
  { value: 'bajo', label: 'Stock bajo' },
  { value: 'normal', label: 'Stock normal' },
  { value: 'sin', label: 'Sin stock' },
]

export function FiltrosInsumosPanel({ filtrosActivos, onChange, onLimpiar }) {
  const categorias = getCategorias()
  const unidades = getUnidadesMedida()
  const set = (campo) => (e) => onChange({ ...filtrosActivos, [campo]: e.target.value })

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      alignItems="flex-end"
      sx={{
        px: 2.5,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.alt',
        gap: 3.5,
        columnGap: 3.5,
        rowGap: 2,
      }}
    >
      <Campo label="Categoría">
        <Box sx={{ width: 160 }}>
          <Select
            options={[{ value: '', label: 'Todas' }, ...categorias.map((c) => ({ value: c.id, label: c.nombre }))]}
            value={filtrosActivos.idCategoria}
            onChange={set('idCategoria')}
          />
        </Box>
      </Campo>

      <Campo label="Estado">
        <Box sx={{ width: 144 }}>
          <Select
            options={[
              { value: '', label: 'Todos' },
              { value: 'true', label: 'Activo' },
              { value: 'false', label: 'Inactivo' },
            ]}
            value={filtrosActivos.estado}
            onChange={set('estado')}
          />
        </Box>
      </Campo>

      <Campo label="Nivel de stock">
        <Box sx={{ width: 144 }}>
          <Select options={NIVELES_STOCK} value={filtrosActivos.nivelStock} onChange={set('nivelStock')} />
        </Box>
      </Campo>

      <Campo label="Unidad">
        <Box sx={{ width: 112 }}>
          <Select
            options={[{ value: '', label: 'Todas' }, ...unidades.map((u) => ({ value: u.id, label: u.abreviatura }))]}
            value={filtrosActivos.idUnidadMedida}
            onChange={set('idUnidadMedida')}
          />
        </Box>
      </Campo>

      <Campo label="Stock mín.">
        <Box sx={{ width: 112 }}>
          <Input type="number" min={0} placeholder="0" value={filtrosActivos.stockMinimoDesde} onChange={set('stockMinimoDesde')} />
        </Box>
      </Campo>

      <Campo label="Stock máx.">
        <Box sx={{ width: 112 }}>
          <Input type="number" min={0} placeholder="Sin límite" value={filtrosActivos.stockMinimoHasta} onChange={set('stockMinimoHasta')} />
        </Box>
      </Campo>

      <Button variant="ghost" size="sm" onClick={onLimpiar}>
        Limpiar filtros
      </Button>
    </Stack>
  )
}
