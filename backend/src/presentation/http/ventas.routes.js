import { Router } from 'express'
import { presentarVenta } from './ventaPresenter.js'
import { validar } from './validar.js'
import { requireRol } from './auth.middleware.js'
import {
  listarQuery, idParam, crearBody, estadoBody, abonoParams, abonoBody,
} from './schemas/ventas.schemas.js'

const normalizarId = (p) => (p.startsWith('#') ? p : `#${p}`)

export function ventasRouter({ listarVentas, obtenerVenta, crearVenta, cambiarEstadoVenta, registrarAbono }) {
  const r = Router()
  const wrap = (fn) => (req, res, next) => fn(req, res).catch(next)

  r.get('/', validar(listarQuery, 'query'), wrap(async (req, res) => {
    const { items, ...meta } = await listarVentas.execute(req.query)
    res.json({ ...meta, items: items.map((v) => presentarVenta(v)) })
  }))

  r.get('/:id', validar(idParam, 'params'), wrap(async (req, res) => {
    const venta = await obtenerVenta.execute({ id: normalizarId(req.params.id) })
    res.json(presentarVenta(venta, { detalle: true }))
  }))

  r.post('/', validar(crearBody), wrap(async (req, res) => {
    const venta = await crearVenta.execute({ ...req.body, usuario: req.usuario })
    res.status(201).json(presentarVenta(venta, { detalle: true }))
  }))

  r.patch('/:id/estado',
    requireRol('admin', 'vendedor'),
    validar(idParam, 'params'),
    validar(estadoBody),
    wrap(async (req, res) => {
      const venta = await cambiarEstadoVenta.execute({ id: normalizarId(req.params.id), estado: req.body.estado })
      res.json(presentarVenta(venta, { detalle: true }))
    }))

  // TODO: pasar a multipart/form-data (subida real de archivo) en vez de data-URL.
  r.put('/:id/pagos/:slot',
    validar(abonoParams, 'params'),
    validar(abonoBody),
    wrap(async (req, res) => {
      const venta = await registrarAbono.execute({
        id: normalizarId(req.params.id),
        slot: req.params.slot, // ya es número: zod lo convirtió con z.coerce
        urlComprobante: req.body.urlComprobante,
      })
      res.json(presentarVenta(venta, { detalle: true }))
    }))

  return r
}