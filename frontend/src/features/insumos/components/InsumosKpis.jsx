import { IconPackage, IconCircleCheck, IconAlertTriangle, IconCircleX } from '@tabler/icons-react'
import { KPICard, KPIGrid } from '@shared/ui'

/** Cuatro KPIs en fila: Total / Activos / Stock bajo / Inactivos. */
export function InsumosKpis({ kpis }) {
  return (
    <KPIGrid>
      <KPICard title="Total insumos" value={kpis.total} icon={<IconPackage size={16} />} variant="accent" />
      <KPICard title="Activos" value={kpis.activos} icon={<IconCircleCheck size={16} />} variant="success" />
      <KPICard title="Stock bajo" value={kpis.stockBajo} icon={<IconAlertTriangle size={16} />} variant="warning" />
      <KPICard title="Inactivos" value={kpis.inactivos} icon={<IconCircleX size={16} />} variant="danger" />
    </KPIGrid>
  )
}
