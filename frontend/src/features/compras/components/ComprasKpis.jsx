import { IconCircleCheck, IconCircleX, IconCurrencyDollar } from '@tabler/icons-react'
import { KPICard, KPIGrid } from '@shared/ui'
import { formatearMoneda } from '../utils/comprasHelpers'

export function ComprasKpis({ kpis }) {
  return (
    <KPIGrid>
      <KPICard title="Compras del mes" value={formatearMoneda(kpis.totalMes)} icon={<IconCurrencyDollar size={16} />} variant="accent" />
      <KPICard title="Registradas" value={kpis.registradas} icon={<IconCircleCheck size={16} />} variant="success" />
      <KPICard title="Anuladas" value={kpis.anuladas} icon={<IconCircleX size={16} />} variant="danger" />
    </KPIGrid>
  )
}
