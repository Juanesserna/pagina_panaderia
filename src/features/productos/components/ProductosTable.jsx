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
  IconButton,
  useTheme,
} from '@mui/material'
import {
  IconChevronUp,
  IconChevronDown,
  IconEye,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { alpha } from '@mui/material/styles'
import { formatPrice } from '../services/productos.service'
import EstadoBadge from './EstadoBadge'

const HEADER_SX = {
  padding: '12px 16px',
  backgroundColor: 'transparent',
  borderBottom: 'none',
}

const CELL_SX = {
  padding: '12px 16px',
}

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
        sx={{
          fontFamily: fonts.sans,
          fontSize: 11,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: theme.palette.text.secondary,
        }}
      >
        {nombre}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <IconChevronUp size={12} color={colorUp} />
        <IconChevronDown size={12} color={colorDown} />
      </Box>
    </Box>
  )
}

function HeaderLabel({ children }) {
  const theme = useTheme()
  return (
    <Typography
      component="span"
      sx={{
        fontFamily: fonts.sans,
        fontSize: 11,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: theme.palette.text.secondary,
      }}
    >
      {children}
    </Typography>
  )
}

export default function ProductosTable({ productos, onEdit, onVer, onEliminar }) {
  const theme = useTheme()
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
          <TableRow
            key={p.id}
            sx={{
              backgroundColor: index % 2 === 1 ? alpha(theme.palette.text.primary, 0.03) : 'transparent',
              '&:hover': { bgcolor: theme.palette.action.hover },
            }}
          >
            <TableCell sx={CELL_SX}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: 13,
                  color: theme.palette.text.primary,
                }}
              >
                {p.codigo}
              </Typography>
            </TableCell>
            <TableCell sx={CELL_SX}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  component="img"
                  src={p.imagenUrl}
                  alt={p.nombre}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    objectFit: 'cover',
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: 13,
                    color: theme.palette.text.primary,
                  }}
                >
                  {p.nombre}
                </Typography>
              </Box>
            </TableCell>
            <TableCell sx={CELL_SX}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: 13,
                  color: theme.palette.text.primary,
                }}
              >
                {p.categoria}
              </Typography>
            </TableCell>
            <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                {formatPrice(p.precioVenta)}
              </Typography>
            </TableCell>
            <TableCell sx={CELL_SX}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: 13,
                  color: theme.palette.text.primary,
                }}
              >
                {p.stock}
              </Typography>
            </TableCell>
            <TableCell sx={CELL_SX}>
              <EstadoBadge estado={p.estado} />
            </TableCell>
            <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
                <IconButton
                  size="small"
                  onClick={() => onVer?.(p)}
                  sx={{
                    color: theme.palette.text.secondary,
                    width: 28,
                    height: 28,
                  }}
                >
                  <IconEye size={15} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onEdit?.(p)}
                  sx={{
                    color: theme.palette.text.secondary,
                    width: 28,
                    height: 28,
                  }}
                >
                  <IconPencil size={15} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onEliminar?.(p)}
                  sx={{
                    color: theme.palette.error.main,
                    width: 28,
                    height: 28,
                  }}
                >
                  <IconTrash size={15} />
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
