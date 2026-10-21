import { IconButton, Stack, Typography } from '@mui/material'
import { IconReceipt, IconToggleRight } from '@tabler/icons-react'
import { Button, StatusBadge } from '@shared/ui'
import { canalOptions, estadoVariant } from '../constants/ventas.constants'
import { cap, puedeVerComprobante } from '../utils/ventasHelpers'

// Definición de columnas del DataTable de ventas.
export function getVentasColumns({ onCambiarEstado, onPagos, onVerComprobante }) {
  return [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      accessor: (r) => <Typography variant="subtitle2">{r.id}</Typography>,
    },
    {
      key: 'nit',
      header: 'NIT/Cédula',
      accessor: (r) => <Typography variant="body2">{r.nit || '—'}</Typography>,
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
      accessor: (r) => <Typography variant="subtitle2">${r.total.toFixed(2)}</Typography>,
    },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (r) => {
        const bloqueado = r.estado === 'cancelado'
        return (
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <StatusBadge variant={estadoVariant[r.estado]} dot>
              {cap(r.estado)}
            </StatusBadge>
            <IconButton
              size="small"
              disabled={bloqueado}
              title={bloqueado ? 'Una venta cancelada no se puede modificar' : 'Cambiar estado'}
              onClick={(e) => {
                e.stopPropagation()
                onCambiarEstado(r)
              }}
              sx={{ color: bloqueado ? 'text.dim' : 'text.secondary' }}
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
            Pagos
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!puedeVerComprobante(r)}
            onClick={(e) => {
              e.stopPropagation()
              onVerComprobante(r)
            }}
          >
            Ver comprobante
          </Button>
        </Stack>
      ),
    },
  ]
}
