// Importa los hooks de estado y efecto de React
import { useState, useEffect } from 'react'
// Importa las funciones que traen el catálogo de insumos y las unidades de medida
import { fetchInsumos, getUnidadesMedida } from '@features/insumos'

// Hook con toda la lógica de la tabla de receta: estados, catálogos y handlers
export default function useRecetaTabla({ onAgregarInsumo, onEditInsumo, codigoProducto }) {
  // Indica si se está mostrando la fila para agregar un insumo nuevo
  const [agregandoFila, setAgregandoFila] = useState(false)
  // Guarda el id del insumo que se está editando (null si ninguno)
  const [editandoFilaId, setEditandoFilaId] = useState(null)
  // Datos de la fila nueva que se está llenando
  const [nuevaFila, setNuevaFila] = useState({
    idTemp: null,
    insumoId: '',
    insumoNombre: '',
    cantidad: 0,
    unidadId: '',
    unidadNombre: '',
  })
  // Datos de la fila que se está editando
  const [filaEditando, setFilaEditando] = useState(null)
  // Catálogo de insumos disponibles
  const [insumosCatalogo, setInsumosCatalogo] = useState([])
  // Lista de unidades de medida disponibles
  const [unidadesMedida, setUnidadesMedida] = useState([])
  // Indica si los catálogos todavía están cargando
  const [loading, setLoading] = useState(true)

  // Al montar, carga los catálogos de insumos y unidades
  useEffect(() => {
    // Función asíncrona que trae ambos catálogos a la vez
    const cargarCatalogos = async () => {
      try {
        // Espera el catálogo de insumos y las unidades de medida
        const [insumosData, unidadesData] = await Promise.all([
          fetchInsumos(),
          Promise.resolve(getUnidadesMedida()),
        ])
        // Guarda el catálogo de insumos
        setInsumosCatalogo(insumosData)
        // Guarda las unidades de medida
        setUnidadesMedida(unidadesData)
      } catch (error) {
        // Si falla, lo muestra en la consola
        console.error('Error cargando catálogos:', error)
      } finally {
        // Siempre termina el estado de carga
        setLoading(false)
      }
    }
    // Ejecuta la carga
    cargarCatalogos()
  }, [])

  // Se ejecuta al pulsar "Agregar insumo": prepara una fila nueva vacía
  const handleAgregarClick = () => {
    setNuevaFila({
      idTemp: Date.now(),
      insumoId: '',
      insumoNombre: '',
      cantidad: 0,
      unidadId: '',
      unidadNombre: '',
    })
    // Muestra la fila nueva
    setAgregandoFila(true)
  }

  // Se ejecuta al pulsar el lápiz de un insumo: prepara la fila para editar
  const handleEditarClick = (insumo) => {
    // Busca el insumo en el catálogo
    const insumoSeleccionado = insumosCatalogo.find((i) => i.id === insumo.idInsumo)
    // Busca la unidad según la abreviatura guardada
    const unidad = insumoSeleccionado ? unidadesMedida.find((u) => u.abreviatura === insumo.unidad) : null

    // Carga los datos del insumo en la fila de edición
    setFilaEditando({
      id: insumo.id,
      idTemp: insumo.id,
      insumoId: insumo.idInsumo,
      insumoNombre: insumo.insumo,
      cantidad: insumo.cantidad,
      unidadId: unidad?.id || '',
      unidadNombre: insumo.unidad,
    })
    // Marca cuál fila se está editando
    setEditandoFilaId(insumo.id)
  }

  // Actualiza un campo de la fila que se está editando o agregando
  const handleChange = (campo, valor) => {
    // Si hay una fila en edición, actualiza esa
    if (editandoFilaId !== null) {
      setFilaEditando((prev) => ({ ...prev, [campo]: valor }))
    } else {
      // Si no, actualiza la fila nueva
      setNuevaFila((prev) => ({ ...prev, [campo]: valor }))
    }
  }

  // Confirma la fila (nueva o editada) y avisa al componente padre
  const handleConfirmar = () => {
    // Elige la fila activa según el modo
    const fila = editandoFilaId !== null ? filaEditando : nuevaFila

    // No continúa si falta el insumo o la cantidad no es mayor que cero
    if (!fila.insumoId || Number(fila.cantidad) <= 0) return

    // Modo edición
    if (editandoFilaId !== null) {
      // Arma los datos actualizados del insumo
      const datosActualizados = {
        idInsumo: fila.insumoId,
        insumo: fila.insumoNombre,
        cantidad: Number(fila.cantidad),
        unidad: fila.unidadNombre,
      }
      // Avisa al padre del cambio
      if (onEditInsumo) {
        onEditInsumo(editandoFilaId, datosActualizados)
      }
      // Sale del modo edición
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

      // Avisa al padre del nuevo insumo
      if (onAgregarInsumo) {
        onAgregarInsumo(filaFinal)
      }
      // Oculta la fila nueva
      setAgregandoFila(false)
    }
  }

  // Cancela la edición o la fila nueva sin guardar
  const handleCancelar = () => {
    if (editandoFilaId !== null) {
      // Sale del modo edición
      setEditandoFilaId(null)
      setFilaEditando(null)
    } else {
      // Oculta la fila nueva
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
    loading,
    handleAgregarClick,
    handleEditarClick,
    handleChange,
    handleConfirmar,
    handleCancelar,
  }
}
