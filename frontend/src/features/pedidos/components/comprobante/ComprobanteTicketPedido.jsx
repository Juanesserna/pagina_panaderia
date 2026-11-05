import { forwardRef } from 'react'
import { Box, Typography } from '@mui/material'
import { StatusBadge } from '@shared/ui'
import { estadoVariant } from '../../constants/pedidos.constants'
import { cap, obtenerNombreCliente } from '../../utils/pedidosHelpers'

const filaEntre = { display: 'flex', justifyContent: 'space-between' }
const seccion = {
  display: 'flex',
  flexDirection: 'column',
  px: 2.5,
  py: 1.25,
  borderBottom: '1px dashed',
  borderColor: 'divider',
}

// El ticket visual idéntico al de Ventas. No muestra capturas subidas.
const ComprobanteTicketPedido = forwardRef(function ComprobanteTicketPedido({ pedido, productos = [] }, ref) {
  if (!pedido) return null

  const items = productos.length > 0 ? productos : (pedido.items || [])
  const totalArticulos = pedido.productos || items.reduce((s, i) => s + (i.cantidad || 0), 0)

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          px: 2.5,
          pt: 2,
          pb: 1.75,
          borderBottom: '1px dashed',
          borderColor: 'divider',
        }}
      >
        <Typography variant="mono" component="div">
          <b>PANADERÍA</b>
        </Typography>
        <Typography variant="mono" component="div" sx={{ color: 'text.secondary' }}>
          Comprobante de pedido
        </Typography>
        <Typography variant="mono" component="div" sx={{ mt: 1 }}>
          {pedido.id}
        </Typography>
      </Box>

      <Box sx={{ ...seccion, gap: 0.6 }}>
        <Box sx={filaEntre}>
          <span>Cliente</span>
          <b>{obtenerNombreCliente(pedido)}</b>
        </Box>
        <Box sx={filaEntre}>
          <span>Fecha</span>
          <span>{pedido.fecha} · {pedido.hora}</span>
        </Box>
        {pedido.nit && (
          <Box sx={filaEntre}>
            <span>NIT/Cédula</span>
            <span>{pedido.nit}</span>
          </Box>
        )}
        <Box sx={filaEntre}>
          <span>Pago</span>
          <span>{pedido.metodo ? cap(pedido.metodo) : '—'}</span>
        </Box>
        <Box sx={filaEntre}>
          <span>Canal</span>
          <span>{pedido.canal ? cap(pedido.canal) : 'Encargo'}</span>
        </Box>
      </Box>

      <Box sx={{ ...seccion, gap: 0.75 }}>
        {items.map((p, idx) => (
          <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
            <span>{p.cantidad}x</span>
            <span style={{ flex: 1 }}>{p.nombre}</span>
            <span>${((p.precio || 0) * (p.cantidad || 1)).toFixed(2)}</span>
          </Box>
        ))}
      </Box>

      <Box sx={{ ...seccion, gap: 0.75 }}>
        <Box sx={{ ...filaEntre, color: 'text.secondary' }}>
          <span>Artículos</span>
          <span>{totalArticulos}</span>
        </Box>
        <Box sx={{ ...filaEntre, alignItems: 'baseline', pt: 0.75 }}>
          <Typography variant="mono" component="div">
            <b>TOTAL</b>
          </Typography>
          <Typography variant="h6" component="div">
            ${Number(pedido.total || 0).toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, px: 2.5, py: 1.75 }}>
        <StatusBadge variant={estadoVariant[pedido.estado]} dot>
          {cap(pedido.estado)}
        </StatusBadge>
        <Typography variant="caption" sx={{ color: 'text.dim' }}>
          ¡Gracias por su compra!
        </Typography>
      </Box>
    </Box>
  )
})

export default ComprobanteTicketPedido

