import { Box, Typography } from '@mui/material'
import { DataTable, StatusBadge } from '@shared/ui'
import { estadoPedidoVariant } from '../constants/dashboard.constants'
import { capitalizar, formatearMoneda } from '../utils/dashboardHelpers'

const columns = [
  {
    key: 'id',
    header: 'Pedido',
    accessor: (r) => (
      <Typography variant="mono" sx={{ color: 'text.primary' }}>
        #{r.id}
      </Typography>
    ),
  },
  { key: 'cliente', header: 'Cliente', accessor: (r) => <Typography variant="body1">{r.cliente}</Typography> },
  { key: 'productos', header: 'Productos', accessor: (r) => <Typography variant="body2">{r.productos}</Typography> },
  {
    key: 'total',
    header: 'Total',
    align: 'right',
    accessor: (r) => <Typography variant="subtitle1">{formatearMoneda(r.total)}</Typography>,
  },
  {
    key: 'estado',
    header: 'Estado',
    accessor: (r) => (
      <StatusBadge variant={estadoPedidoVariant[r.estado]} dot>
        {capitalizar(r.estado)}
      </StatusBadge>
    ),
  },
  { key: 'hora', header: 'Hora', align: 'right', accessor: (r) => <Typography variant="body2">{r.hora}</Typography> },
]

export function PedidosRecientes({ pedidos, mensajeVacio }) {
  return (
    <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6">Pedidos recientes</Typography>
      </Box>
      <DataTable columns={columns} data={pedidos} keyExtractor={(r) => r.id} emptyMessage={mensajeVacio} />
    </Box>
  )
}
