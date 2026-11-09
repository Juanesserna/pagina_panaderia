import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  fetchEmpleados,
  createEmpleado,
  updateEmpleado,
} from '../services/empleadosService'

const PAGE_SIZE = 6

export default function useEmpleados() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [tipoDocumentoFiltro, setTipoDocumentoFiltro] = useState('Todos')
  const [page, setPage] = useState(1)

  const cargarEmpleados = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const datos = await fetchEmpleados()
      setEmpleados(datos)
    } catch (err) {
      setError(err.message || 'No fue posible cargar los empleados.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarEmpleados().catch(() => {})
  }, [cargarEmpleados])

  const empleadosFiltrados = useMemo(() => {
    const termino = search.trim().toLowerCase()

    return empleados.filter((empleado) => {
      const coincideBusqueda =
        !termino ||
        empleado.nombre.toLowerCase().includes(termino) ||
        empleado.documento.toLowerCase().includes(termino) ||
        empleado.telefono.includes(termino)

      const coincideTipo =
        tipoDocumentoFiltro === 'Todos' ||
        empleado.tipoDocumento === tipoDocumentoFiltro

      return coincideBusqueda && coincideTipo
    })
  }, [empleados, search, tipoDocumentoFiltro])

  const totalPaginas = Math.max(
    1,
    Math.ceil(empleadosFiltrados.length / PAGE_SIZE)
  )

  const empleadosPaginados = useMemo(() => {
    const inicio = (page - 1) * PAGE_SIZE

    return empleadosFiltrados.slice(inicio, inicio + PAGE_SIZE)
  }, [empleadosFiltrados, page])

  useEffect(() => {
    if (page > totalPaginas) {
      setPage(totalPaginas)
    }
  }, [page, totalPaginas])

  const cambiarBusqueda = useCallback((valor) => {
    setSearch(valor)
    setPage(1)
  }, [])

  const cambiarFiltro = useCallback((valor) => {
    setTipoDocumentoFiltro(valor)
    setPage(1)
  }, [])

  const registrarEmpleado = useCallback(async (data) => {
    setSubmitting(true)
    setError(null)

    try {
      const nuevo = await createEmpleado(data)

      setEmpleados((actuales) => [...actuales, nuevo])
      setSearch('')
      setTipoDocumentoFiltro('Todos')
      setPage(Math.ceil((empleados.length + 1) / PAGE_SIZE))

      return nuevo
    } catch (err) {
      setError(err.message || 'No fue posible registrar el empleado.')
      throw err
    } finally {
      setSubmitting(false)
    }
  }, [empleados.length])

  const actualizarEmpleado = useCallback(async (id, data) => {
    setSubmitting(true)
    setError(null)

    try {
      const actualizado = await updateEmpleado(id, data)

      setEmpleados((actuales) =>
        actuales.map((empleado) =>
          empleado.id === id ? actualizado : empleado
        )
      )

      return actualizado
    } catch (err) {
      setError(err.message || 'No fue posible actualizar el empleado.')
      throw err
    } finally {
      setSubmitting(false)
    }
  }, [])

  return {
    empleados,
    empleadosFiltrados,
    empleadosPaginados,

    loading,
    submitting,
    error,

    search,
    setSearch: cambiarBusqueda,

    tipoDocumentoFiltro,
    setTipoDocumentoFiltro: cambiarFiltro,

    page,
    setPage,
    pageSize: PAGE_SIZE,
    totalPaginas,
    totalEmpleados: empleadosFiltrados.length,

    cargarEmpleados,
    registrarEmpleado,
    actualizarEmpleado,
  }
}
