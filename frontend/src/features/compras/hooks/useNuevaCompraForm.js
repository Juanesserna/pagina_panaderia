import { useState } from 'react'
import { ESTADO } from '../constants/compras.constants'
import {
  buscarInsumo,
  calcularSubtotal,
  construirCompra,
  crearItemVacio,
  fechaHoyFormateada,
  itemsSonValidos,
  siguienteIdCompra,
} from '../utils/comprasHelpers'

// Estado del formulario "Nueva orden de compra".
// Se usa dentro de un componente que se monta cada vez que el modal se abre,
// así el formulario siempre arranca limpio (sin efectos de "reset").
export function useNuevaCompraForm({ compras, proveedores, insumos, solicitanteInicial }) {
  // id y fecha los pone el sistema (el usuario no los edita)
  const [meta] = useState(() => ({ id: siguienteIdCompra(compras), fecha: fechaHoyFormateada() }))

  const [form, setForm] = useState(() => ({
    estado: ESTADO.PENDIENTE,
    proveedorId: proveedores[0]?.id ?? '',
    descuento: 0,
    solicitante: solicitanteInicial,
    items: [crearItemVacio(insumos)],
  }))

  // Bloque "Trazabilidad del lote" abierto por ítem (clave = n.º de lote). El primer ítem arranca abierto.
  const [lotesAbiertos, setLotesAbiertos] = useState(() => ({ [form.items[0].lote]: true }))

  const cambiarCampo = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }))

  const cambiarItem = (idx, campo, valor) =>
    setForm((prev) => {
      const items = [...prev.items]
      const actual = { ...items[idx], [campo]: valor }
      // La unidad no se escribe a mano: se hereda del insumo elegido
      if (campo === 'nombre') {
        const insumo = buscarInsumo(insumos, valor)
        if (insumo) actual.unidad = insumo.unidad
      }
      items[idx] = actual
      return { ...prev, items }
    })

  const agregarItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, crearItemVacio(insumos)] }))

  const quitarItem = (idx) => {
    if (form.items.length <= 1) return
    const lote = form.items[idx].lote
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))
    setLotesAbiertos((prev) => {
      const siguiente = { ...prev }
      delete siguiente[lote]
      return siguiente
    })
  }

  const alternarLote = (lote) => setLotesAbiertos((prev) => ({ ...prev, [lote]: !prev[lote] }))

  const subtotalBruto = form.items.reduce((suma, i) => suma + i.cantidad * i.precioUnitario, 0)
  const subtotal = calcularSubtotal(form.items)
  const descuento = form.descuento || 0
  const montoDescontadoGeneral = Math.round(subtotal * descuento / 100)
  const total = subtotal - montoDescontadoGeneral
  // Monto total descontado: diferencia entre el bruto antes de descuentos y el total final
  const totalDescontado = subtotalBruto - total

  const construir = () => construirCompra({ ...meta, ...form, insumos })

  return {
    meta,
    form,
    lotesAbiertos,
    total,
    totalDescontado,
    esValido: itemsSonValidos(form.items),
    cambiarCampo,
    cambiarItem,
    agregarItem,
    quitarItem,
    alternarLote,
    construir,
  }
}
