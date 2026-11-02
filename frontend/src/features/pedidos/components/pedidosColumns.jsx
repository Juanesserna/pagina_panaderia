import { IconButton, Stack, Typography } from '@mui/material'
import { IconReceipt, IconToggleRight } from '@tabler/icons-react'
import { Button, StatusBadge } from '@shared/ui'
import { estadoVariant, canalOptions } from '../constants/pedidos.constants'
import { cap, obtenerNombreCliente } from '../utils/pedidosHelpers'

export function getPedidosColumns({ onCambiarEstado, onPagos, onVerDetalle }) {
  return [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      accessor: (r) => <Typography variant="subtitle2">{r.id}</Typography>,
    },
    {
      key: 'cliente',
      header: 'Cliente',
      accessor: (r) => (
        <Stack spacing={0.25}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {obtenerNombreCliente(r)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            NIT: {r.nit || '—'}
          </Typography>
        </Stack>
      ),
    },
    {
      key: 'metodo',
      header: 'Método',
      accessor: (r) => <Typography variant="body2">{r.metodo ? cap(r.metodo) : '—'}</Typography>,
    },
    {
      key: 'canal',
      header: 'Canal',
      accessor: (r) => (
        <Typography variant="body2">
          {r.canal ? canalOptions.find((o) => o.value === r.canal)?.label ?? cap(r.canal) : '—'}
        </Typography>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      sortable: true,
      accessor: (r) => <Typography variant="subtitle2">${r.total?.toFixed(2)}</Typography>,
    },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (r) => {
        // Tarea 4: Bloqueo estricto si está Anulado
        const bloqueado = r.estado === 'anulado'
        return (
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <StatusBadge variant={estadoVariant[r.estado]} dot>
              {cap(r.estado)}
            </StatusBadge>
            <IconButton
              size="small"
              disabled={bloqueado}
              title={bloqueado ? 'Un pedido anulado no se puede modificar' : 'Cambiar estado'}
              onClick={(e) => {
                e.stopPropagation()
                onCambiarEstado(r)
              }}
              sx={{ color: bloqueado ? 'text.disabled' : 'text.secondary' }}
            >
              <IconToggleRight size={16} />
            </IconButton>
          </Stack>
        )
      },
    },
    {
      key: 'fecha',
      header: 'Fecha',
      accessor: (r) => (
        <Typography variant="caption">
          {r.fecha} {r.hora}
        </Typography>
      ),
    },
    {
      key: 'acciones',
      header: '',
      align: 'right',
      accessor: (r) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5} sx={{ width: '100%' }}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<IconReceipt size={12} />}
            onClick={(e) => {
              e.stopPropagation()
              onPagos(r)
            }}
          >
            Abonos
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onVerDetalle(r)
            }}
          >
            Ver comprobante
          </Button>
        </Stack>
      ),
    },
  ]
}
