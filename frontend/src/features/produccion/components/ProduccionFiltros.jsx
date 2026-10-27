import { Box, Stack, Collapse } from '@mui/material'
import { Button, Input, Select } from '@shared/ui'
import { estadoOptions, origenOptions } from '@features/produccion/constants/produccion.constants'
import FilterLabel from '@features/produccion/components/common/FilterLabel'

// `filtros` es el objeto que devuelve useOrdenesFiltros.
export default function ProduccionFiltros({ open, filtros }) {
  const {
    estadoFilter,
    setEstadoFilter,
    origenFilter,
    setOrigenFilter,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    cantidadMin,
    setCantidadMin,
    cantidadMax,
    setCantidadMax,
    filtrosActivos,
    limpiarFiltros,
  } = filtros

  return (
    <Collapse in={open}>
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="flex-end"
        sx={{ gap: 2.5, px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}
      >
        <Box sx={{ width: 144 }}>
          <FilterLabel>Estado</FilterLabel>
          <Select
            options={[{ value: '', label: 'Todos' }, ...estadoOptions]}
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          />
        </Box>

        <Box sx={{ width: 144 }}>
          <FilterLabel>Origen</FilterLabel>
          <Select
            options={[{ value: '', label: 'Todos' }, ...origenOptions]}
            value={origenFilter}
            onChange={(e) => setOrigenFilter(e.target.value)}
          />
        </Box>

        <Box sx={{ width: 144 }}>
          <FilterLabel>Desde</FilterLabel>
          <Input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
        </Box>

        <Box sx={{ width: 144 }}>
          <FilterLabel>Hasta</FilterLabel>
          <Input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
        </Box>

        <Box sx={{ width: 112 }}>
          <FilterLabel>Cantidad mín.</FilterLabel>
          <Input type="number" min={0} placeholder="0" value={cantidadMin} onChange={(e) => setCantidadMin(e.target.value)} />
        </Box>

        <Box sx={{ width: 112 }}>
          <FilterLabel>Cantidad máx.</FilterLabel>
          <Input type="number" min={0} placeholder="Sin límite" value={cantidadMax} onChange={(e) => setCantidadMax(e.target.value)} />
        </Box>

        {filtrosActivos && (
          <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
            Limpiar filtros
          </Button>
        )}
      </Stack>
    </Collapse>
  )
}
