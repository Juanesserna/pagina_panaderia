// Entidad → JSON. Mantiene los campos que hoy consume el frontend (fecha "dd/mm/yyyy", hora "hh:mm").
const pad = (n) => String(n).padStart(2, '0')
const fecha = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
const hora = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

export const presentarVenta = (v, { detalle = false } = {}) => ({
  id: v.id, usuario: v.usuario, cliente: v.cliente, nit: v.nit, origen: v.origen, canal: v.canal,
  pagoUnico: v.pagoUnico, productos: v.productos, total: v.total, estado: v.estado, metodo: v.metodo,
  fecha: fecha(v.fechaHora), hora: hora(v.fechaHora),
  puedeVerComprobante: v.puedeVerComprobante,
  ...(detalle && {
    items: v.items,
    abonos: v.abonos.map((a) => ({ ...a, fecha: fecha(a.fecha) })),
    resumenPagos: v.resumenPagos(),
  }),
})
