import { Box } from '@mui/material'
import { DataTable, Pagination } from '@shared/ui'
import { PAGE_SIZE } from '../constants/ventas.constants'
import { getVentasColumns } from './ventasColumns'

export default function VentasTable({
  ventas,
  total,
  page,
  onPageChange,
  sortKey,
  sortDir,
  onSort,
  onCambiarEstado,
  onPagos,
  onVerComprobante,
}) {
  const columns = getVentasColumns({ onCambiarEstado, onPagos, onVerComprobante })

  return (
    <>
      <DataTable
        columns={columns}
        data={ventas}
        keyExtractor={(r) => r.id}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
        emptyMessage="Sin ventas encontradas"
      />

      <Box sx={{ px: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Pagination page={page} total={total} pageSize={PAGE_SIZE} onPageChange={onPageChange} />
      </Box>
    </>
  )
}
