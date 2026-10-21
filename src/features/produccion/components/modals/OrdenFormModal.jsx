import { Box, Stack, Divider } from '@mui/material'
import { Button, Modal } from '@shared/ui'
import { cap, estadoEfectivo } from '@features/produccion/utils/produccionHelpers'
import CampoEstatico from '@features/produccion/components/common/CampoEstatico'
import CatalogoProductos from '@features/produccion/components/orden-form/CatalogoProductos'
import ResumenOrden from '@features/produccion/components/orden-form/ResumenOrden'

// Modal Nueva orden / Editar (master-detail).
// `form` es el objeto que devuelve useOrdenForm; `usuario` es el operador autenticado.
export default function OrdenFormModal({ form, usuario, onConfirmar }) {
  const { open, mode, editingId, editingOrden } = form
  const estadoEditandoLabel = editingOrden ? cap(estadoEfectivo(editingOrden)) : ''

  return (
    <Modal
      open={open}
      onClose={form.cerrar}
      title={mode === 'nueva' ? 'Nueva orden' : `Editar orden ${editingId}`}
      size="lg"
      showDivider
      sx={{ width: '100%', maxWidth: 1100, minHeight: 600 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: '20px' }}>
        {/* Parte superior: ID, fechas, estado, generado por y NIT/Cédula */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(auto-fit, minmax(150px, 1fr))' },
            gap: 2,
            alignItems: 'end',
          }}
        >
          {mode === 'nueva' && (
            <>
              <CampoEstatico label="ID de orden" value={form.formId} />
              <CampoEstatico label="Fecha solicitud" value={form.fechaSolicitud} />
              <CampoEstatico label="Fecha fabricación" value="Por definir" />
              <CampoEstatico label="Estado" value="Pendiente" />
              <CampoEstatico label="NIT/Cédula" value={usuario.nit} />
              <CampoEstatico label="Generado por" value={usuario.nombre} />
            </>
          )}

          {mode === 'editar' && editingOrden && (
            <>
              <CampoEstatico label="ID de orden" value={editingOrden.id} />
              <CampoEstatico label="Fecha solicitud" value={editingOrden.fechaSolicitud} />
              <CampoEstatico label="Fecha fabricación" value={editingOrden.fechaFabricacion || 'Por definir'} />
              <CampoEstatico label="Estado" value={estadoEditandoLabel} />
              <CampoEstatico label="NIT/Cédula" value={editingOrden.generadoPor.documento} />
              <CampoEstatico
                label={editingOrden.producto === 'Pagina' ? 'Solicitado por' : 'Generado por'}
                value={editingOrden.generadoPor.nombre}
              />
              {editingOrden.producto === 'Pagina' && editingOrden.ventaId && (
                <CampoEstatico label="Venta relacionada" value={editingOrden.ventaId} />
              )}
            </>
          )}
        </Box>

        <Divider />

        {/* Master-detail: catálogo (izquierda) + resumen (derecha) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.15fr 1fr' }, gap: 2.5, alignItems: 'stretch' }}>
          <CatalogoProductos
            productos={form.productosFiltrados}
            busqueda={form.busqueda}
            onBusquedaChange={form.setBusqueda}
            onAgregar={form.agregarProducto}
            onAgregarPrimero={form.agregarPrimerCoincidente}
          />
          <ResumenOrden
            items={form.items}
            onQuitar={form.quitarProducto}
            onActualizarCantidad={form.actualizarCantidad}
            onConfirmar={onConfirmar}
          />
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="secondary" size="sm" onClick={form.cerrar}>
            Cancelar
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
