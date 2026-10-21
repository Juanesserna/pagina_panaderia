import { IconTruck, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { KPICard, KPIGrid } from '@shared/ui'

/** Tres KPIs en fila: Total / Activos / Inactivos. */
export function ProveedoresKpis({ kpis }) {
  return (
    <KPIGrid>
      <KPICard title="Total proveedores" value={kpis.total} icon={<IconTruck size={16} />} variant="accent" />
      <KPICard title="Activos" value={kpis.activos} icon={<IconCircleCheck size={16} />} variant="success" />
      <KPICard title="Inactivos" value={kpis.inactivos} icon={<IconCircleX size={16} />} variant="danger" />
    </KPIGrid>
  )
}
