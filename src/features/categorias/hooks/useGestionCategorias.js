import { useState } from 'react'

// Estado de los modales y del drawer de la página de categorías, con sus acciones.
export function useGestionCategorias({
  allCategorias,
  crear,
  editar,
  eliminar,
  aplicarFiltros,
  limpiarFiltros,
}) {
  const [nuevaAbierto, setNuevaAbierto] = useState(false)
  const [editarAbierto, setEditarAbierto] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [eliminarAbierto, setEliminarAbierto] = useState(false)
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null)
  const [filtrosAbierto, setFiltrosAbierto] = useState(false)
  const [categoriaCambioEstado, setCategoriaCambioEstado] = useState(null)

  const abrirNueva = () => setNuevaAbierto(true)
  const cerrarNueva = () => setNuevaAbierto(false)
  const guardarNueva = (datos) => {
    crear(datos)
    setNuevaAbierto(false)
  }

  const abrirFiltros = () => setFiltrosAbierto(true)
  const cerrarFiltros = () => setFiltrosAbierto(false)
  const aplicar = (nuevosFiltros) => {
    aplicarFiltros(nuevosFiltros)
    setFiltrosAbierto(false)
  }

  const abrirCambioEstado = (categoria) => setCategoriaCambioEstado(categoria)
  const cerrarCambioEstado = () => setCategoriaCambioEstado(null)
  const confirmarCambioEstado = (estado) => {
    editar(categoriaCambioEstado.id, { estado })
    setCategoriaCambioEstado(null)
  }

  const abrirEditar = (id) => {
    setCategoriaSeleccionada(allCategorias.find((c) => c.id === id))
    setEditarAbierto(true)
  }
  const cerrarEditar = () => {
    setEditarAbierto(false)
    setCategoriaSeleccionada(null)
  }
  const guardarEdicion = (id, datosActualizados) => {
    editar(id, datosActualizados)
    setEditarAbierto(false)
    setCategoriaSeleccionada(null)
  }

  const abrirEliminar = (id) => {
    setCategoriaAEliminar(allCategorias.find((c) => c.id === id))
    setEliminarAbierto(true)
  }
  const cerrarEliminar = () => {
    setEliminarAbierto(false)
    setCategoriaAEliminar(null)
  }
  const confirmarEliminar = () => {
    if (categoriaAEliminar) {
      eliminar(categoriaAEliminar.id)
    }
    setEliminarAbierto(false)
    setCategoriaAEliminar(null)
  }

  return {
    nuevaAbierto,
    editarAbierto,
    eliminarAbierto,
    filtrosAbierto,
    categoriaSeleccionada,
    categoriaAEliminar,
    categoriaCambioEstado,
    abrirNueva,
    cerrarNueva,
    guardarNueva,
    abrirFiltros,
    cerrarFiltros,
    aplicar,
    limpiar: limpiarFiltros,
    abrirCambioEstado,
    cerrarCambioEstado,
    confirmarCambioEstado,
    abrirEditar,
    cerrarEditar,
    guardarEdicion,
    abrirEliminar,
    cerrarEliminar,
    confirmarEliminar,
  }
}