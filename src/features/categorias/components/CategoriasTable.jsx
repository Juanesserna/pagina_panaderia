import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
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
  IconPower,
} from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { alpha } from '@mui/material/styles'
import { categorias as mockCategorias } from '../services/categorias.service'
import EstadoBadge from './EstadoBadge'
import TipoBadge from './TipoBadge'

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

export default function CategoriasTable({ categorias, onToggleEstado, onEditar, onEliminar }) {
  const theme = useTheme()
  const navigate = useNavigate()
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

  const sortedCategorias = [...categorias].sort((a, b) => {
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
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: theme.palette.divider,
        backgroundColor: 'background.paper',
        overflow: 'hidden',
        mt: 2,
      }}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={HEADER_SX} style={{ width: 280 }}>
                <SortableHeader nombre="CATEGORÍA" columna="nombre" sortConfig={sortConfig} onSort={handleSort} />
              </TableCell>
              <TableCell sx={HEADER_SX} style={{ width: 200 }}>
                <HeaderLabel>TIPO</HeaderLabel>
              </TableCell>
              <TableCell sx={HEADER_SX} style={{ width: 130 }}>
                <SortableHeader nombre="CREADA" columna="creada" sortConfig={sortConfig} onSort={handleSort} />
              </TableCell>
              <TableCell sx={HEADER_SX} style={{ width: 120 }}>
                <HeaderLabel>ESTADO</HeaderLabel>
              </TableCell>
              <TableCell sx={{ ...HEADER_SX, textAlign: 'right' }} style={{ width: 140 }}>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {sortedCategorias.map((c, index) => (
              <TableRow
                key={c.id}
                sx={{
                  backgroundColor: index % 2 === 1 ? alpha(theme.palette.text.primary, 0.03) : 'transparent',
                  '&:hover': { bgcolor: theme.palette.action.hover },
                }}
              >
                <TableCell sx={CELL_SX}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: c.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: 13,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {c.nombre}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={CELL_SX}>
                  <TipoBadge
                    tipo={c.tipo}
                    productosCount={c.productosCount}
                    insumosCount={c.insumosCount}
                  />
                </TableCell>
                <TableCell sx={CELL_SX}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: 13,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {c.creada}
                  </Typography>
                </TableCell>
                <TableCell sx={CELL_SX}>
                  <EstadoBadge estado={c.estado} />
                </TableCell>
                <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
                    <IconButton
                      size="small"
                      onClick={() => onToggleEstado(c.id)}
                      sx={{
                        color: c.estado === 'Activa' ? theme.palette.success.main : theme.palette.text.secondary,
                        width: 28,
                        height: 28,
                      }}
                      title={c.estado === 'Activa' ? 'Desactivar' : 'Activar'}
                    >
                      <IconPower size={15} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onEditar(c.id)}
                      sx={{
                        color: theme.palette.text.secondary,
                        width: 28,
                        height: 28,
                      }}
                      title="Editar"
                    >
                      <IconPencil size={15} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onEliminar(c.id)}
                      sx={{
                        color: theme.palette.error.main,
                        width: 28,
                        height: 28,
                      }}
                      title="Eliminar"
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
    </Card>
  )
}