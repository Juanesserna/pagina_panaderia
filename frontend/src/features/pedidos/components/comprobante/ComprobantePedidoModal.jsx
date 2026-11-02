import { useRef } from 'react'
import { Box, Stack } from '@mui/material'
import { IconDownload } from '@tabler/icons-react'
import { Button, Modal } from '@shared/ui'
import { imprimirComprobante } from '@features/ventas/utils/imprimirComprobante'
import ComprobanteTicketPedido from './ComprobanteTicketPedido'

export default function ComprobantePedidoModal({ abierto, pedido, onCerrar }) {
  const ticketRef = useRef(null)

  return (
    <Modal open={abierto} onClose={onCerrar} title="Comprobante de pedido" size="md" showDivider>
      {pedido && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
          <ComprobanteTicketPedido ref={ticketRef} pedido={pedido} productos={pedido.items || []} />

          <Box sx={{ width: '100%', maxWidth: 340, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconDownload size={12} />}
              onClick={() => imprimirComprobante(ticketRef.current, pedido.id)}
            >
              Descargar comprobante
            </Button>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ width: '100%' }}>
            <Button variant="secondary" size="sm" onClick={onCerrar}>
              Cerrar
            </Button>
          </Stack>
        </Box>
      )}
    </Modal>
  )
}

