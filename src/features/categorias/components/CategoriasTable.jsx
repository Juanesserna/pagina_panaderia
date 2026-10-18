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
  IconPencil,
  IconTrash,
  IconPower,
} from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { alpha } from '@mui/material/styles'
import EstadoBadge from './EstadoBadge'
import TipoBadge from './TipoBadge'

const TABLE_BORDER_SX = {
  borderBottom: '1px solid',
  borderColor: 'divider',
}

const HEADER_SX = {
  padding: '12px 16px',
  backgroundColor: 'transparent',
  ...TABLE_BORDER_SX,
}

const CELL_SX = {
  padding: '12px 16px',
  ...TABLE_BORDER_SX,
}

const EMPTY_STATE_SX = {
  ...CELL_SX,
  py: 5,
  textAlign: 'center',
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

  return (
    <TableContainer sx={{ width: '100%' }}>
      <Table size="small" sx={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={HEADER_SX} style={{ width: 280 }}>
                <HeaderLabel>CATEGORÍA</HeaderLabel>
              </TableCell>
              <TableCell sx={HEADER_SX} style={{ width: 200 }}>
                <HeaderLabel>TIPO</HeaderLabel>
              </TableCell>
              <TableCell sx={HEADER_SX} style={{ width: 130 }}>
                <HeaderLabel>CREADA</HeaderLabel>
              </TableCell>
              <TableCell sx={HEADER_SX} style={{ width: 120 }}>
                <HeaderLabel>ESTADO</HeaderLabel>
              </TableCell>
              <TableCell sx={{ ...HEADER_SX, textAlign: 'right' }} style={{ width: 140 }}>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={EMPTY_STATE_SX}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: 13,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    No se encontraron categorías.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              categorias.map((c, index) => (
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
                      color: theme.palette.text.secondary,
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
                        color: theme.palette.text.secondary,
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
                        color: theme.palette.text.secondary,
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
            )))}
          </TableBody>
      </Table>
    </TableContainer>
  )
}