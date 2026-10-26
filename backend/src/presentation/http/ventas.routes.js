import { Router } from 'express'
import { presentarVenta } from './ventaPresenter.js'

const normalizarId = (p) => (p.startsWith('#') ? p : `#${p}`)

export function ventasRouter({ listarVentas, obtenerVenta, crearVenta, cambiarEstadoVenta, registrarAbono }) {
  const r = Router()
  const wrap = (fn) => (req, res, next) => fn(req, res).catch(next)

  r.get('/', wrap(async (req, res) => {
    const { items, ...meta } = await listarVentas.execute(req.query)
    res.json({ ...meta, items: items.map((v) => presentarVenta(v)) })
  }))

  r.get('/:id', wrap(async (req, res) => {
    res.json(presentarVenta(await obtenerVenta.execute({ id: normalizarId(req.params.id) }), { detalle: true }))
  }))

  r.post('/', wrap(async (req, res) => {
    const venta = await crearVenta.execute({ ...req.body, usuario: req.usuario })
    res.status(201).json(presentarVenta(venta, { detalle: true }))
  }))

  r.patch('/:id/estado', wrap(async (req, res) => {
    const venta = await cambiarEstadoVenta.execute({ id: normalizarId(req.params.id), estado: req.body.estado })
    res.json(presentarVenta(venta, { detalle: true }))
  }))

  // TODO: pasar a multipart/form-data (subida real de archivo) en vez de data-URL.
  r.put('/:id/pagos/:slot', wrap(async (req, res) => {
    const venta = await registrarAbono.execute({ id: normalizarId(req.params.id), slot: Number(req.params.slot), urlComprobante: req.body.urlComprobante })
    res.json(presentarVenta(venta, { detalle: true }))
  }))

  return r
}
