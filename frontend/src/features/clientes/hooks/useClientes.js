import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchClientes,
  createCliente,
  updateCliente,
} from '../services/clientesService'

const PAGE_SIZE = 6

// Permite buscar nombres sin distinguir mayúsculas ni tildes.
const normalizar = (valor) =>
  String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

export default function useClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [tipoDocumentoFiltro, setTipoDocumentoFiltro] = useState('Todos')
  const [cuentaFiltro, setCuentaFiltro] = useState('Todos')
  const [page, setPage] = useState(1)

  const enviando = useRef(false)

  const cargarClientes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setClientes(await fetchClientes())
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los clientes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarClientes()
  }, [cargarClientes])

  // Indicadores generales, independientes de los filtros.
  const estadisticas = useMemo(() => {
    const conCuenta = clientes.filter(c => c.id_usuario != null).length

    return {
      total: clientes.length,
      conCuenta,
      sinCuenta: clientes.length - conCuenta,
    }
  }, [clientes])

  // Búsqueda y filtros combinados.
  const clientesFiltrados = useMemo(() => {
    const termino = normalizar(search)

    return clientes.filter(cliente => {
      const coincideBusqueda =
        !termino ||
        normalizar(cliente.nombre).includes(termino) ||
        normalizar(cliente.documento).includes(termino)

      const coincideTipo =
        tipoDocumentoFiltro === 'Todos' ||
        cliente.tipoDocumento === tipoDocumentoFiltro

      const coincideCuenta =
        cuentaFiltro === 'Todos' ||
        (cuentaFiltro === 'Con cuenta' && cliente.id_usuario != null) ||
        (cuentaFiltro === 'Sin cuenta' && cliente.id_usuario == null)

      return coincideBusqueda && coincideTipo && coincideCuenta
    })
  }, [clientes, search, tipoDocumentoFiltro, cuentaFiltro])

  const totalFiltrados = clientesFiltrados.length
  const pageCount = Math.max(1, Math.ceil(totalFiltrados / PAGE_SIZE))
  const paginaActual = Math.min(page, pageCount)

  const clientesPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * PAGE_SIZE

    return clientesFiltrados.slice(inicio, inicio + PAGE_SIZE)
  }, [clientesFiltrados, paginaActual])

  useEffect(() => {
    setPage(prev => Math.min(prev, pageCount))
  }, [pageCount])

  function cambiarBusqueda(valor) {
    setSearch(valor)
    setPage(1)
  }

  function cambiarFiltroDocumento(valor) {
    setTipoDocumentoFiltro(valor)
    setPage(1)
  }

  function cambiarFiltroCuenta(valor) {
    setCuentaFiltro(valor)
    setPage(1)
  }

  function limpiarFiltros() {
    setSearch('')
    setTipoDocumentoFiltro('Todos')
    setCuentaFiltro('Todos')
    setPage(1)
  }

  // Centraliza el estado de guardado y evita solicitudes duplicadas.
  async function ejecutarOperacion(operacion, mensajeError) {
    if (enviando.current) {
      throw new Error('Ya hay una operación en curso.')
    }

    enviando.current = true
    setSubmitting(true)
    setError(null)

    try {
      return await operacion()
    } catch (err) {
      setError(err.message || mensajeError)
      throw err
    } finally {
      enviando.current = false
      setSubmitting(false)
    }
  }

  function agregarCliente(data) {
    return ejecutarOperacion(async () => {
      const nuevo = await createCliente(data)

      setClientes(prev => [...prev, nuevo])

      // Mostrar el nuevo registro al final del listado.
      limpiarFiltros()
      setPage(Math.ceil((clientes.length + 1) / PAGE_SIZE))

      return nuevo
    }, 'No se pudo registrar el cliente.')
  }

  function editarCliente(id, data) {
    return ejecutarOperacion(async () => {
      const actualizado = await updateCliente(id, data)

      if (actualizado) {
        setClientes(prev =>
          prev.map(cliente =>
            cliente.id === id ? actualizado : cliente
          )
        )
      }

      return actualizado
    }, 'No se pudo actualizar el cliente.')
  }

  const hayFiltrosActivos =
    search.trim() !== '' ||
    tipoDocumentoFiltro !== 'Todos' ||
    cuentaFiltro !== 'Todos'

  return {
    clientes: clientesPaginados,
    estadisticas,
    totalFiltrados,
    page: paginaActual,
    pageCount,
    pageSize: PAGE_SIZE,
    setPage,
    loading,
    submitting,
    error,
    search,
    setSearch: cambiarBusqueda,
    tipoDocumentoFiltro,
    setTipoDocumentoFiltro: cambiarFiltroDocumento,
    cuentaFiltro,
    setCuentaFiltro: cambiarFiltroCuenta,
    hayFiltrosActivos,
    limpiarFiltros,
    cargarClientes,
    agregarCliente,
    editarCliente,
  }
}
