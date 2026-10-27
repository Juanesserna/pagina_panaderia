import { Box, Divider, Stack } from '@mui/material'
import { IconInfoCircle, IconPackage } from '@tabler/icons-react'
// Modal y pastilla de estado estándar del panel
import { Modal, StatusBadge } from '@shared/ui'
// Opciones compartidas de productos
import { varianteEstadoProducto } from './comunes/opcionesProducto'
import CampoDetalle from './detalle/CampoDetalle'
import TarjetaDetalle from './detalle/TarjetaDetalle'
import HistorialProducto from './detalle/HistorialProducto'
import RecetaColapsable from './detalle/RecetaColapsable'
import { gridCamposSx } from './detalle/estilos'
import { insumosEjemplo, historialEjemplo } from './detalle/datosEjemplo'
import { formatPrice } from '../services/productos.service'

export default function DetalleProductoModal({ open, onClose, producto }) {
  if (!open || !producto) return null

  const precioVenta = Number(producto?.precioVenta)
  const precioVentaTexto = Number.isFinite(precioVenta) ? formatPrice(precioVenta) : '—'
  const stock = producto?.stock ?? 0
  const stockMinimo = producto?.stockMinimo ?? Math.max(5, Math.round(stock * 0.25))
  const cantMinimaProduccion = producto?.cantMinimaProduccion ?? 1
  const cantMaximaProduccion = producto?.cantMaximaProduccion ?? 100
  const unidad = producto?.unidad ?? 'uds.'
  const codigoProducto = producto?.codigo ?? '—'
  const estado = producto?.estado ?? 'Activo'

  const insumos = Array.isArray(producto?.insumos) ? producto.insumos : insumosEjemplo(codigoProducto)
  const historial = Array.isArray(producto?.historial) ? producto.historial : historialEjemplo(producto?.estado)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={producto?.nombre ?? 'Detalle de Producto'}
      size="lg"
      showDivider
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'flex-start',
          gap: 3,
        }}
      >
        <Box sx={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TarjetaDetalle titulo="Información General" icono={<IconInfoCircle size={16} />}>
            <Box sx={gridCamposSx}>
              <CampoDetalle etiqueta="Código" valor={codigoProducto} />
              <CampoDetalle etiqueta="Nombre empresa" valor={producto?.nombre ?? '—'} destacado />
              <CampoDetalle etiqueta="Categoría" valor={producto?.categoria ?? '—'} />
              <CampoDetalle etiqueta="Precio venta" valor={precioVentaTexto} />
            </Box>
          </TarjetaDetalle>

          <TarjetaDetalle titulo="Información de Stock" icono={<IconPackage size={16} />}>
            <Box sx={gridCamposSx}>
              <CampoDetalle etiqueta="Stock actual" valor={`${stock} ${unidad}`} />
              <CampoDetalle etiqueta="Stock mínimo" valor={`${stockMinimo} ${unidad}`} />
              <CampoDetalle etiqueta="Cant. mínima producción" valor={cantMinimaProduccion} />
              <CampoDetalle etiqueta="Cant. máxima producción" valor={cantMaximaProduccion} />
            </Box>
          </TarjetaDetalle>

          <RecetaColapsable insumos={insumos} />
        </Box>

        <Box
          sx={{
            flex: '0 0 320px',
            width: '100%',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <TarjetaDetalle titulo="Estado" espacio={2}>
            <Box>
              <StatusBadge variant={varianteEstadoProducto(estado)} dot size="md">{estado}</StatusBadge>
            </Box>
            <Divider sx={{ my: 2.5 }} />
            <Stack spacing={2}>
              <CampoDetalle variante="panel" etiqueta="Código" valor={codigoProducto} />
              <CampoDetalle variante="panel" etiqueta="Categoría" valor={producto?.categoria ?? '—'} />
              <CampoDetalle variante="panel" etiqueta="Stock" valor={`${stock} ${unidad}`} />
            </Stack>
          </TarjetaDetalle>

          <HistorialProducto eventos={historial} />
        </Box>
      </Box>
    </Modal>
  )
}