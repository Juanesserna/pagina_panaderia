import { Router } from 'express'
import { presentarPedido } from './pedidoPresenter.js'
import { validar } from './validar.js'
import { requireRol } from './auth.middleware.js'
import {
  listarPedidosQuery,
  idPedidoParam,
  crearPedidoBody,
  cambiarEstadoPedidoBody,
  abonoPedidoParams,
  abonoPedidoBody,
} from './schemas/pedidos.schemas.js'

const normalizarId = (p) => String(p).trim()

export function pedidosRouter({
  listarPedidos,
  obtenerPedido,
  crearPedido,
  cambiarEstadoPedido,
  registrarAbonoPedido,
}) {
  const r = Router()
  const wrap = (fn) => (req, res, next) => fn(req, res).catch(next)

  // 1. Listado de pedidos con filtros, búsqueda y paginación
  r.get('/', validar(listarPedidosQuery, 'query'), wrap(async (req, res) => {
    const { items, ...meta } = await listarPedidos.execute(req.query)
    res.json({
      ...meta,
      items: items.map((p) => presentarPedido(p)),
    })
  }))

  // 2. Detalle individual del pedido
  r.get('/:id', validar(idPedidoParam, 'params'), wrap(async (req, res) => {
    const pedido = await obtenerPedido.execute({ id: normalizarId(req.params.id) })
    res.json(presentarPedido(pedido, { detalle: true }))
  }))

  // 3. Crear nuevo pedido (estado inicial 'pendiente' automático)
  r.post('/', validar(crearPedidoBody), wrap(async (req, res) => {
    const pedido = await crearPedido.execute({
      ...req.body,
      usuario: req.usuario,
    })
    res.status(201).json(presentarPedido(pedido, { detalle: true }))
  }))

  // 4. Cambiar estado de forma controlada (Tarea 3 y 4)
  r.patch(
    '/:id/estado',
    requireRol('admin', 'vendedor'),
    validar(idPedidoParam, 'params'),
    validar(cambiarEstadoPedidoBody),
    wrap(async (req, res) => {
      const pedido = await cambiarEstadoPedido.execute({
        id: normalizarId(req.params.id),
        estado: req.body.estado,
        usuario: req.usuario?.nombre || 'Usuario',
        motivo: req.body.motivo,
      })
      res.json(presentarPedido(pedido, { detalle: true }))
    })
  )

  // 5. Cargar comprobante de pago / abono asociado (Tarea 1 y 5)
  r.put(
    '/:id/pagos/:slot',
    validar(abonoPedidoParams, 'params'),
    validar(abonoPedidoBody),
    wrap(async (req, res) => {
      const pedido = await registrarAbonoPedido.execute({
        id: normalizarId(req.params.id),
        slot: req.params.slot,
        urlComprobante: req.body.urlComprobante,
        monto: req.body.monto,
      })
      res.json(presentarPedido(pedido, { detalle: true }))
    })
  )

  return r
}

