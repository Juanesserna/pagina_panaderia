import { Box, Stack, Typography } from '@mui/material'
import { IconUpload } from '@tabler/icons-react'
import { Button, ImageWithFallback } from '@shared/ui'

export default function PagoSlotPedido({ slot, cantidadPagos, montoPorPago, abono, onSubir }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        minWidth: 0,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 1.75,
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">
          Abono {slot} ({Math.round(100 / cantidadPagos)}%)
        </Typography>
        <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 700 }}>
          ${montoPorPago.toFixed(2)}
        </Typography>
      </Stack>

      {abono ? (
        <>
          <Box
            onClick={() => window.open(abono.urlComprobante, '_blank')}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <ImageWithFallback
              src={abono.urlComprobante}
              alt={`Comprobante del abono ${slot}`}
              style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
            />
          </Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {abono.fecha}
            </Typography>
            <Button variant="ghost" size="sm" leftIcon={<IconUpload size={12} />} onClick={() => onSubir(slot)}>
              Reemplazar comprobante
            </Button>
          </Stack>
        </>
      ) : (
        <Button variant="secondary" fullWidth leftIcon={<IconUpload size={16} />} onClick={() => onSubir(slot)}>
          Cargar comprobante
        </Button>
      )}
    </Box>
  )
}

