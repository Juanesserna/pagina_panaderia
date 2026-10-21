import { useMemo, useRef, useState } from 'react'
import { ventasService } from '../services/ventasService'
import {
  contieneCaracterEspecial,
  fechaHoyFormateada,
  horaActualFormateada,
  normalizarTexto,
  productoSinStock,
  siguienteIdVenta,
} from '../utils/ventasHelpers'

// Modal "Nueva venta" (venta presencial registrada a mano).
// onVentaCreada(venta): la agrega al listado (useVentas.agregarVenta).
export function useNuevaVenta({ ventas, onVentaCreada, mostrarNotificacion }) {
  const [abierto, setAbierto] = useState(false)
  const [items, setItems] = useState([])
  const [id, setId] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [cliente, setCliente] = useState(null)
  const [metodo, setMetodo] = useState('efectivo')
  const [pagoDividido, setPagoDividido] = useState(false) // false = pago único (100%) · true = 2 pagos de 50%
  const [busqueda, setBusqueda] = useState('')

  const clienteTuvoCaracterEspecialRef = useRef(false)
  const productoTuvoCaracterEspecialRef = useRef(false)

  const clientes = useMemo(() => ventasService.listarClientes(), [])
  const catalogo = useMemo(() => ventasService.listarProductos(), [])

  // Catálogo filtrado por el buscador (ignora mayúsculas y tildes)
  const productosFiltrados = useMemo(() => {
    const q = normalizarTexto(busqueda).trim()
    if (!q) return catalogo
    return catalogo.filter((p) => normalizarTexto(p.nombre).includes(q))
  }, [catalogo, busqueda])

  const total = items.reduce((s, i) => s + i.cantidad * i.precio, 0)
  const puedeRegistrar = items.length > 0 && Boolean(cliente)

  // Avisa una sola vez cuando el texto pasa a contener símbolos especiales
  const validarCaracterEspecial = (valor, ref) => {
    const tieneEspecial = contieneCaracterEspecial(valor)
    if (tieneEspecial && !ref.current) {
      mostrarNotificacion('advertencia', 'Carácter no permitido', 'Evita usar símbolos especiales en el formulario de ventas')
    }
    ref.current = tieneEspecial
  }

  const onClienteInputChange = (valor) => validarCaracterEspecial(valor, clienteTuvoCaracterEspecialRef)

  const onBusquedaChange = (valor) => {
    validarCaracterEspecial(valor, productoTuvoCaracterEspecialRef)
    setBusqueda(valor)
  }

  const resetFormulario = () => {
    setItems([])
    setCliente(null)
    setMetodo('efectivo')
    setPagoDividido(false)
    setBusqueda('')
    clienteTuvoCaracterEspecialRef.current = false
    productoTuvoCaracterEspecialRef.current = false
  }

  const abrir = () => {
    resetFormulario()
    setId(siguienteIdVenta(ventas))
    setFecha(fechaHoyFormateada())
    setHora(horaActualFormateada())
    setAbierto(true)
  }

  const cerrar = () => setAbierto(false)

  // Agrega 1 unidad (la cantidad se modifica solo en el resumen). Devuelve true si se agregó.
  const agregarProducto = (producto) => {
    if (!producto) return false

    if (productoSinStock(producto)) {
      mostrarNotificacion('error', 'Sin stock disponible', `${producto.nombre} no cuenta con stock disponible`)
      return false
    }

    setItems((prev) => {
      const existente = prev.find((i) => i.nombre === producto.nombre)
      if (existente) {
        return prev.map((i) => (i.nombre === producto.nombre ? { ...i, cantidad: i.cantidad + 1 } : i))
      }
      return [...prev, { nombre: producto.nombre, cantidad: 1, precio: producto.precio }]
    })
    return true
  }

  // Agrega el primer producto que coincide con la búsqueda
  const agregarPrimeraCoincidencia = () => {
    if (agregarProducto(productosFiltrados[0])) setBusqueda('')
  }

  const quitarProducto = (nombre) => setItems((prev) => prev.filter((i) => i.nombre !== nombre))

  const actualizarCantidad = (nombre, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      quitarProducto(nombre)
      return
    }
    setItems((prev) => prev.map((i) => (i.nombre === nombre ? { ...i, cantidad: nuevaCantidad } : i)))
  }

  const confirmar = () => {
    if (!puedeRegistrar) return
    const usuario = ventasService.obtenerUsuarioActual()
    const nuevaVenta = {
      id,
      usuario: usuario.nombre,
      cliente: cliente.nombre || 'Cliente no especificado',
      nit: cliente.nit,
      origen: 'manual',
      productos: items.reduce((s, i) => s + i.cantidad, 0),
      total,
      estado: 'pendiente',
      metodo,
      canal: 'presencial',
      pagoUnico: !pagoDividido,
      fecha,
      hora,
      items,
    }
    onVentaCreada(nuevaVenta)
    setAbierto(false)
    mostrarNotificacion('exito', 'Venta registrada', `La venta ${nuevaVenta.id} se creó correctamente`)
  }

  return {
    abierto,
    abrir,
    cerrar,
    // formulario
    id,
    fecha,
    hora,
    cliente,
    setCliente,
    metodo,
    setMetodo,
    pagoDividido,
    setPagoDividido,
    busqueda,
    onBusquedaChange,
    onClienteInputChange,
    // datos
    clientes,
    productosFiltrados,
    items,
    total,
    puedeRegistrar,
    // acciones
    agregarProducto,
    agregarPrimeraCoincidencia,
    quitarProducto,
    actualizarCantidad,
    confirmar,
  }
}
