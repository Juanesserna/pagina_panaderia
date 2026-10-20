import { useEffect, useMemo, useState } from 'react'
import { PAGE_SIZE, filtrosVacios } from '../constants/compras.constants'
import { comprasService } from '../services/comprasService'
import { calcularKpis, contarFiltrosActivos, filtrarCompras, ordenarCompras } from '../utils/comprasHelpers'

// Todo el estado y la lógica de la lista de compras: carga, búsqueda, filtros, orden, paginación,
// KPIs y operaciones (crear / editar / cambiar estado / eliminar). La pantalla solo dibuja.
export function useCompras() {
  const [compras, setCompras] = useState([])
  const [catalogos, setCatalogos] = useState({ proveedores: [], insumos: [] })
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(false)

  const [busqueda, setBusqueda] = useState('')
  const [filtros, setFiltros] = useState(filtrosVacios)
  const [orden, setOrden] = useState({ key: 'id', dir: 'desc' })
  const [page, setPage] = useState(1)

  // ---------- Carga ----------

  useEffect(() => {
    let activo = true
    Promise.all([comprasService.obtenerCompras(), comprasService.obtenerCatalogos()])
      .then(([lista, cat]) => {
        if (!activo) return
        setCompras(lista)
        setCatalogos(cat)
        setCargando(false)
      })
      .catch(() => {
        if (!activo) return
        setErrorCarga(true)
        setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  // ---------- Búsqueda, filtros y orden (todos regresan a la página 1) ----------

  const cambiarBusqueda = (valor) => {
    setBusqueda(valor)
    setPage(1)
  }

  const cambiarFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
    setPage(1)
  }

  const limpiarFiltros = () => {
    setFiltros(filtrosVacios)
    setPage(1)
  }

  const alternarOrden = (key) =>
    setOrden((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    )

  // ---------- Datos derivados ----------

  const filtradas = useMemo(
    () => ordenarCompras(filtrarCompras(compras, { busqueda, filtros, proveedores: catalogos.proveedores }), orden.key, orden.dir),
    [compras, busqueda, filtros, catalogos.proveedores, orden]
  )

  // Si al eliminar/filtrar la página actual deja de existir, se muestra la última
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / PAGE_SIZE))
  const paginaActual = Math.min(page, totalPaginas)
  const paginadas = filtradas.slice((paginaActual - 1) * PAGE_SIZE, paginaActual * PAGE_SIZE)

  const kpis = useMemo(() => calcularKpis(compras), [compras])

  // ---------- Operaciones (lanzan error si el servicio falla) ----------

  const crear = async (datos) => {
    const nueva = await comprasService.crearCompra(datos)
    setCompras((prev) => [nueva, ...prev])
    return nueva
  }

  const actualizar = async (compra) => {
    const guardada = await comprasService.actualizarCompra(compra)
    setCompras((prev) => prev.map((c) => (c.id === guardada.id ? guardada : c)))
    return guardada
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    const guardada = await comprasService.cambiarEstado(id, nuevoEstado)
    setCompras((prev) => prev.map((c) => (c.id === guardada.id ? guardada : c)))
    return guardada
  }

  const eliminar = async (id) => {
    await comprasService.eliminarCompra(id)
    setCompras((prev) => prev.filter((c) => c.id !== id))
  }

  return {
    // datos
    compras,
    catalogos,
    cargando,
    errorCarga,
    filtradas,
    paginadas,
    kpis,
    // búsqueda / filtros / orden / paginación
    busqueda,
    cambiarBusqueda,
    filtros,
    cambiarFiltro,
    limpiarFiltros,
    cantidadFiltros: contarFiltrosActivos(filtros),
    orden,
    alternarOrden,
    paginaActual,
    setPage,
    // operaciones
    crear,
    actualizar,
    cambiarEstado,
    eliminar,
  }
}
