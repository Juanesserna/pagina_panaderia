import { Box, Divider, Typography } from '@mui/material'
import { NotificacionesContainer, useNotificaciones } from '@shared/notifications'
import { useAbonos } from '../hooks/useAbonos'
import { useCambiarEstado } from '../hooks/useCambiarEstado'
import { useComprobante } from '../hooks/useComprobante'
import { useNuevaVenta } from '../hooks/useNuevaVenta'
import { useVentas } from '../hooks/useVentas'
import { useVentasFiltros } from '../hooks/useVentasFiltros'
import CambiarEstadoModal from '../components/estado/CambiarEstadoModal'
import ComprobanteModal from '../components/comprobante/ComprobanteModal'
import NuevaVentaModal from '../components/nueva-venta/NuevaVentaModal'
import PagosModal from '../components/pagos/PagosModal'
import VentasFiltros from '../components/VentasFiltros'
import VentasKPIs from '../components/VentasKPIs'
import VentasTable from '../components/VentasTable'
import VentasToolbar from '../components/VentasToolbar'

// La página solo compone: hooks (estado y lógica) + componentes (UI).
export default function VentasPage() {
  const { notificaciones, mostrarNotificacion } = useNotificaciones()
  const { ventas, cambiarEstado, marcarPagoParcial, agregarVenta } = useVentas()

  const listado = useVentasFiltros(ventas)
  const estadoModal = useCambiarEstado(cambiarEstado)
  const comprobante = useComprobante(ventas)
  const pagos = useAbonos({ onPagoParcial: marcarPagoParcial })
  const nuevaVenta = useNuevaVenta({ ventas, onVentaCreada: agregarVenta, mostrarNotificacion })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <NotificacionesContainer notificaciones={notificaciones} />

      <VentasKPIs ventas={ventas} />

      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <VentasToolbar
          search={listado.search}
          onSearchChange={listado.setSearch}
          onNuevaVenta={nuevaVenta.abrir}
          filtrosActivos={listado.filtrosActivos}
          cantidadFiltrosActivos={listado.cantidadFiltrosActivos}
          onToggleFiltros={listado.toggleFiltros}
        />

        <Divider />

        <VentasFiltros
          abierto={listado.mostrarFiltros}
          filtros={listado.filtros}
          onChange={listado.setFiltro}
          onLimpiar={listado.limpiarFiltros}
          hayFiltrosActivos={listado.filtrosActivos}
        />

        <VentasTable
          ventas={listado.paginadas}
          total={listado.total}
          page={listado.page}
          onPageChange={listado.setPage}
          sortKey={listado.sortKey}
          sortDir={listado.sortDir}
          onSort={listado.handleSort}
          onCambiarEstado={estadoModal.abrir}
          onPagos={pagos.abrir}
          onVerComprobante={comprobante.abrir}
        />
      </Box>

      <CambiarEstadoModal
        abierto={estadoModal.abierto}
        venta={estadoModal.venta}
        estadoSeleccionado={estadoModal.estadoSeleccionado}
        onSeleccionar={estadoModal.setEstadoSeleccionado}
        onCerrar={estadoModal.cerrar}
        onConfirmar={estadoModal.confirmar}
      />
      <ComprobanteModal abierto={comprobante.abierto} venta={comprobante.venta} productos={comprobante.productos} onCerrar={comprobante.cerrar} />
      <PagosModal pagos={pagos} />
      <NuevaVentaModal nuevaVenta={nuevaVenta} />
    </Box>
  )
}
