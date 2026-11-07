import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  fetchProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  changeEstadoProveedor,
} from '../services/proveedoresService'
import { PAGE_SIZE, filtrosVacios } from '../constants/proveedores.constants'
import { esEmailValido } from '../utils/proveedoresHelpers'

export function useProveedores({ mostrarNotificacion = () => {} } = {}) {
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)

  const [vista, setVista] = useState('lista') // lista | crear | editar | detalle
  const [seleccionado, setSeleccionado] = useState(null)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('asc')

  const [filtrosActivos, setFiltrosActivos] = useState(filtrosVacios)

  const [modalEliminar, setModalEliminar] = useState(false)
  const [modalEstado, setModalEstado] = useState(false)
  const [proveedorAccion, setProveedorAccion] = useState(null)

  const cargar = useCallback(() => {
    setLoading(true)
    fetchProveedores().then((data) => {
      setProveedores(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const handleGuardar = async (form) => {
    const faltantes = []
    if (!String(form.nombre).trim()) faltantes.push('nombre de la empresa')
    if (!String(form.nit).trim()) faltantes.push('NIT')
    if (!String(form.nombreContacto).trim()) faltantes.push('nombre del contacto')
    if (!String(form.telefono).trim()) faltantes.push('teléfono')
    if (!String(form.email).trim()) faltantes.push('correo electrónico')
    if (!String(form.direccion).trim()) faltantes.push('dirección')

    if (faltantes.length > 0) {
      mostrarNotificacion('advertencia', 'Campos obligatorios', `Falta completar: ${faltantes.join(', ')}`)
      return
    }
    if (!esEmailValido(form.email)) {
      mostrarNotificacion('advertencia', 'Correo inválido', 'Escribe un correo con formato nombre@empresa.com')
      return
    }

    try {
      if (vista === 'crear') {
        const nuevo = await createProveedor(form)
        mostrarNotificacion('exito', 'Proveedor registrado', `El proveedor ${nuevo.nombre} (ID ${nuevo.id}) se creó correctamente`)
      } else if (vista === 'editar' && seleccionado) {
        await updateProveedor(seleccionado.id, form)
        mostrarNotificacion('exito', 'Proveedor actualizado', `El proveedor ${seleccionado.nombre} (ID ${seleccionado.id}) se actualizó correctamente`)
      }
    } catch {
      mostrarNotificacion('error', 'No se pudo guardar', 'Ocurrió un error al guardar el proveedor. Intenta de nuevo')
      return
    }
    await cargar()
    setVista('lista')
  }

  const handleEliminar = async () => {
    if (!proveedorAccion) return
    try {
      await deleteProveedor(proveedorAccion.id)
    } catch {
      mostrarNotificacion('error', 'No se pudo eliminar', `No fue posible eliminar el proveedor ${proveedorAccion.nombre}. Intenta de nuevo`)
      return
    }
    mostrarNotificacion('exito', 'Proveedor eliminado', `El proveedor ${proveedorAccion.nombre} (ID ${proveedorAccion.id}) se eliminó correctamente`)
    await cargar()
    setModalEliminar(false)
    if (vista !== 'lista') setVista('lista')
  }

  const handleCambiarEstado = async (nuevoEstado) => {
    if (!proveedorAccion) return
    try {
      await changeEstadoProveedor(proveedorAccion.id, nuevoEstado)
    } catch {
      mostrarNotificacion('error', 'No se pudo cambiar el estado', `No fue posible actualizar el estado del proveedor ${proveedorAccion.nombre}. Intenta de nuevo`)
      return
    }
    mostrarNotificacion('exito', 'Estado actualizado', `El proveedor ${proveedorAccion.nombre} ahora está ${nuevoEstado ? 'Activo' : 'Inactivo'}`)
    await cargar()
    setModalEstado(false)
  }

  const limpiarFiltros = () => {
    setFiltrosActivos(filtrosVacios)
    setPage(1)
  }

  const filtered = useMemo(() => {
    let data = proveedores

    if (search) {
      const txt = search.toLowerCase()
      data = data.filter(
        (p) =>
          p.nombre.toLowerCase().includes(txt) ||
          String(p.id).includes(txt) ||
          p.nit.toLowerCase().includes(txt) ||
          p.nombreContacto.toLowerCase().includes(txt)
      )
    }
    if (filtrosActivos.estado)
      data = data.filter((p) => p.estado === (filtrosActivos.estado === 'true'))
    if (filtrosActivos.nombre)
      data = data.filter((p) => p.nombre.toLowerCase().includes(filtrosActivos.nombre.toLowerCase()))
    if (filtrosActivos.nit)
      data = data.filter((p) => p.nit.toLowerCase().includes(filtrosActivos.nit.toLowerCase()))
    if (filtrosActivos.nombreContacto)
      data = data.filter((p) =>
        p.nombreContacto.toLowerCase().includes(filtrosActivos.nombreContacto.toLowerCase())
      )
    if (filtrosActivos.email)
      data = data.filter((p) => p.email.toLowerCase().includes(filtrosActivos.email.toLowerCase()))

    const sorted = [...data].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [proveedores, search, filtrosActivos, sortKey, sortDir])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const filtrosActivosCount = Object.values(filtrosActivos).filter(Boolean).length

  const kpis = {
    total: proveedores.length,
    activos: proveedores.filter((p) => p.estado).length,
    inactivos: proveedores.filter((p) => !p.estado).length,
  }

  return {
    // datos
    loading,
    kpis,
    filtered,
    paginated,
    pageSize: PAGE_SIZE,
    // vista
    vista,
    setVista,
    seleccionado,
    setSeleccionado,
    // tabla
    search,
    setSearch,
    page,
    setPage,
    sortKey,
    sortDir,
    handleSort,
    // filtros
    filtrosActivos,
    setFiltrosActivos,
    filtrosActivosCount,
    limpiarFiltros,
    // acciones
    handleGuardar,
    handleEliminar,
    handleCambiarEstado,
    modalEliminar,
    setModalEliminar,
    modalEstado,
    setModalEstado,
    proveedorAccion,
    setProveedorAccion,
  }
}
