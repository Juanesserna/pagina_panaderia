import { IconReceipt, IconShoppingBag, IconShoppingCart, IconTrendingUp } from '@tabler/icons-react'
import { KPICard, KPIGrid } from '@shared/ui'
import { formatearMoneda } from '../utils/dashboardHelpers'

export function DashboardKpis({ kpis, totalCompras, etiquetaPeriodo, resumenPedidos }) {
  return (
    <KPIGrid>
      <KPICard
        title="Total ventas del mes"
        value={formatearMoneda(kpis.ventasDelMes)}
        subtitle={`Actualizado hace ${kpis.minutosDesdeActualizacion} min`}
        icon={<IconTrendingUp size={16} />}
        variant="accent"
      />
      <KPICard
        title="Pedidos activos"
        value={kpis.pedidosActivos}
        subtitle={`${kpis.pedidosListos} listos para entrega`}
        icon={<IconShoppingCart size={16} />}
        variant="success"
      />
      <KPICard
        title="Compras del período"
        value={formatearMoneda(totalCompras)}
        subtitle={etiquetaPeriodo}
        icon={<IconShoppingBag size={16} />}
        variant="warning"
      />
      <KPICard
        title="Pedidos recientes"
        value={resumenPedidos.total}
        subtitle={`${resumenPedidos.completados} completados · ${resumenPedidos.enCurso} en curso`}
        icon={<IconReceipt size={16} />}
        variant="accent"
      />
    </KPIGrid>
  )
}
