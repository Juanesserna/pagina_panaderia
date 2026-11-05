import { z } from 'zod'
import { ESTADOS, METODOS } from '../../../domain/ventas/constants.js'

// el frontend puede mandar "" en filtros vacíos → se trata como ausente
const opt = (s) => z.preprocess((v) => (v === '' ? undefined : v), s.optional())
const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const listarQuery = z.object({
  search: opt(z.string().trim().max(100)),
  estado: opt(z.enum(Object.values(ESTADOS))),
  metodo: opt(z.enum(Object.values(METODOS))),
  cantidadMin: opt(z.coerce.number().int().min(0)), cantidadMax: opt(z.coerce.number().int().min(0)),
  totalMin: opt(z.coerce.number().min(0)), totalMax: opt(z.coerce.number().min(0)),
  fechaDesde: opt(fecha), fechaHasta: opt(fecha),
  sortKey: z.enum(['id', 'total']).default('id'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(8),
}).strict()

export const idParam = z.object({ id: z.string().regex(/^#?\d{1,10}$/) })

export const crearBody = z.object({
  clienteNit: z.string().regex(/^\d{5,15}$/),
  metodo: z.enum(Object.values(METODOS)),
  pagoDividido: z.boolean().default(false),
  items: z.array(z.object({
    nombre: z.string().trim().min(1).max(100),
    cantidad: z.number().int().min(1).max(1000),
  }).strict()).min(1).max(50),
}).strict()

export const estadoBody = z.object({ estado: z.enum(Object.values(ESTADOS)) }).strict()

export const abonoParams = z.object({ id: idParam.shape.id, slot: z.coerce.number().int().min(1).max(2) })
export const abonoBody = z.object({
  urlComprobante: z.string().max(2_800_000)
    .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, 'Debe ser imagen png/jpeg/webp en base64'),
}).strict()