import { Stack, Typography, IconButton } from '@mui/material'
import { IconEye, IconPencil, IconToggleLeft, IconTrash } from '@tabler/icons-react'
import { DataTable } from '@features/produccion/components/DataTable'
import { StatusBadge } from '@features/produccion/components/StatusBadge'
import { SortHeader } from './SortHeader'
import { formatoCodigo, getEstadoVisual, estadoVisualVariant } from '../utils/proveedoresHelpers'

const celdaSx = { fontSize: 12.5, color: 'text.secondary', whiteSpace: 'nowrap' }

export function ProveedoresTable({ rows, sortKey, sortDir, onSort, onVer, onEditar, onCambiarEstado, onEliminar }) {
  const sortProps = { sortKey, sortDir, onSort }

  const columns = [
    {
      key: 'id',
      header: <SortHeader label="Código" colKey="id" {...sortProps} />,
      accessor: (r) => (
        <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
          {formatoCodigo(r.id)}
        </Typography>
      ),
    },
    {
      key: 'nombre',
      header: <SortHeader label="Nombre empresa" colKey="nombre" {...sortProps} />,
      accessor: (r) => <Typography sx={{ fontSize: 14, color: 'text.primary' }}>{r.nombre}</Typography>,
    },
    {
      key: 'nit',
      header: 'NIT',
      accessor: (r) => <Typography sx={{ ...celdaSx, fontFamily: 'monospace' }}>{r.nit}</Typography>,
    },
    { key: 'nombreContacto', header: 'Contacto', accessor: (r) => <Typography sx={celdaSx}>{r.nombreContacto}</Typography> },
    { key: 'telefono', header: 'Teléfono', accessor: (r) => <Typography sx={celdaSx}>{r.telefono}</Typography> },
    { key: 'email', header: 'Correo', accessor: (r) => <Typography sx={celdaSx}>{r.email}</Typography> },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (r) => {
        const ev = getEstadoVisual(r)
        return (
          <StatusBadge variant={estadoVisualVariant[ev]} dot>
            {ev}
          </StatusBadge>
        )
      },
    },
    {
      key: 'acciones',
      header: '',
      align: 'right',
      accessor: (r) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
          <IconButton size="small" title="Ver detalle" onClick={() => onVer(r)} sx={{ color: 'text.secondary' }}>
            <IconEye size={15} />
          </IconButton>
          <IconButton size="small" title="Editar" onClick={() => onEditar(r)} sx={{ color: 'text.secondary' }}>
            <IconPencil size={15} />
          </IconButton>
          <IconButton size="small" title="Cambiar estado" onClick={() => onCambiarEstado(r)} sx={{ color: 'text.secondary' }}>
            <IconToggleLeft size={15} />
          </IconButton>
          <IconButton size="small" title="Eliminar" onClick={() => onEliminar(r)} sx={{ color: 'error.main' }}>
            <IconTrash size={15} />
          </IconButton>
        </Stack>
      ),
    },
  ]

  return <DataTable columns={columns} data={rows} keyExtractor={(r) => r.id} emptyMessage="Sin proveedores encontrados" />
}
