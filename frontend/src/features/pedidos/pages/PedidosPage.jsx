import { Box, Divider } from '@mui/material'
import { NotificacionesContainer, useNotificaciones } from '@shared/notifications'
import { usePedidos } from '../hooks/usePedidos'
import { usePedidosFiltros } from '../hooks/usePedidosFiltros'
import { useCambiarEstadoPedido } from '../hooks/useCambiarEstadoPedido'
import { useAbonosPedido } from '../hooks/useAbonosPedido'
import { useDetallePedido } from '../hooks/useDetallePedido'
import { useNuevoPedido } from '../hooks/useNuevoPedido'

import PedidosKPIs from '../components/PedidosKPIs'
import PedidosToolbar from '../components/PedidosToolbar'
import PedidosFiltros from '../components/PedidosFiltros'
import PedidosTable from '../components/PedidosTable'
import CambiarEstadoPedidoModal from '../components/estado/CambiarEstadoPedidoModal'
import ComprobantePedidoModal from '../components/comprobante/ComprobantePedidoModal'
import PagosPedidoModal from '../components/pagos/PagosPedidoModal'
import NuevoPedidoModal from '../components/nuevo-pedido/NuevoPedidoModal'

export default function PedidosPage() {
  const { notificaciones, mostrarNotificacion } = useNotificaciones()
  const { pedidos, cambiarEstado, registrarAbono, agregarPedido } = usePedidos({ mostrarNotificacion })

  const listado = usePedidosFiltros(pedidos)
  const estadoModal = useCambiarEstadoPedido(cambiarEstado)
  const comprobante = useDetallePedido()
  const pagos = useAbonosPedido({ onRegistrarAbono: registrarAbono })
  const nuevoPedido = useNuevoPedido({
    pedidos,
    onPedidoCreado: agregarPedido,
    mostrarNotificacion,
  })

  const pedidoComprobanteActualizado = comprobante.pedido
    ? pedidos.find((p) => p.id === comprobante.pedido.id) || comprobante.pedido
    : null

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <NotificacionesContainer notificaciones={notificaciones} />

      <PedidosKPIs pedidos={pedidos} />

      <Box
        sx={{
          borderRadius: 2.5,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <PedidosToolbar
          search={listado.search}
          onSearchChange={listado.setSearch}
          onNuevoPedido={nuevoPedido.abrir}
          filtrosActivos={listado.filtrosActivos}
          cantidadFiltrosActivos={listado.cantidadFiltrosActivos}
          onToggleFiltros={listado.toggleFiltros}
        />

        <Divider />

        <PedidosFiltros
          abierto={listado.mostrarFiltros}
          filtros={listado.filtros}
          onChange={listado.setFiltro}
          onLimpiar={listado.limpiarFiltros}
          hayFiltrosActivos={listado.filtrosActivos}
        />

        <PedidosTable
          pedidos={listado.paginadas}
          total={listado.total}
          page={listado.page}
          onPageChange={listado.setPage}
          sortKey={listado.sortKey}
          sortDir={listado.sortDir}
          onSort={listado.handleSort}
          onCambiarEstado={estadoModal.abrir}
          onPagos={pagos.abrir}
          onVerDetalle={comprobante.abrir}
        />
      </Box>

      <CambiarEstadoPedidoModal
        abierto={estadoModal.abierto}
        pedido={estadoModal.pedido}
        estadoSeleccionado={estadoModal.estadoSeleccionado}
        onSeleccionar={estadoModal.setEstadoSeleccionado}
        pasoConfirmacion={estadoModal.pasoConfirmacion}
        onSolicitarConfirmacion={estadoModal.solicitarConfirmacion}
        onRegresarASeleccion={estadoModal.regresarASeleccion}
        motivo={estadoModal.motivo}
        onMotivoChange={estadoModal.setMotivo}
        procesando={estadoModal.procesando}
        onCerrar={estadoModal.cerrar}
        onConfirmar={estadoModal.confirmar}
      />

      <ComprobantePedidoModal
        abierto={comprobante.abierto}
        pedido={pedidoComprobanteActualizado}
        onCerrar={comprobante.cerrar}
      />

      <PagosPedidoModal pagos={pagos} />
      <NuevoPedidoModal nuevoPedido={nuevoPedido} />
    </Box>
  )
}
