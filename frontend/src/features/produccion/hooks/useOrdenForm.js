import { useState, useMemo } from 'react'
import { esEstadoFinal, formatFecha } from '@features/produccion/utils/produccionHelpers'

// Estado del formulario "Nueva orden" / "Editar orden" (modal master-detail).
export function useOrdenForm(catalogo) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('nueva')
  const [editingId, setEditingId] = useState(null)
  const [editingOrden, setEditingOrden] = useState(null)
  const [items, setItems] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [formId, setFormId] = useState('')
  const [fechaSolicitud, setFechaSolicitud] = useState('')

  // Catálogo filtrado por el buscador
  const productosFiltrados = useMemo(
    () => catalogo.filter((p) => p.toLowerCase().includes(busqueda.toLowerCase())),
    [catalogo, busqueda]
  )

  const abrirNueva = (idSiguiente) => {
    setMode('nueva')
    setEditingId(null)
    setEditingOrden(null)
    setBusqueda('')
    setItems([])
    setFormId(idSiguiente)
    setFechaSolicitud(formatFecha(new Date()))
    setOpen(true)
  }

  const abrirEditar = (orden) => {
    if (esEstadoFinal(orden.estado)) return
    setMode('editar')
    setEditingId(orden.id)
    setEditingOrden(orden)
    setBusqueda('')
    setItems(orden.items.map((i) => ({ ...i })))
    setOpen(true)
  }

  const cerrar = () => setOpen(false)

  // Agrega 1 unidad (la cantidad se modifica solo en el resumen). Devuelve true si se agregó.
  const agregarProducto = (nombre) => {
    if (!nombre) return false
    setItems((prev) => {
      const existente = prev.find((i) => i.nombre === nombre)
      if (existente) {
        return prev.map((i) => (i.nombre === nombre ? { ...i, cantidad: i.cantidad + 1 } : i))
      }
      return [...prev, { nombre, cantidad: 1 }]
    })
    return true
  }

  // Agrega el primer producto que coincide con la búsqueda
  const agregarPrimerCoincidente = () => {
    if (agregarProducto(productosFiltrados[0])) setBusqueda('')
  }

  const quitarProducto = (nombre) => {
    setItems((prev) => prev.filter((i) => i.nombre !== nombre))
  }

  const actualizarCantidad = (nombre, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      quitarProducto(nombre)
      return
    }
    setItems((prev) => prev.map((i) => (i.nombre === nombre ? { ...i, cantidad: nuevaCantidad } : i)))
  }

  return {
    open,
    mode,
    editingId,
    editingOrden,
    items,
    busqueda,
    setBusqueda,
    formId,
    fechaSolicitud,
    productosFiltrados,
    abrirNueva,
    abrirEditar,
    cerrar,
    agregarProducto,
    agregarPrimerCoincidente,
    quitarProducto,
    actualizarCantidad,
  }
}
