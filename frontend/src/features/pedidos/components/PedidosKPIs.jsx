import { IconClock, IconCircleCheck, IconCircleX, IconLoader } from '@tabler/icons-react'
import { KPICard, KPIGrid } from '@shared/ui'

export default function PedidosKPIs({ pedidos = [] }) {
  const pendientes = pedidos.filter((p) => p.estado === 'pendiente').length
  const enProceso = pedidos.filter((p) => p.estado === 'en proceso' || p.estado === 'pago parcial').length
  const completados = pedidos.filter((p) => p.estado === 'completado').length
  const anulados = pedidos.filter((p) => p.estado === 'anulado').length // Tarea 4: Anulados en vez de cancelados

  return (
    <KPIGrid>
      <KPICard title="Pendientes" value={pendientes} icon={<IconClock size={16} />} variant="warning" />
      <KPICard title="En preparación" value={enProceso} icon={<IconLoader size={16} />} variant="process" />
      <KPICard title="Completados" value={completados} icon={<IconCircleCheck size={16} />} variant="success" />
      <KPICard title="Anulados" value={anulados} icon={<IconCircleX size={16} />} variant="danger" />
    </KPIGrid>
  )
}

