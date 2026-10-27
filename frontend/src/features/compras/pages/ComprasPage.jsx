import { useState } from 'react'
import { Box, Divider } from '@mui/material'
import { Pagination } from '@shared/ui'
import { PAGE_SIZE } from '../constants/compras.constants'
import { usuarioAutenticado } from '../mocks/comprasMockData'
import { useCompras } from '../hooks/useCompras'
import { useNotificaciones } from '../hooks/useNotificaciones'
import { CambiarEstadoModal } from '../components/CambiarEstadoModal'
import { CompraNotificaciones } from '../components/CompraNotificaciones'
import { ComprasKpis } from '../components/ComprasKpis'
import { ComprasTable } from '../components/ComprasTable'
import { ComprasToolbar } from '../components/ComprasToolbar'
import { DetalleCompraModal } from '../components/DetalleCompraModal'
import { EditarCompraModal } from '../components/EditarCompraModal'
import { EliminarCompraModal } from '../components/EliminarCompraModal'
import { FiltrosComprasPanel } from '../components/FiltrosComprasPanel'
import { NuevaCompraModal } from '../components/NuevaCompraModal'

// Pantalla de Compras: solo une las piezas. La lógica vive en hooks/, las reglas en utils/,
// los datos en services/ y cada bloque visual en components/.
export default function ComprasPage() {
  const c = useCompras()
  const { notificaciones, notificar } = useNotificaciones()

  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  // Un solo modal abierto a la vez: { tipo, id }. Al cerrar se conserva el id para que el contenido
  // no desaparezca durante la animación de cierre.
  const [modal, setModal] = useState({ tipo: null, id: null })
  const abrir = (tipo, compra) => setModal({ tipo, id: compra?.id ?? null })
  const cerrar = () => setModal((prev) => ({ ...prev, tipo: null }))
  const compraActiva = c.compras.find((x) => x.id === modal.id) ?? null

  // Ejecuta una operación, avisa el resultado y devuelve si salió bien
  const ejecutar = async (operacion, titulo, mensaje) => {
    try {
      await operacion()
      notificar('exito', titulo, mensaje)
      return true
    } catch (error) {
      notificar('error', 'No se pudo completar la acción', error.message)
      return false
    }
  }

  const crearCompra = async (datos) => {
    if (await ejecutar(() => c.crear(datos), 'Orden registrada', 'Nueva orden registrada con éxito')) cerrar()
  }

  const guardarEdicion = async (compra) => {
    if (await ejecutar(() => c.actualizar(compra), 'Orden actualizada', 'Cambios realizados con éxito')) cerrar()
  }

  const cambiarEstado = async (nuevoEstado) => {
    if (await ejecutar(() => c.cambiarEstado(modal.id, nuevoEstado), 'Estado actualizado', 'Cambios de estado realizados con éxito')) cerrar()
  }

  const eliminarCompra = async () => {
    if (await ejecutar(() => c.eliminar(modal.id), 'Orden eliminada', 'Compra eliminada de forma exitosa')) cerrar()
  }

  const mensajeVacio = c.cargando
    ? 'Cargando órdenes…'
    : c.errorCarga
      ? 'No se pudieron cargar las órdenes'
      : 'Sin órdenes encontradas'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <CompraNotificaciones notificaciones={notificaciones} />

      <ComprasKpis kpis={c.kpis} />

      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <ComprasToolbar
          busqueda={c.busqueda}
          onBusquedaChange={c.cambiarBusqueda}
          onNueva={() => abrir('nueva')}
          onToggleFiltros={() => setMostrarFiltros((v) => !v)}
          cantidadFiltros={c.cantidadFiltros}
        />

        <Divider />

        <FiltrosComprasPanel
          abierto={mostrarFiltros}
          filtros={c.filtros}
          proveedores={c.catalogos.proveedores}
          onChange={c.cambiarFiltro}
          onLimpiar={c.limpiarFiltros}
          hayFiltros={c.cantidadFiltros > 0}
        />

        <ComprasTable
          compras={c.paginadas}
          proveedores={c.catalogos.proveedores}
          ordenKey={c.orden.key}
          ordenDir={c.orden.dir}
          onOrdenar={c.alternarOrden}
          mensajeVacio={mensajeVacio}
          onVer={(compra) => abrir('ver', compra)}
          onEditar={(compra) => abrir('editar', compra)}
          onCambiarEstado={(compra) => abrir('estado', compra)}
          onEliminar={(compra) => abrir('eliminar', compra)}
        />

        <Box sx={{ px: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Pagination page={c.paginaActual} total={c.filtradas.length} pageSize={PAGE_SIZE} onPageChange={c.setPage} />
        </Box>
      </Box>

      <NuevaCompraModal
        open={modal.tipo === 'nueva'}
        onClose={cerrar}
        compras={c.compras}
        proveedores={c.catalogos.proveedores}
        insumos={c.catalogos.insumos}
        solicitanteInicial={usuarioAutenticado.nombre}
        onConfirmar={crearCompra}
        onInvalido={() => notificar('advertencia', 'Datos incompletos', 'Cada insumo necesita cantidad y valor mayores a 0')}
      />

      <DetalleCompraModal open={modal.tipo === 'ver'} compra={compraActiva} proveedores={c.catalogos.proveedores} onClose={cerrar} />

      <EditarCompraModal
        open={modal.tipo === 'editar'}
        compra={compraActiva}
        proveedores={c.catalogos.proveedores}
        onClose={cerrar}
        onGuardar={guardarEdicion}
      />

      <CambiarEstadoModal open={modal.tipo === 'estado'} compra={compraActiva} onClose={cerrar} onSeleccionar={cambiarEstado} />

      <EliminarCompraModal open={modal.tipo === 'eliminar'} compraId={modal.id} onClose={cerrar} onConfirmar={eliminarCompra} />
    </Box>
  )
}
