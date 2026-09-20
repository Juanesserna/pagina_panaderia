import { Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Box } from '@mui/material'

/**
 * Tabla genérica dirigida por columnas.
 * columns: [{ key, header, accessor: (row) => ReactNode, align?: 'left' | 'right', sortable?: boolean }]
 * data: array de filas
 * keyExtractor: (row) => string/número único por fila
 * sortKey, sortDir, onSort: opcionales — solo se usan si alguna columna trae sortable: true
 */
export function DataTable({ columns, data, keyExtractor, emptyMessage = 'Sin resultados', sortKey, sortDir, onSort }) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 640 }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                align={col.align || 'left'}
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  px: 2.5,
                  py: 1.5,
                }}
              >
                {col.sortable ? (
                  <TableSortLabel
                    active={sortKey === col.key}
                    direction={sortKey === col.key ? sortDir : 'asc'}
                    onClick={() => onSort?.(col.key)}
                  >
                    {col.header}
                  </TableSortLabel>
                ) : (
                  col.header
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 5, color: 'text.dim', border: 'none' }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={keyExtractor(row)} sx={{ '&:hover': { bgcolor: 'background.alt' } }}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.align || 'left'}
                    sx={{ fontSize: 14, borderBottom: '1px solid', borderColor: 'divider', px: 2.5, py: 1.5 }}
                  >
                    {col.accessor(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  )
}