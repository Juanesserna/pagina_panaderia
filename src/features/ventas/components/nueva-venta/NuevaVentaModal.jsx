import { Box, Divider, Stack } from '@mui/material'
import { Button, Modal } from '@shared/ui'
import CatalogoProductos from './CatalogoProductos'
import NuevaVentaEncabezado from './NuevaVentaEncabezado'
import ResumenVenta from './ResumenVenta'

// Modal master-detail: catálogo (izquierda) + resumen (derecha).
// `nuevaVenta` es lo que devuelve useNuevaVenta().
export default function NuevaVentaModal({ nuevaVenta: nv }) {
  return (
    <Modal
      open={nv.abierto}
      onClose={nv.cerrar}
      title="Nueva venta"
      size="lg"
      showDivider
      sx={{ width: '100%', maxWidth: 1100, minHeight: 600 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: '20px' }}>
        <NuevaVentaEncabezado
          id={nv.id}
          fecha={nv.fecha}
          hora={nv.hora}
          clientes={nv.clientes}
          cliente={nv.cliente}
          onClienteChange={nv.setCliente}
          onClienteInputChange={nv.onClienteInputChange}
          metodo={nv.metodo}
          onMetodoChange={nv.setMetodo}
          pagoDividido={nv.pagoDividido}
          onPagoDivididoChange={nv.setPagoDividido}
        />

        <Divider />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.15fr 1fr' }, gap: 2.5, alignItems: 'stretch' }}>
          <CatalogoProductos
            productos={nv.productosFiltrados}
            busqueda={nv.busqueda}
            onBusquedaChange={nv.onBusquedaChange}
            onAgregar={nv.agregarProducto}
            onAgregarPrimero={nv.agregarPrimeraCoincidencia}
          />
          <ResumenVenta
            items={nv.items}
            total={nv.total}
            puedeRegistrar={nv.puedeRegistrar}
            onCantidad={nv.actualizarCantidad}
            onQuitar={nv.quitarProducto}
            onRegistrar={nv.confirmar}
          />
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="secondary" size="sm" onClick={nv.cerrar}>
            Cancelar
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
