import { IconCircleCheck, IconClock, IconCurrencyDollar } from '@tabler/icons-react'
import { KPICard, KPIGrid } from '@shared/ui'
import { formatearMoneda } from '../utils/comprasHelpers'

export function ComprasKpis({ kpis }) {
  return (
    <KPIGrid>
      <KPICard title="Compras del mes" value={formatearMoneda(kpis.totalMes)} icon={<IconCurrencyDollar size={16} />} variant="accent" />
      <KPICard title="Pendientes" value={kpis.pendientes} icon={<IconClock size={16} />} variant="warning" />
      <KPICard title="Recibidas (mes)" value={kpis.recibidas} icon={<IconCircleCheck size={16} />} variant="success" />
    </KPIGrid>
  )
}
