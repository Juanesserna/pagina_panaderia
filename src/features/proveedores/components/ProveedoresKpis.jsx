import { Box } from '@mui/material'
import { IconTruck, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { KPICard } from '@features/produccion/components/KPICard'

export function ProveedoresKpis({ kpis }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
      <KPICard title="Total proveedores" value={kpis.total} icon={<IconTruck size={16} />} variant="accent" />
      <KPICard title="Activos" value={kpis.activos} icon={<IconCircleCheck size={16} />} variant="success" />
      <KPICard title="Inactivos" value={kpis.inactivos} icon={<IconCircleX size={16} />} variant="danger" />
    </Box>
  )
}
