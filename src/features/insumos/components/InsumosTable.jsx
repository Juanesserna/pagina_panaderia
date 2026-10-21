import { IconButton, Stack, Typography } from '@mui/material'
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react'
import { DataTable } from '@shared/ui'
import { formatoCodigo, formatoMoneda, nombreCategoria, unidadAbrev, getEstadoVisual } from '../utils/insumosHelpers'
import { EstadoSwitch } from './EstadoSwitch'

const accionSx = { color: 'text.secondary', '&:hover': { color: 'primary.main' } }
const accionEliminarSx = { color: 'text.secondary', '&:hover': { color: 'error.main' } }

// Jerarquía de texto: el dato principal (código, nombre, stock actual) va en
// negrita; los datos secundarios (categoría, unidad, stock mínimo, costo) en body2.
export function InsumosTable({ rows, sortKey, sortDir, onSort, onVer, onEditar, onCambiarEstado, onEliminar }) {
  const columns = [
    {
      key: 'id',
      header: 'Código',
      sortable: true,
      accessor: (r) => <Typography variant="mono">{formatoCodigo(r.id)}</Typography>,
    },
    {
      key: 'nombre',
      header: 'Nombre',
      sortable: true,
      accessor: (r) => <Typography variant="subtitle1">{r.nombre}</Typography>,
    },
    {
      key: 'categoria',
      header: 'Categoría',
      accessor: (r) => <Typography variant="body2">{nombreCategoria(r.idCategoria)}</Typography>,
    },
    {
      key: 'unidad',
      header: 'Unidad',
      align: 'center',
      accessor: (r) => <Typography variant="body2">{unidadAbrev(r.idUnidadMedida)}</Typography>,
    },
    {
      key: 'stockActual',
      header: 'Stock act.',
      align: 'right',
      sortable: true,
      accessor: (r) => <Typography variant="subtitle1">{r.stockActual}</Typography>,
    },
    {
      key: 'stockMinimo',
      header: 'Stock mín.',
      align: 'right',
      accessor: (r) => <Typography variant="body2">{r.stockMinimo}</Typography>,
    },
    {
      key: 'costoPromedio',
      header: 'Costo prom.',
      align: 'right',
      accessor: (r) => <Typography variant="body2">{formatoMoneda(r.costoPromedio)}</Typography>,
    },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (r) => (
        <EstadoSwitch
          activo={r.estado}
          stockBajo={getEstadoVisual(r) === 'Stock Bajo'}
          nombre={r.nombre}
          onChange={() => onCambiarEstado(r)}
        />
      ),
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
      emptyMessage="Sin insumos encontrados"
    />
  )
}
