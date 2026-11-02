import { useState, useMemo } from 'react'
import { PAGE_SIZE } from '../constants/pedidos.constants'
import { normalizarTexto } from '../utils/pedidosHelpers'

const FILTROS_INICIALES = {
  estado: '',
  metodo: '',
  canal: '',
  totalMin: '',
  totalMax: '',
  fechaDesde: '',
  fechaHasta: '',
}

export function usePedidosFiltros(pedidos = []) {
  const [search, setSearch] = useState('')
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('desc')

  const setFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
    setPage(1)
  }

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES)
    setSearch('')
    setPage(1)
  }

  const toggleFiltros = () => setMostrarFiltros((prev) => !prev)

  const cantidadFiltrosActivos = useMemo(() => {
    return Object.values(filtros).filter((v) => v !== '' && v != null).length + (search ? 1 : 0)
  }, [filtros, search])

  const filtrosActivos = cantidadFiltrosActivos > 0

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtrados = useMemo(() => {
    let resultado = [...pedidos]

    if (search.trim()) {
      const q = normalizarTexto(search)
      resultado = resultado.filter((p) =>
        normalizarTexto(p.id).includes(q) ||
        normalizarTexto(p.cliente || p.usuario).includes(q) ||
        normalizarTexto(p.nit).includes(q)
      )
    }

    // Tarea 4: Filtro por estado, incluyendo correctamente 'anulado'
    if (filtros.estado) {
      resultado = resultado.filter((p) => p.estado === filtros.estado)
    }

    if (filtros.metodo) {
      resultado = resultado.filter((p) => p.metodo === filtros.metodo)
    }

    if (filtros.canal) {
      resultado = resultado.filter((p) => p.canal === filtros.canal)
    }

    if (filtros.totalMin !== '') {
      const min = parseFloat(filtros.totalMin)
      if (!Number.isNaN(min)) resultado = resultado.filter((p) => p.total >= min)
    }

    if (filtros.totalMax !== '') {
      const max = parseFloat(filtros.totalMax)
      if (!Number.isNaN(max)) resultado = resultado.filter((p) => p.total <= max)
    }

    return resultado
  }, [pedidos, search, filtros])

  const ordenados = useMemo(() => {
    return [...filtrados].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'id') {
        const numA = parseInt((a.id || '').replace(/\D/g, ''), 10) || 0
        const numB = parseInt((b.id || '').replace(/\D/g, ''), 10) || 0
        cmp = numA - numB
      } else if (sortKey === 'total') {
        cmp = (a.total || 0) - (b.total || 0)
      } else if (sortKey === 'fecha') {
        cmp = (a.id || '').localeCompare(b.id || '')
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtrados, sortKey, sortDir])

  const paginadas = useMemo(() => {
    const inicio = (page - 1) * PAGE_SIZE
    return ordenados.slice(inicio, inicio + PAGE_SIZE)
  }, [ordenados, page])

  return {
    search,
    setSearch: (v) => { setSearch(v); setPage(1) },
    filtros,
    setFiltro,
    limpiarFiltros,
    mostrarFiltros,
    toggleFiltros,
    filtrosActivos,
    cantidadFiltrosActivos,
    page,
    setPage,
    sortKey,
    sortDir,
    handleSort,
    paginadas,
    total: ordenados.length,
  }
}

