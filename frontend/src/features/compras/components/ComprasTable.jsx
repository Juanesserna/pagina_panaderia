import { Box, IconButton, Stack, Typography } from '@mui/material'
import { IconEye, IconTrash } from '@tabler/icons-react'
import { DataTable, StatusBadge } from '@shared/ui'
import { ESTADO, estadoVariant } from '../constants/compras.constants'
import { etiquetaProveedor, formatearMoneda } from '../utils/comprasHelpers'

const MENSAJE_ANULADA = 'Una orden anulada no se puede modificar'

function AccionFila({ titulo, icono, onClick, disabled, color = 'text.secondary' }) {
  return (
    <IconButton size="small" title={titulo} disabled={disabled} onClick={onClick} sx={{ color }}>
      {icono}
    </IconButton>
  )
}

export function ComprasTable({
  compras,
  proveedores,
  ordenKey,
  ordenDir,
  onOrdenar,
  mensajeVacio,
  onVer,
  onCambiarEstado,
}) {
  const columns = [
    {
      key: 'id',
      header: 'Orden',
      sortable: true,
      accessor: (r) => (
        <Typography variant="mono" sx={{ color: 'text.primary' }}>
          {r.id}
        </Typography>
      ),
    },
    {
      key: 'fecha',
      header: 'Fecha',
      sortable: true,
      accessor: (r) => <Typography variant="body2">{r.fecha}</Typography>,
    },
    {
      key: 'proveedor',
      header: 'Proveedor',
      sortable: true,
      accessor: (r) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography variant="body2" noWrap sx={{ maxWidth: 220, color: 'text.primary' }}>
            {etiquetaProveedor(proveedores, r.proveedorId)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.dim' }}>
            {r.categoria}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'items',
      header: 'Cantidad',
      align: 'center',
      accessor: (r) => <Typography variant="body2">{r.detalle.length}</Typography>,
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      sortable: true,
      accessor: (r) => <Typography variant="subtitle1">{formatearMoneda(r.total)}</Typography>,
    },
    {
      key: 'numeroFactura',
      header: 'Número de factura',
      accessor: (r) => <Typography variant="body2">{r.numeroFactura || '—'}</Typography>,
    },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (r) => {
        const bloqueado = r.estado === ESTADO.ANULADO
        return (
          <Box
            onClick={() => !bloqueado && onCambiarEstado(r)}
            title={bloqueado ? MENSAJE_ANULADA : 'Cambiar estado'}
            sx={{ display: 'inline-flex', cursor: bloqueado ? 'not-allowed' : 'pointer', opacity: bloqueado ? 0.5 : 1 }}
          >
            <StatusBadge variant={estadoVariant[r.estado]} dot>
              {r.estado}
            </StatusBadge>
          </Box>
        )
      },
    },
      {
        key: 'acciones',
        header: '',
        align: 'right',
        accessor: (r) => {
          const anulada = r.estado === ESTADO.ANULADO
          return (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <AccionFila titulo="Ver detalle" icono={<IconEye size={15} />} onClick={() => onVer(r)} />
              {!anulada && (
                <AccionFila
                  titulo="Anular orden"
                  icono={<IconTrash size={15} />}
                  color="error.main"
                  onClick={() => onCambiarEstado(r)}
                />
              )}
            </Stack>
          )
        },
      },
  ]

  return (
    <DataTable
      columns={columns}
      data={compras}
      keyExtractor={(r) => r.id}
      sortKey={ordenKey}
      sortDir={ordenDir}
      onSort={onOrdenar}
      emptyMessage={mensajeVacio}
    />
  )
}
