import {
  Box, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, IconButton, Tooltip, Skeleton,
} from '@mui/material'

import { Eye, Pencil } from 'lucide-react'
import UserAvatar from '@shared/components/UserAvatar'

const COLUMNAS = ['Cliente', 'Documento', 'Cuenta', 'Acciones']

const headCellSx = {
  typography: 'overline',
  color: 'text.secondary',
  whiteSpace: 'nowrap',
  py: 1,
}

// Filas de carga consistentes con la paginación.
function FilasCarga() {
  return Array.from({ length: 6 }, (_, i) => (
    <TableRow key={i}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Skeleton variant="circular" width={36} height={36} />

          <Box>
            <Skeleton width={130} />
            <Skeleton width={45} />
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Skeleton width={120} />
        <Skeleton width={85} />
      </TableCell>

      <TableCell>
        <Skeleton width={100} />
      </TableCell>

      <TableCell align="right">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Skeleton variant="rounded" width={26} height={26} />
          <Skeleton variant="rounded" width={26} height={26} />
        </Box>
      </TableCell>
    </TableRow>
  ))
}

// Acción reutilizable de la tabla.
function Accion({ icon: Icon, titulo, onClick }) {
  return (
    <Tooltip title={titulo}>
      <IconButton
        size="small"
        aria-label={titulo}
        onClick={onClick}
        sx={{
          color: 'text.secondary',
          '&:hover': { color: 'primary.main' },
        }}
      >
        <Icon size={18} />
      </IconButton>
    </Tooltip>
  )
}

export default function ClientesTable({
  clientes,
  loading,
  onVer,
  onEditar,
}) {
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Table
        size="small"
        sx={{
          '& .MuiTableBody-root .MuiTableCell-root': {
            py: 0.75,
            verticalAlign: 'middle',
          },
        }}
      >
        <TableHead>
          <TableRow>
            {COLUMNAS.map(columna => (
              <TableCell
                key={columna}
                sx={headCellSx}
                align={columna === 'Acciones' ? 'right' : 'left'}
              >
                {columna}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <FilasCarga />
          ) : clientes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMNAS.length}>
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron clientes.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            clientes.map(cliente => {
              const conCuenta = cliente.id_usuario != null

              return (
                <TableRow
                  key={cliente.id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      minWidth: 180,
                    }}>
                      <UserAvatar name={cliente.nombre} />

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {cliente.nombre}
                        </Typography>

                        <Typography variant="caption" component="div">
                          ID: {cliente.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.primary">
                      {cliente.tipoDocumento}
                    </Typography>

                    <Typography variant="caption" component="div">
                      {cliente.documento}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.8,
                      whiteSpace: 'nowrap',
                    }}>
                      <Box sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        bgcolor: conCuenta
                          ? 'success.main'
                          : 'text.disabled',
                      }} />

                      <Typography
                        variant="body2"
                        color={conCuenta ? 'success.main' : 'text.secondary'}
                      >
                        {conCuenta ? 'Cuenta vinculada' : 'Sin cuenta'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Accion
                      icon={Eye}
                      titulo="Ver detalle del cliente"
                      onClick={() => onVer(cliente)}
                    />

                    <Accion
                      icon={Pencil}
                      titulo="Editar cliente"
                      onClick={() => onEditar(cliente)}
                    />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </Box>
  )
}
