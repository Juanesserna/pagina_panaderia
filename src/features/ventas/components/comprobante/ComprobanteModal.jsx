import { useRef } from 'react'
import { Box, Stack } from '@mui/material'
import { IconDownload } from '@tabler/icons-react'
import { Button, Modal } from '@shared/ui'
import { imprimirComprobante } from '../../utils/imprimirComprobante'
import ComprobanteTicket from './ComprobanteTicket'

export default function ComprobanteModal({ abierto, venta, productos, onCerrar }) {
  const ticketRef = useRef(null)

  return (
    <Modal open={abierto} onClose={onCerrar} title="Comprobante de venta" size="md" showDivider>
      {venta && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
          <ComprobanteTicket ref={ticketRef} venta={venta} productos={productos} />

          <Box sx={{ width: '100%', maxWidth: 340, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconDownload size={12} />}
              onClick={() => imprimirComprobante(ticketRef.current, venta.id)}
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
