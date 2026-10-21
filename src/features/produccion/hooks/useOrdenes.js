import { useState } from 'react'
import { esEstadoFinal, formatFecha, siguienteIdOrden } from '@features/produccion/utils/produccionHelpers'
// TEMPORAL: datos de ejemplo. Cuando exista el service, este hook deja de importar el mock.
import { initialOrdenes, usuarioAutenticado } from '@features/produccion/mocks/produccionMockData'

// Estado y operaciones (CRUD) de las órdenes de producción.
export function useOrdenes() {
  const [ordenes, setOrdenes] = useState(initialOrdenes)

  const siguienteId = () => siguienteIdOrden(ordenes)

  const crearOrden = ({ id, fechaSolicitud, items }) => {
    const nuevaOrden = {
      id,
      producto: 'Manual',
      items,
      unidad: 'piezas',
      fechaSolicitud,
      fechaFabricacion: '',
      estado: 'pendiente',
      generadoPor: { nombre: usuarioAutenticado.nombre, documento: usuarioAutenticado.nit },
    }
    setOrdenes((prev) => [nuevaOrden, ...prev])
  }

  const actualizarItems = (id, items) => {
    setOrdenes((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        if (esEstadoFinal(o.estado)) return o
        return { ...o, items }
      })
    )
  }

  const cambiarEstado = (id, estado) => {
    setOrdenes((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        if (esEstadoFinal(o.estado)) return o
        return {
          ...o,
          estado,
          fechaFabricacion: estado === 'completado' && !o.fechaFabricacion ? formatFecha(new Date()) : o.fechaFabricacion,
        }
      })
    )
  }

  const eliminarOrden = (id) => {
    setOrdenes((prev) => prev.filter((o) => o.id !== id))
  }

  return {
    ordenes,
    usuario: usuarioAutenticado,
    siguienteId,
    crearOrden,
    actualizarItems,
    cambiarEstado,
    eliminarOrden,
  }
}
