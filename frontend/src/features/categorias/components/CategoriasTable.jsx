import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import HeaderLabel from './comunes/HeaderLabel'
import { HEADER_SX, EMPTY_STATE_SX } from './comunes/tablaEstilos'
import FilaCategoria from './FilaCategoria'

const COLUMNAS = [
  { titulo: 'CATEGORÍA', ancho: 280 },
  { titulo: 'TIPO', ancho: 200 },
  { titulo: 'CREADA', ancho: 130 },
  { titulo: 'ESTADO', ancho: 120 },
]

export default function CategoriasTable({ categorias, onCambiarEstado, onEditar, onEliminar }) {
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
          {categorias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={EMPTY_STATE_SX}>
                <Typography variant="body1" color="text.secondary">
                  No se encontraron categorías.
                </Typography>
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