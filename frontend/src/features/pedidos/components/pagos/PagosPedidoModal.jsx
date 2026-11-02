import { Box, Stack, Typography } from '@mui/material'
import { Button, Modal } from '@shared/ui'
import { obtenerNombreCliente } from '../../utils/pedidosHelpers'
import FilterLabel from '../FilterLabel'
import PagoSlotPedido from './PagoSlotPedido'

export default function PagosPedidoModal({ pagos }) {
  const {
    abierto,
    pedido,
    cerrar,
    inputRef,
    handleImagenSeleccionada,
    solicitarComprobante,
    comprobanteDeSlot,
    cantidadPagos,
    slots,
    montoPorPago,
    totalPedido,
    totalPagado,
    diferenciaPorPagar,
  } = pagos

  return (
    <Modal open={abierto} onClose={cerrar} title="Comprobantes y abonos del pedido" size="md" showDivider>
      {pedido && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleImagenSeleccionada} />

          <Typography variant="body2">
            Pedido <b>{pedido.id}</b> · {obtenerNombreCliente(pedido)}
          </Typography>

          {/* Tarea 5: Resumen financiero dinámico */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              p: 1.75,
              bgcolor: 'background.alt',
            }}
          >
            <Box>
              <FilterLabel>Total pedido</FilterLabel>
              <Typography variant="subtitle1">${totalPedido.toFixed(2)}</Typography>
            </Box>
            <Box>
              <FilterLabel>Total pagado</FilterLabel>
              <Typography variant="subtitle1" sx={{ color: totalPagado > 0 ? 'success.main' : 'text.primary' }}>
                ${totalPagado.toFixed(2)}
              </Typography>
            </Box>
            <Box>
              <FilterLabel>Diferencia por pagar</FilterLabel>
              <Typography
                variant="subtitle1"
                sx={{ color: diferenciaPorPagar <= 0 ? 'success.main' : 'warning.main' }}
              >
                ${diferenciaPorPagar.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <FilterLabel>Comprobantes de pago</FilterLabel>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: cantidadPagos === 2 ? '1fr 1fr' : '1fr' },
              gap: 2,
            }}
          >
            {slots.map((slot) => (
              <PagoSlotPedido
                key={slot}
                slot={slot}
                cantidadPagos={cantidadPagos}
                montoPorPago={montoPorPago}
                abono={comprobanteDeSlot(slot)}
                onSubir={solicitarComprobante}
              />
            ))}
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
            <Button variant="secondary" size="sm" onClick={cerrar}>
              Cerrar
            </Button>
          </Stack>
        </Box>
      )}
    </Modal>
  )
}

