import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Button } from '@shared/ui'
import HeaderLabel from './comunes/HeaderLabel'
import { HEADER_SX, EMPTY_STATE_SX } from './comunes/tablaEstilos'
import FilaCategoria from './FilaCategoria'

const COLUMNAS = [
  { titulo: 'CÓDIGO', ancho: 90 },
  { titulo: 'IMAGEN', ancho: 100 },
  { titulo: 'CATEGORÍA', ancho: 280 },
  { titulo: 'TIPO', ancho: 200 },
  { titulo: 'ESTADO', ancho: 120 },
]

export default function CategoriasTable({
  categorias,
  totalCategorias,
  onCambiarEstado,
  onEditar,
  onEliminar,
  onCrear,
  onLimpiarFiltros,
}) {
  const hayCategorias = totalCategorias > 0
  const estaVacio = categorias.length === 0

  return (
    <TableContainer sx={{ width: '100%' }}>
      <Table size="small" sx={{ width: '100%', borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            {COLUMNAS.map((columna) => (
              <TableCell key={columna.titulo} sx={HEADER_SX} style={{ width: columna.ancho }}>
                <HeaderLabel>{columna.titulo}</HeaderLabel>
              </TableCell>
            ))}
            <TableCell sx={{ ...HEADER_SX, textAlign: 'right' }} style={{ width: 140 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {estaVacio && !hayCategorias ? (
            <TableRow>
              <TableCell colSpan={6} sx={EMPTY_STATE_SX}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  Aún no hay categorías
                </Typography>
                <Button size="small" variant="primary" onClick={onCrear}>
                  Crear categoría
                </Button>
              </TableCell>
            </TableRow>
          ) : estaVacio ? (
            <TableRow>
              <TableCell colSpan={6} sx={EMPTY_STATE_SX}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  No se encontraron categorías
                </Typography>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={onLimpiarFiltros}
                >
                  Limpiar filtros
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            categorias.map((categoria, index) => (
              <FilaCategoria
                key={categoria.id}
                categoria={categoria}
                index={index}
                onCambiarEstado={onCambiarEstado}
                onEditar={onEditar}
                onEliminar={onEliminar}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
