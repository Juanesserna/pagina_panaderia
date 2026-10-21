import { IconButton, Stack, Typography } from '@mui/material'
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react'
import { DataTable } from '@shared/ui'
import { formatoCodigo } from '../utils/proveedoresHelpers'
import { EstadoSwitch } from './EstadoSwitch'

const accionSx = { color: 'text.secondary', '&:hover': { color: 'primary.main' } }
const accionEliminarSx = { color: 'text.secondary', '&:hover': { color: 'error.main' } }

export function ProveedoresTable({ rows, sortKey, sortDir, onSort, onVer, onEditar, onCambiarEstado, onEliminar }) {
  const columns = [
    {
      key: 'id',
      header: 'Código',
      sortable: true,
      accessor: (r) => <Typography variant="mono">{formatoCodigo(r.id)}</Typography>,
    },
    {
      key: 'nombre',
      header: 'Nombre empresa',
      sortable: true,
      accessor: (r) => <Typography variant="subtitle1">{r.nombre}</Typography>,
    },
    {
      key: 'nit',
      header: 'NIT',
      accessor: (r) => <Typography variant="mono">{r.nit}</Typography>,
    },
    {
      key: 'nombreContacto',
      header: 'Contacto',
      accessor: (r) => (
        <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
          {r.nombreContacto}
        </Typography>
      ),
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      accessor: (r) => (
        <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
          {r.telefono}
        </Typography>
      ),
    },
    {
      key: 'email',
      header: 'Correo',
      accessor: (r) => (
        <Typography variant="body1" sx={{ color: 'primary.main' }}>
          {r.email}
        </Typography>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (r) => <EstadoSwitch activo={r.estado} nombre={r.nombre} onChange={() => onCambiarEstado(r)} />,
    },
    {
      key: 'acciones',
      header: '',
      align: 'right',
      accessor: (r) => (
        <Stack direction="row" spacing={0.25} justifyContent="flex-end">
          <IconButton size="small" title="Ver detalle" sx={accionSx} onClick={() => onVer(r)}>
            <IconEye size={18} />
          </IconButton>
          <IconButton size="small" title="Editar" sx={accionSx} onClick={() => onEditar(r)}>
            <IconPencil size={18} />
          </IconButton>
          <IconButton size="small" title="Eliminar" sx={accionEliminarSx} onClick={() => onEliminar(r)}>
            <IconTrash size={18} />
          </IconButton>
        </Stack>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={rows}
      keyExtractor={(r) => r.id}
      sortKey={sortKey}
      sortDir={sortDir}
      onSort={onSort}
      emptyMessage="Sin proveedores encontrados"
    />
  )
}
