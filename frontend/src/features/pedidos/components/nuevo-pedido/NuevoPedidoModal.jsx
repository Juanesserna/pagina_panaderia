import { Box, Divider, Stack } from '@mui/material'
import { Button, Modal } from '@shared/ui'
import CatalogoProductos from './CatalogoProductos'
import NuevoPedidoEncabezado from './NuevoPedidoEncabezado'
import ResumenPedido from './ResumenPedido'

// Modal master-detail: catálogo (izquierda) + resumen (derecha), idéntico al de Ventas.
// `nuevoPedido` es lo que devuelve useNuevoPedido().
export default function NuevoPedidoModal({ nuevoPedido: np }) {
  return (
    <Modal
      open={np.abierto}
      onClose={np.cerrar}
      title="Nuevo pedido"
      size="lg"
      showDivider
      sx={{ width: '100%', maxWidth: 1100, minHeight: 600 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: '20px' }}>
        <NuevoPedidoEncabezado
          id={np.id}
          fecha={np.fecha}
          hora={np.hora}
          clientes={np.clientes}
          cliente={np.cliente}
          onClienteChange={np.setCliente}
          onClienteInputChange={np.onClienteInputChange}
          canal={np.canal}
          onCanalChange={np.setCanal}
          metodo={np.metodo}
          onMetodoChange={np.setMetodo}
          pagoDividido={np.pagoDividido}
          onPagoDivididoChange={np.setPagoDividido}
        />

        <Divider />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.15fr 1fr' }, gap: 2.5, alignItems: 'stretch' }}>
          <CatalogoProductos
            productos={np.productosFiltrados}
            busqueda={np.busqueda}
            onBusquedaChange={np.onBusquedaChange}
            onAgregar={np.agregarProducto}
            onAgregarPrimero={np.agregarPrimeraCoincidencia}
          />
          <ResumenPedido
            items={np.items}
            total={np.total}
            puedeRegistrar={np.puedeRegistrar}
            onCantidad={np.actualizarCantidad}
            onQuitar={np.quitarProducto}
            onRegistrar={np.confirmar}
          />
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="secondary" size="sm" onClick={np.cerrar}>
            Cancelar
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
