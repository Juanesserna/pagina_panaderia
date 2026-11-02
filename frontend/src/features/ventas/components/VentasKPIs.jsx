import { IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { KPICard, KPIGrid } from '@shared/ui'

export default function VentasKPIs({ ventas }) {
  const completados = ventas.filter((v) => v.estado === 'completado').length
  const anulados = ventas.filter((v) => v.estado === 'anulado').length

  return (
    <KPIGrid>
      <KPICard title="Completados" value={completados} icon={<IconCircleCheck size={16} />} variant="success" />
      <KPICard title="Anulados" value={anulados} icon={<IconCircleX size={16} />} variant="danger" />
    </KPIGrid>
  )
}
