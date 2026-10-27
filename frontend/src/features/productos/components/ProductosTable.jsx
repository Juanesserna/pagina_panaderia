import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  useTheme,
} from '@mui/material'
import {
  IconChevronUp,
  IconChevronDown,
} from '@tabler/icons-react'
import { HEADER_SX } from './comunes/tablaEstilos'
import HeaderLabel from './comunes/HeaderLabel'
import FilaProducto from './FilaProducto'

function SortableHeader({ nombre, columna, sortConfig, onSort }) {
  const theme = useTheme()
  const isActive = sortConfig.column === columna
  const direction = sortConfig.direction

  const colorUp = isActive && direction === 'asc' ? theme.palette.primary.main : theme.palette.text.secondary
  const colorDown =
    isActive && direction === 'desc' ? theme.palette.primary.main : theme.palette.text.secondary

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.35,
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={() => onSort(columna)}
    >
      <Typography
        component="span"
        variant="overline"
        sx={{
          color: theme.palette.text.secondary,
        }}
      >
        {nombre}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <IconChevronUp size={12} color={colorUp} />
        <IconChevronDown size={12} color={colorDown} />
      </Box>
    </Box>
  )
}

export default function ProductosTable({ productos, onEdit, onVer, onEliminar, onCambiarEstado }) {
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' })

  const handleSort = (columna) => {
    setSortConfig((prev) => {
      if (prev.column === columna) {
        return {
          column: columna,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { column: columna, direction: 'asc' }
    })
  }

  const sortedProductos = [...productos].sort((a, b) => {
    if (!sortConfig.column) return 0
    const av = a[sortConfig.column]
    const bv = b[sortConfig.column]
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortConfig.direction === 'asc' ? av - bv : bv - av
    }
    const aStr = String(av).toLowerCase()
    const bStr = String(bv).toLowerCase()
    if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1
    if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  return (
    <TableContainer
      sx={{
        overflow: 'hidden',
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={HEADER_SX} style={{ width: 80 }}>
              <SortableHeader nombre="CÓDIGO" columna="codigo" sortConfig={sortConfig} onSort={handleSort} />
            </TableCell>
            <TableCell sx={HEADER_SX} style={{ width: 240 }}>
              <SortableHeader nombre="PRODUCTO" columna="nombre" sortConfig={sortConfig} onSort={handleSort} />
            </TableCell>
            <TableCell sx={HEADER_SX} style={{ width: 140 }}>
              <HeaderLabel>CATEGORÍA</HeaderLabel>
            </TableCell>
            <TableCell sx={{ ...HEADER_SX, textAlign: 'right' }} style={{ width: 120 }}>
              <SortableHeader nombre="PRECIO VENTA" columna="precioVenta" sortConfig={sortConfig} onSort={handleSort} />
            </TableCell>
            <TableCell sx={HEADER_SX} style={{ width: 80 }}>
              <SortableHeader nombre="STOCK" columna="stock" sortConfig={sortConfig} onSort={handleSort} />
            </TableCell>
            <TableCell sx={HEADER_SX} style={{ width: 100 }}>
              <HeaderLabel>ESTADO</HeaderLabel>
            </TableCell>
            <TableCell sx={{ ...HEADER_SX, textAlign: 'right' }} style={{ width: 100 }}>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedProductos.map((p, index) => (
            <FilaProducto key={p.id} producto={p} index={index} onVer={onVer} onEdit={onEdit} onEliminar={onEliminar} onCambiarEstado={onCambiarEstado} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}