import { Box, Stack, Typography, Divider, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import { Button, Modal, StatusBadge } from '@shared/ui'
import { estadoVariant } from '../../constants/pedidos.constants'
import { cap, obtenerNombreCliente } from '../../utils/pedidosHelpers'
import FilterLabel from '../FilterLabel'

export default function DetallePedidoModal({ abierto, pedido, resumen, onCerrar, onAbrirPagos }) {
  if (!pedido) return null

  const items = pedido.items || []

  return (
    <Modal open={abierto} onClose={onCerrar} title={`Comprobante del pedido ${pedido.id}`} size="md" showDivider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Encabezado con información del cliente y estado */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.alt',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <FilterLabel>Cliente</FilterLabel>
            <Typography variant="subtitle2">{obtenerNombreCliente(pedido)}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              NIT / Cédula: {pedido.nit || 'No especificado'}
            </Typography>
          </Box>

          <Box>
            <FilterLabel>Estado y Fecha</FilterLabel>
            <Stack direction="row" spacing={1} alignItems="center">
              <StatusBadge variant={estadoVariant[pedido.estado]} dot>
                {cap(pedido.estado)}
              </StatusBadge>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {pedido.fecha} {pedido.hora}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
              Canal: {cap(pedido.canal || 'encargo')} · Método: {cap(pedido.metodo || 'transferencia')}
            </Typography>
          </Box>
        </Box>

        {/* Tarea 5: Resumen financiero dinámico del pedido */}
        <Box>
          <FilterLabel>Resumen financiero</FilterLabel>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              p: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Total del pedido
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ${resumen.totalPedido.toFixed(2)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Total pagado
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: resumen.totalPagado > 0 ? 'success.main' : 'text.primary',
                }}
              >
                ${resumen.totalPagado.toFixed(2)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Diferencia por pagar
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: resumen.diferenciaPorPagar <= 0 ? 'success.main' : 'warning.main',
                }}
              >
                ${resumen.diferenciaPorPagar.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Listado detallado de productos */}
        <Box>
          <FilterLabel>Productos solicitados</FilterLabel>
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell><Typography variant="caption" sx={{ fontWeight: 600 }}>Producto</Typography></TableCell>
                  <TableCell align="center"><Typography variant="caption" sx={{ fontWeight: 600 }}>Cant.</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption" sx={{ fontWeight: 600 }}>P. Unit.</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption" sx={{ fontWeight: 600 }}>Subtotal</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length > 0 ? (
                  items.map((it, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell><Typography variant="body2">{it.nombre}</Typography></TableCell>
                      <TableCell align="center"><Typography variant="body2">{it.cantidad}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="body2">${Number(it.precio || 0).toFixed(2)}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="subtitle2">${(it.cantidad * (it.precio || 0)).toFixed(2)}</Typography></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="caption" sx={{ color: 'text.secondary', py: 2, display: 'block' }}>
                        Sin productos desglosados en el registro
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>

        {/* Tarea 1: Comprobantes asociados */}
        {pedido.abonos && pedido.abonos.length > 0 && (
          <Box>
            <FilterLabel>Comprobantes de pago cargados ({pedido.abonos.length})</FilterLabel>
            <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', py: 1 }}>
              {pedido.abonos.map((a, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    minWidth: 200,
                    bgcolor: 'background.alt',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                    Abono #{a.slot} · ${Number(a.monto || 0).toFixed(2)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                    {a.fecha}
                  </Typography>
                  {a.urlComprobante && (
                    <Box
                      component="img"
                      src={a.urlComprobante}
                      alt="Comprobante"
                      sx={{
                        width: '100%',
                        height: 90,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {pedido.notas && (
          <Box>
            <FilterLabel>Notas del pedido</FilterLabel>
            <Typography variant="body2" sx={{ fontStyle: 'italic', bgcolor: 'background.alt', p: 1.5, borderRadius: 1.5 }}>
              "{pedido.notas}"
            </Typography>
          </Box>
        )}

        <Divider />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onCerrar()
              onAbrirPagos(pedido)
            }}
          >
            Gestionar abonos / comprobantes
          </Button>
          <Button variant="primary" size="sm" onClick={onCerrar}>
            Cerrar
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

