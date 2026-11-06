import { Box } from '@mui/material'
import { DataTable, Pagination } from '@shared/ui'
import { PAGE_SIZE } from '../constants/pedidos.constants'
import { getPedidosColumns } from './pedidosColumns'

export default function PedidosTable({
  pedidos,
  total,
  page,
  onPageChange,
  sortKey,
  sortDir,
  onSort,
  onCambiarEstado,
  onPagos,
  onVerDetalle,
}) {
  const columns = getPedidosColumns({ onCambiarEstado, onPagos, onVerDetalle })

  return (
    <>
      <DataTable
        columns={columns}
        data={pedidos}
        keyExtractor={(r) => r.id}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
        emptyMessage="Sin pedidos encontrados"
      />

      <Box sx={{ px: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Pagination page={page} total={total} pageSize={PAGE_SIZE} onPageChange={onPageChange} />
      </Box>
    </>
  )
}

