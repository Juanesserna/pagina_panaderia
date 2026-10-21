import { Box, Stack, Typography } from '@mui/material'
import { Button, Modal } from '@shared/ui'
import { obtenerNombreCliente } from '../../utils/ventasHelpers'
import FilterLabel from '../FilterLabel'
import PagoSlot from './PagoSlot'

// Encargo: 2 comprobantes de 50% · página/presencial: 1 comprobante de 100%.
// `pagos` es lo que devuelve useAbonos().
export default function PagosModal({ pagos }) {
  const {
    abierto, venta, cerrar, inputRef, handleImagenSeleccionada, solicitarComprobante, comprobanteDeSlot,
    cantidadPagos, slots, montoPorPago, totalAbonado, saldoPendiente,
  } = pagos

  return (
    <Modal open={abierto} onClose={cerrar} title="Pagos de la venta" size="md" showDivider>
      {venta && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleImagenSeleccionada} />

          <Typography variant="body2">
            Venta <b>{venta.id}</b> · {obtenerNombreCliente(venta)}
          </Typography>

          {/* Resumen: total, pagado y saldo pendiente */}
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
              <FilterLabel>Total venta</FilterLabel>
              <Typography variant="subtitle1">${venta.total.toFixed(2)}</Typography>
            </Box>
            <Box>
              <FilterLabel>Pagado</FilterLabel>
              <Typography variant="subtitle1">${totalAbonado.toFixed(2)}</Typography>
            </Box>
            <Box>
              <FilterLabel>Saldo pendiente</FilterLabel>
              <Typography variant="subtitle1" sx={{ color: saldoPendiente <= 0 ? 'success.main' : 'text.primary' }}>
                ${saldoPendiente.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <FilterLabel>Comprobantes de pago</FilterLabel>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: cantidadPagos === 2 ? '1fr 1fr' : '1fr' }, gap: 2 }}>
            {slots.map((slot) => (
              <PagoSlot
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
