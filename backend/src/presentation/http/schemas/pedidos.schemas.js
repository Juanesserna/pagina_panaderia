import { z } from 'zod'

const opt = (s) => z.preprocess((v) => (v === '' ? undefined : v), s.optional())
const ESTADOS = ['pendiente', 'pago parcial', 'en proceso', 'completado', 'anulado']
const METODOS = ['efectivo', 'tarjeta', 'transferencia']
const CANALES = ['pagina', 'encargo', 'presencial']

export const listarPedidosQuery = z.object({
  search: opt(z.string().trim().max(100)),
  estado: opt(z.enum(ESTADOS)),
  metodo: opt(z.enum(METODOS)),
  canal: opt(z.enum(CANALES)),
  totalMin: opt(z.coerce.number().min(0)),
  totalMax: opt(z.coerce.number().min(0)),
  fechaDesde: opt(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')),
  fechaHasta: opt(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(8),
  sortKey: z.enum(['id', 'total', 'fecha', 'fechaHora']).default('id'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
}).strict()

export const idPedidoParam = z.object({
  id: z.string().trim().min(1).max(20),
}).strict()

export const crearPedidoBody = z.object({
  clienteNit: z.string().trim().max(20).optional(),
  cliente: z.string().trim().max(100).optional(),
  metodo: z.enum(METODOS).default('transferencia'),
  pagoUnico: z.boolean().default(false),
  canal: z.enum(CANALES).default('encargo'),
  notas: z.string().trim().max(500).optional().default(''),
  items: z.array(z.object({
    nombre: z.string().trim().min(1).max(100),
    cantidad: z.number().int().min(1).max(1000),
    precio: z.number().min(0).optional(),
  })).min(1, 'El pedido debe incluir al menos un producto'),
}).strict()

export const cambiarEstadoPedidoBody = z.object({
  estado: z.enum(ESTADOS, { errorMap: () => ({ message: 'Estado inválido. Valores permitidos: pendiente, pago parcial, en proceso, completado, anulado' }) }),
  motivo: z.string().trim().max(200).optional(),
}).strict()

export const abonoPedidoParams = z.object({
  id: z.string().trim().min(1).max(20),
  slot: z.coerce.number().int().min(1).max(2),
}).strict()

export const abonoPedidoBody = z.object({
  urlComprobante: z.string().min(5, 'Comprobante requerido'),
  monto: z.coerce.number().min(0).optional(),
}).strict()

