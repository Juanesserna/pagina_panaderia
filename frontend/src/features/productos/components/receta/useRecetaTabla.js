// Importa los hooks de estado y efecto de React
import { useState, useEffect } from 'react'
// Importa las funciones que traen el catálogo de insumos y las unidades de medida
import { fetchInsumos, getUnidadesMedida } from '@features/insumos'

// Un insumo está activo si su estado es true (datos de ejemplo) o 'Activo' (formularios)
const estaActivo = (insumo) => insumo.estado === true || insumo.estado === 'Activo'

// Fila vacía para agregar un insumo nuevo
const filaVacia = () => ({
  idTemp: null,
  insumoId: '',
  insumoNombre: '',
  cantidad: '',
  unidadId: '',
  unidadNombre: '',
})

// Hook con toda la lógica de la tabla de receta: estados, catálogos y handlers.
// "insumos" son los insumos que ya tiene la receta (para evitar repetidos).
export default function useRecetaTabla({ insumos = [], onAgregarInsumo, onEditInsumo, codigoProducto }) {
  // Indica si se está mostrando la fila para agregar un insumo nuevo
  const [agregandoFila, setAgregandoFila] = useState(false)
  // Guarda el id del insumo que se está editando (null si ninguno)
  const [editandoFilaId, setEditandoFilaId] = useState(null)
  // Datos de la fila nueva que se está llenando
  const [nuevaFila, setNuevaFila] = useState(filaVacia)
  // Datos de la fila que se está editando
  const [filaEditando, setFilaEditando] = useState(null)
  // Catálogo de insumos disponibles (solo activos)
  const [insumosCatalogo, setInsumosCatalogo] = useState([])
  // Lista de unidades de medida disponibles
  const [unidadesMedida, setUnidadesMedida] = useState([])
  // Indica si los catálogos todavía están cargando
  const [loading, setLoading] = useState(true)

  // Al montar, carga los catálogos de insumos y unidades
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [insumosData, unidadesData] = await Promise.all([
          fetchInsumos(),
          Promise.resolve(getUnidadesMedida()),
        ])
        // Solo se pueden agregar insumos activos
        setInsumosCatalogo(insumosData.filter(estaActivo))
        setUnidadesMedida(unidadesData)
      } catch (error) {
        console.error('Error cargando catálogos:', error)
      } finally {
        setLoading(false)
      }
    }
    cargarCatalogos()
  }, [])

  // Ids de insumos que ya están en la receta (sin contar la fila que se está editando)
  const insumosUsados = insumos
    .filter((i) => i.id !== editandoFilaId)
    .map((i) => String(i.idInsumo))

  // Se ejecuta al pulsar "Agregar insumo": prepara una fila nueva vacía
  const handleAgregarClick = () => {
    setNuevaFila({ ...filaVacia(), idTemp: Date.now() })
    setAgregandoFila(true)
  }

  // Se ejecuta al pulsar el lápiz de un insumo: prepara la fila para editar
  const handleEditarClick = (insumo) => {
    // La unidad se busca por abreviatura entre todas las unidades (no depende del catálogo de insumos)
    const unidad = unidadesMedida.find(
      (u) => String(u.abreviatura).toLowerCase() === String(insumo.unidad).toLowerCase()
    )

    setFilaEditando({
      id: insumo.id,
      idTemp: insumo.id,
      insumoId: insumo.idInsumo,
      insumoNombre: insumo.insumo,
      cantidad: insumo.cantidad,
      unidadId: unidad?.id ?? '',
      unidadNombre: insumo.unidad,
    })
    setEditandoFilaId(insumo.id)
  }

  // Actualiza un campo de la fila que se está editando o agregando
  const handleChange = (campo, valor) => {
    if (editandoFilaId !== null) {
      setFilaEditando((prev) => ({ ...prev, [campo]: valor }))
    } else {
      setNuevaFila((prev) => ({ ...prev, [campo]: valor }))
    }
  }

  // Confirma la fila (nueva o editada) y avisa al componente padre
  const handleConfirmar = () => {
    const fila = editandoFilaId !== null ? filaEditando : nuevaFila

    // No continúa si falta el insumo o la unidad, o la cantidad no es mayor que cero
    if (!fila.insumoId || !fila.unidadId || Number(fila.cantidad) <= 0) return
    // No permite repetir un insumo que ya está en la receta
    if (insumosUsados.includes(String(fila.insumoId))) return

    if (editandoFilaId !== null) {
      // Modo edición: arma los datos actualizados y avisa al padre
      const datosActualizados = {
        idInsumo: fila.insumoId,
        insumo: fila.insumoNombre,
        cantidad: Number(fila.cantidad),
        unidad: fila.unidadNombre,
      }
      if (onEditInsumo) {
        onEditInsumo(editandoFilaId, datosActualizados)
      }
      setEditandoFilaId(null)
      setFilaEditando(null)
    } else {
      // Modo agregar: arma el insumo nuevo con el código del producto
      const filaFinal = {
        id: fila.idTemp,
        idProducto: codigoProducto,
        idInsumo: fila.insumoId,
        insumo: fila.insumoNombre,
        cantidad: Number(fila.cantidad),
        unidad: fila.unidadNombre,
      }
      if (onAgregarInsumo) {
        onAgregarInsumo(filaFinal)
      }
      setAgregandoFila(false)
    }
  }

  // Cancela la edición o la fila nueva sin guardar
  const handleCancelar = () => {
    if (editandoFilaId !== null) {
      setEditandoFilaId(null)
      setFilaEditando(null)
    } else {
      setAgregandoFila(false)
    }
  }

  // Devuelve todo lo que necesita el componente para dibujar la tabla
  return {
    agregandoFila,
    editandoFilaId,
    nuevaFila,
    filaEditando,
    insumosCatalogo,
    unidadesMedida,
    insumosUsados,
    loading,
    handleAgregarClick,
    handleEditarClick,
    handleChange,
    handleConfirmar,
    handleCancelar,
  }
}
