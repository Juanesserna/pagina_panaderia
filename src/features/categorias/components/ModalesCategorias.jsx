import NuevaCategoriaModal from './NuevaCategoriaModal'
import EditarCategoriaModal from './EditarCategoriaModal'
import EliminarCategoriaDialog from './EliminarCategoriaDialog'
import CambiarEstadoCategoriaModal from './CambiarEstadoCategoriaModal'

export default function ModalesCategorias({ gestion }) {
  return (
    <>
      <NuevaCategoriaModal
        open={gestion.nuevaAbierto}
        onClose={gestion.cerrarNueva}
        onSubmit={gestion.guardarNueva}
      />

      <EditarCategoriaModal
        key={gestion.categoriaSeleccionada?.id}
        open={gestion.editarAbierto}
        onClose={gestion.cerrarEditar}
        onSubmit={gestion.guardarEdicion}
        categoria={gestion.categoriaSeleccionada}
      />

      <EliminarCategoriaDialog
        open={gestion.eliminarAbierto}
        onClose={gestion.cerrarEliminar}
        onConfirm={gestion.confirmarEliminar}
        nombreCategoria={gestion.categoriaAEliminar?.nombre}
      />

      {gestion.categoriaCambioEstado && (
        <CambiarEstadoCategoriaModal
          key={gestion.categoriaCambioEstado.id}
          categoria={gestion.categoriaCambioEstado}
          onClose={gestion.cerrarCambioEstado}
          onConfirmar={gestion.confirmarCambioEstado}
        />
      )}
    </>
  )
}
