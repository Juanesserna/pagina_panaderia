import { Box } from '@mui/material'
import { IconPackage, IconCircleCheck, IconAlertTriangle, IconCircleX } from '@tabler/icons-react'
import { KPICard } from '@features/produccion/components/KPICard'

export function InsumosKpis({ kpis }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
      <KPICard title="Total insumos" value={kpis.total} icon={<IconPackage size={16} />} variant="accent" />
      <KPICard title="Activos" value={kpis.activos} icon={<IconCircleCheck size={16} />} variant="success" />
      <KPICard title="Stock bajo" value={kpis.stockBajo} icon={<IconAlertTriangle size={16} />} variant="warning" />
      <KPICard title="Inactivos" value={kpis.inactivos} icon={<IconCircleX size={16} />} variant="danger" />
    </Box>
  )
}
