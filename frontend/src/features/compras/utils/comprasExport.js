// Exportación de compras registradas a Excel/PDF.
// Filtra por rango de fechas (dd/mm/yyyy de la compra) y descarga el archivo.
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { etiquetaProveedor, formatearMoneda, parseFechaCompra } from './comprasHelpers'

export function filtrarComprasPorRango(compras, fechaDesde, fechaHasta) {
  const desde = fechaDesde ? new Date(`${fechaDesde}T00:00:00`) : null
  const hasta = fechaHasta ? new Date(`${fechaHasta}T23:59:59`) : null
  return compras.filter((c) => {
    if (!desde && !hasta) return true
    const fecha = parseFechaCompra(c)
    if (desde && fecha < desde) return false
    if (hasta && fecha > hasta) return false
    return true
  })
}

function filasCompras(compras, proveedores) {
  return compras.map((c) => ({
    'ID orden': c.id,
    'Fecha': c.fecha,
    'Fecha factura': c.fechaFactura || '',
    'Hora facturación': c.horaFacturacion || '',
    'Número de factura': c.numeroFactura || '',
    'Proveedor': etiquetaProveedor(proveedores, c.proveedorId),
    'Categoría': c.categoria || '',
    'Estado': c.estado || '',
    'Solicitante': c.solicitante || '',
    'Cantidad ítems': c.detalle?.length ?? 0,
    'Subtotal': c.detalle?.reduce((s, d) => s + (d.subtotal || 0), 0) ?? 0,
    'Descuento (%)': c.descuento || 0,
    'IVA total': c.ivaTotal || 0,
    'Total': c.total || 0,
    'Notas': c.notas || '',
  }))
}

function nombreArchivo(ext, fechaDesde, fechaHasta) {
  const desde = fechaDesde || 'inicio'
  const hasta = fechaHasta || 'fin'
  return `compras_${desde}_a_${hasta}.${ext}`
}

export function exportarComprasExcel(compras, proveedores, { fechaDesde, fechaHasta }) {
  const datos = filasCompras(filtrarComprasPorRango(compras, fechaDesde, fechaHasta), proveedores)
  if (datos.length === 0) throw new Error('No hay compras en el rango seleccionado')

  const ws = XLSX.utils.json_to_sheet(datos)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Compras')

  // Hoja de detalle (una fila por ítem)
  const detalle = filtrarComprasPorRango(compras, fechaDesde, fechaHasta).flatMap((c) =>
    (c.detalle || []).map((d) => ({
      'ID orden': c.id,
      'Fecha': c.fecha,
      'Proveedor': etiquetaProveedor(proveedores, c.proveedorId),
      'Insumo': d.nombre,
      'Cantidad': d.cantidad,
      'Unidad': d.unidad,
      'Subtotal': d.subtotal,
      'Lote': d.lote || '',
      'Fecha vencimiento': d.fechaVencimiento || '',
    }))
  )
  if (detalle.length > 0) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(detalle), 'Detalle')
  }

  XLSX.writeFile(wb, nombreArchivo('xlsx', fechaDesde, fechaHasta))
}

export function exportarComprasPDF(compras, proveedores, { fechaDesde, fechaHasta }) {
  const filtradas = filtrarComprasPorRango(compras, fechaDesde, fechaHasta)
  if (filtradas.length === 0) throw new Error('No hay compras en el rango seleccionado')

  const doc = new jsPDF({ orientation: 'landscape' })
  const rango = `${fechaDesde || 'Inicio'} a ${fechaHasta || 'Fin'}`
  doc.setFontSize(14)
  doc.text('Registro de compras', 14, 16)
  doc.setFontSize(10)
  doc.text(`Rango: ${rango}  ·  Registros: ${filtradas.length}`, 14, 23)

  autoTable(doc, {
    startY: 28,
    head: [['ID', 'Fecha', 'Proveedor', 'Factura', 'Estado', 'Ítems', 'IVA', 'Total']],
    body: filtradas.map((c) => [
      String(c.id),
      c.fecha || '',
      etiquetaProveedor(proveedores, c.proveedorId),
      c.numeroFactura || '—',
      c.estado || '',
      String(c.detalle?.length ?? 0),
      formatearMoneda(c.ivaTotal || 0),
      formatearMoneda(c.total || 0),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] },
  })

  doc.save(nombreArchivo('pdf', fechaDesde, fechaHasta))
}
