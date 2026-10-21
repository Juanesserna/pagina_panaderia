import { useState } from 'react'
import { Box, Typography, Divider } from '@mui/material'
import { esEstadoFinal, estadoEfectivo } from '@features/produccion/utils/produccionHelpers'
import { useOrdenes } from '@features/produccion/hooks/useOrdenes'
import { useCatalogoProductos } from '@features/produccion/hooks/useCatalogoProductos'
import { useOrdenesFiltros } from '@features/produccion/hooks/useOrdenesFiltros'
import { useOrdenForm } from '@features/produccion/hooks/useOrdenForm'
import ProduccionKPIs from '@features/produccion/components/ProduccionKPIs'
import ProduccionToolbar from '@features/produccion/components/ProduccionToolbar'
import ProduccionFiltros from '@features/produccion/components/ProduccionFiltros'
import OrdenesTable from '@features/produccion/components/OrdenesTable'
import OrdenDetalleModal from '@features/produccion/components/modals/OrdenDetalleModal'
import OrdenFormModal from '@features/produccion/components/modals/OrdenFormModal'
import CambiarEstadoModal from '@features/produccion/components/modals/CambiarEstadoModal'
import EliminarOrdenModal from '@features/produccion/components/modals/EliminarOrdenModal'

export default function ProduccionPage() {
  const { ordenes, usuario, siguienteId, crearOrden, actualizarItems, cambiarEstado, eliminarOrden } = useOrdenes()
  const { catalogo, recetas } = useCatalogoProductos()
  const filtros = useOrdenesFiltros(ordenes)
  const form = useOrdenForm(catalogo)

  // Estado puramente de UI de la página
  const [showFiltros, setShowFiltros] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showDetalle, setShowDetalle] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [estadoEditId, setEstadoEditId] = useState(null)
  const [estadoEditValue, setEstadoEditValue] = useState('pendiente')

  const handleVerDetalle = (orden) => {
    setSelected(orden)
    setShowDetalle(true)
  }

  const handleAbrirCambioEstado = (orden) => {
    if (esEstadoFinal(orden.estado)) return
    setEstadoEditId(orden.id)
    setEstadoEditValue(estadoEfectivo(orden))
  }

  const handleConfirmarEstado = () => {
    if (!estadoEditId) return
    cambiarEstado(estadoEditId, estadoEditValue)
    setEstadoEditId(null)
  }

  const handleConfirmarOrden = () => {
    if (form.items.length === 0) return
    if (form.mode === 'nueva') {
      crearOrden({ id: form.formId, fechaSolicitud: form.fechaSolicitud, items: form.items })
    } else if (form.editingId) {
      actualizarItems(form.editingId, form.items)
    }
    form.cerrar()
  }

  const handleConfirmarEliminar = () => {
    if (deleteId) eliminarOrden(deleteId)
    setDeleteId(null)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ProduccionKPIs ordenes={ordenes} />

      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <ProduccionToolbar
          search={filtros.search}
          onSearchChange={filtros.setSearch}
          onNuevaOrden={() => form.abrirNueva(siguienteId())}
          filtrosActivos={filtros.filtrosActivos}
          cantidadFiltrosActivos={filtros.cantidadFiltrosActivos}
          onToggleFiltros={() => setShowFiltros((v) => !v)}
        />
        <Divider />
        <ProduccionFiltros open={showFiltros} filtros={filtros} />
        <OrdenesTable
          ordenes={filtros.paginated}
          page={filtros.page}
          total={filtros.total}
          onPageChange={filtros.setPage}
          onVerDetalle={handleVerDetalle}
          onEditar={form.abrirEditar}
          onEliminar={setDeleteId}
          onCambiarEstado={handleAbrirCambioEstado}
        />
      </Box>

      <OrdenDetalleModal open={showDetalle} onClose={() => setShowDetalle(false)} orden={selected} recetas={recetas} />

      <OrdenFormModal form={form} usuario={usuario} onConfirmar={handleConfirmarOrden} />

      <CambiarEstadoModal
        ordenId={estadoEditId}
        value={estadoEditValue}
        onChange={setEstadoEditValue}
        onClose={() => setEstadoEditId(null)}
        onConfirm={handleConfirmarEstado}
      />

      <EliminarOrdenModal ordenId={deleteId} onClose={() => setDeleteId(null)} onConfirm={handleConfirmarEliminar} />

      <Typography
        variant="caption"
        component="footer"
        sx={{ display: 'block', pt: 2, pb: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center', color: 'text.dim' }}
      >
        © 2026 Al Horno. Todos los derechos reservados a la institución educativa SENA
      </Typography>
    </Box>
  )
}
