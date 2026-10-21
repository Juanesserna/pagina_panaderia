import { forwardRef } from 'react'
import { Box, Typography } from '@mui/material'
import { StatusBadge } from '@shared/ui'
import { estadoVariant } from '../../constants/ventas.constants'
import { cap, obtenerNombreCliente } from '../../utils/ventasHelpers'

const filaEntre = { display: 'flex', justifyContent: 'space-between' }
const seccion = { display: 'flex', flexDirection: 'column', px: 2.5, py: 1.25, borderBottom: '1px dashed', borderColor: 'divider' }

// El "ticket" visual. Recibe ref porque se imprime tomando su outerHTML.
const ComprobanteTicket = forwardRef(function ComprobanteTicket({ venta, productos }, ref) {
  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        maxWidth: 340,
        typography: 'mono',
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, px: 2.5, pt: 2, pb: 1.75, borderBottom: '1px dashed', borderColor: 'divider' }}>
        <Typography variant="mono" component="div">
          <b>PANADERÍA</b>
        </Typography>
        <Typography variant="mono" component="div" sx={{ color: 'text.secondary' }}>
          Comprobante de venta
        </Typography>
        <Typography variant="mono" component="div" sx={{ mt: 1 }}>
          {venta.id}
        </Typography>
      </Box>

      <Box sx={{ ...seccion, gap: 0.6 }}>
        <Box sx={filaEntre}><span>Cliente</span><b>{obtenerNombreCliente(venta)}</b></Box>
        <Box sx={filaEntre}><span>Fecha</span><span>{venta.fecha} · {venta.hora}</span></Box>
        {venta.nit && <Box sx={filaEntre}><span>NIT/Cédula</span><span>{venta.nit}</span></Box>}
        <Box sx={filaEntre}><span>Pago</span><span>{venta.metodo ? cap(venta.metodo) : '—'}</span></Box>
      </Box>

      <Box sx={{ ...seccion, gap: 0.75 }}>
        {productos.map((p, idx) => (
          <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
            <span>{p.cantidad}x</span>
            <span style={{ flex: 1 }}>{p.nombre}</span>
            <span>${(p.precio * p.cantidad).toFixed(2)}</span>
          </Box>
        ))}
      </Box>

      <Box sx={{ ...seccion, gap: 0.75 }}>
        <Box sx={{ ...filaEntre, color: 'text.secondary' }}>
          <span>Artículos</span><span>{venta.productos}</span>
        </Box>
        <Box sx={{ ...filaEntre, alignItems: 'baseline', pt: 0.75 }}>
          <Typography variant="mono" component="div">
            <b>TOTAL</b>
          </Typography>
          <Typography variant="h6" component="div">
            ${venta.total.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, px: 2.5, py: 1.75 }}>
        <StatusBadge variant={estadoVariant[venta.estado]} dot>
          {cap(venta.estado)}
        </StatusBadge>
        <Typography variant="caption" sx={{ color: 'text.dim' }}>¡Gracias por su compra!</Typography>
      </Box>
    </Box>
  )
})

export default ComprobanteTicket
