import { Box, Stack, Typography, IconButton } from '@mui/material'
import { IconEye, IconPencil, IconTrash, IconToggleRight } from '@tabler/icons-react'
import { DataTable, Pagination, StatusBadge } from '@shared/ui'
import { PAGE_SIZE, estadoVariant } from '@features/produccion/constants/produccion.constants'
import { cap, esEstadoFinal, estadoEfectivo } from '@features/produccion/utils/produccionHelpers'

export default function OrdenesTable({ ordenes, page, total, onPageChange, onVerDetalle, onEditar, onEliminar, onCambiarEstado }) {
  const columns = [
    {
      key: 'id',
      header: 'Orden',
      accessor: (r) => (
        <Typography variant="mono" sx={{ color: 'text.secondary' }}>
          {r.id}
        </Typography>
      ),
    },
    {
      key: 'documento',
      header: 'NIT/Cédula',
      accessor: (r) => (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {r.generadoPor.documento}
        </Typography>
      ),
    },
    {
      key: 'fechaSolicitud',
      header: 'Fecha solicitud',
      accessor: (r) => (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {r.fechaSolicitud}
        </Typography>
      ),
    },
    {
      key: 'fechaFabricacion',
      header: 'Fecha fabricación',
      accessor: (r) =>
        r.fechaFabricacion ? (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {r.fechaFabricacion}
          </Typography>
        ) : (
          <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.dim', opacity: 0.3 }}>
            Por definir
          </Typography>
        ),
    },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (r) => {
        const efectivo = estadoEfectivo(r)
        const bloqueado = esEstadoFinal(r.estado)
        return (
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <StatusBadge variant={estadoVariant[efectivo]} dot>
              {cap(efectivo)}
            </StatusBadge>
            <IconButton
              size="small"
              disabled={bloqueado}
              title={bloqueado ? 'Estado final, no editable' : 'Cambiar estado'}
              onClick={(e) => {
                e.stopPropagation()
                onCambiarEstado(r)
              }}
              sx={{ color: 'text.secondary' }}
            >
              <IconToggleRight size={15} />
            </IconButton>
          </Stack>
        )
      },
    },
    {
      key: 'acciones',
      header: '',
      align: 'right',
      accessor: (r) => {
        const bloqueado = esEstadoFinal(r.estado)
        return (
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
            <IconButton
              size="small"
              title="Ver detalle"
              onClick={(e) => {
                e.stopPropagation()
                onVerDetalle(r)
              }}
              sx={{ color: 'text.secondary' }}
            >
              <IconEye size={15} />
            </IconButton>
            <IconButton
              size="small"
              disabled={bloqueado}
              title={bloqueado ? 'Esta orden ya no se puede editar' : 'Editar orden'}
              onClick={(e) => {
                e.stopPropagation()
                onEditar(r)
              }}
              sx={{ color: 'text.secondary' }}
            >
              <IconPencil size={15} />
            </IconButton>
            <IconButton
              size="small"
              title="Eliminar orden"
              onClick={(e) => {
                e.stopPropagation()
                onEliminar(r.id)
              }}
              sx={{ color: 'error.main' }}
            >
              <IconTrash size={15} />
            </IconButton>
          </Stack>
        )
      },
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={ordenes} keyExtractor={(r) => r.id} emptyMessage="Sin órdenes encontradas" />
      <Box sx={{ px: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Pagination page={page} total={total} pageSize={PAGE_SIZE} onPageChange={onPageChange} />
      </Box>
    </>
  )
}
