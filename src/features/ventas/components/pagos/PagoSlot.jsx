import { Box, Stack, Typography } from '@mui/material'
import { IconUpload } from '@tabler/icons-react'
import { Button, ImageWithFallback } from '@shared/ui'

// Un comprobante de pago (porcentaje + monto) con su imagen o botón para subirla.
export default function PagoSlot({ slot, cantidadPagos, montoPorPago, abono, onSubir }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minWidth: 0,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        p: 1.25,
      }}
    >
      <Typography variant="body2">{100 / cantidadPagos}% · ${montoPorPago.toFixed(2)}</Typography>

      {abono ? (
        <>
          <Box
            onClick={() => window.open(abono.urlComprobante, '_blank')}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden', cursor: 'pointer' }}
          >
            <ImageWithFallback
              src={abono.urlComprobante}
              alt={`Comprobante del pago ${slot}`}
              style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }}
            />
          </Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ color: 'text.dim' }}>{abono.fecha}</Typography>
            <Button variant="ghost" size="sm" leftIcon={<IconUpload size={12} />} onClick={() => onSubir(slot)}>
              Reemplazar
            </Button>
          </Stack>
        </>
      ) : (
        <Button variant="secondary" fullWidth leftIcon={<IconUpload size={16} />} onClick={() => onSubir(slot)}>
          Subir comprobante
        </Button>
      )}
    </Box>
  )
}
