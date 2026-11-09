import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchClientes,
  createCliente,
  updateCliente,
} from '../services/clientesService'

const PAGE_SIZE = 6

export default function useClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [tipoDocumentoFiltro, setTipoDocumentoFiltro] = useState('Todos')
  const [page, setPage] = useState(1)

  const cargarClientes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchClientes()
      setClientes(data)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los clientes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarClientes()
  }, [cargarClientes])

  const clientesFiltrados = useMemo(() => {
    const termino = search.trim().toLowerCase()

    return clientes.filter((cliente) => {
      const coincideBusqueda =
        !termino ||
        cliente.nombre.toLowerCase().includes(termino) ||
        cliente.documento.toLowerCase().includes(termino)

      const coincideTipo =
        tipoDocumentoFiltro === 'Todos' ||
        cliente.tipoDocumento === tipoDocumentoFiltro

      return coincideBusqueda && coincideTipo
    })
  }, [clientes, search, tipoDocumentoFiltro])

  const totalFiltrados = clientesFiltrados.length
  const pageCount = Math.ceil(totalFiltrados / PAGE_SIZE)

  const clientesPaginados = useMemo(() => {
    const inicio = (page - 1) * PAGE_SIZE
    return clientesFiltrados.slice(inicio, inicio + PAGE_SIZE)
  }, [clientesFiltrados, page])

  useEffect(() => {
    setPage((prev) => Math.min(prev, Math.max(pageCount, 1)))
  }, [pageCount])

  const cambiarBusqueda = (valor) => {
    setSearch(valor)
    setPage(1)
  }

  const cambiarFiltroDocumento = (valor) => {
    setTipoDocumentoFiltro(valor)
    setPage(1)
  }

  const limpiarFiltros = () => {
    setSearch('')
    setTipoDocumentoFiltro('Todos')
    setPage(1)
  }

  const agregarCliente = async (data) => {
  try {
    setSubmitting(true)
    setError(null)

    const nuevo = await createCliente(data)

    // Agregar el nuevo cliente al final de la lista.
    setClientes((prev) => [...prev, nuevo])

    // Limpiar filtros para que el nuevo registro sea visible.
    setSearch('')
    setTipoDocumentoFiltro('Todos')

    // Ir a la última página.
    setPage(Math.ceil((clientes.length + 1) / PAGE_SIZE))

    return nuevo
  } catch (err) {
    setError(err.message || 'No se pudo registrar el cliente.')
    throw err
  } finally {
    setSubmitting(false)
  }
}

  const editarCliente = async (id, data) => {
    try {
      setSubmitting(true)
      setError(null)

      const actualizado = await updateCliente(id, data)

      if (actualizado) {
        setClientes((prev) =>
          prev.map((cliente) =>
            cliente.id === id ? actualizado : cliente
          )
        )
      }

      return actualizado
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el cliente.')
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const hayFiltrosActivos =
    search.trim() !== '' || tipoDocumentoFiltro !== 'Todos'

  return {
    clientes: clientesPaginados,
    totalFiltrados,
    page,
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
    hayFiltrosActivos,
    limpiarFiltros,
    cargarClientes,
    agregarCliente,
    editarCliente,
  }
}
