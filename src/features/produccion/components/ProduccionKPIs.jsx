import { IconCircleCheck, IconAlertTriangle } from '@tabler/icons-react'
import { KPICard, KPIGrid } from '@shared/ui'
import { estadoEfectivo } from '@features/produccion/utils/produccionHelpers'

export default function ProduccionKPIs({ ordenes }) {
  const completados = ordenes.filter((o) => estadoEfectivo(o) === 'completado').length
  const retrasados = ordenes.filter((o) => estadoEfectivo(o) === 'retrasado').length

  return (
    <KPIGrid>
      <KPICard title="Órdenes completadas" value={completados} icon={<IconCircleCheck size={16} />} variant="success" />
      <KPICard title="Retrasadas" value={retrasados} icon={<IconAlertTriangle size={16} />} variant="danger" />
    </KPIGrid>
  )
}
