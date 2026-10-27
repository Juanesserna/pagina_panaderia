import test from 'node:test'
import assert from 'node:assert/strict'
import { buildContainer } from '../src/main/container.js'

const usuario = { nombre: 'Andrea Gómez', nit: '1020304050' }

test('listar: filtra, ordena y pagina', async () => {
  const { ventas } = buildContainer()
  const r = await ventas.listarVentas.execute({ estado: 'completado', page: 1, pageSize: 3 })
  assert.equal(r.items.length, 3)
  assert.ok(r.total > 3)
  assert.equal(r.items[0].id, '#2851') // orden desc por id
})

test('transiciones: completado solo puede ir a cancelado', async () => {
  const { ventas } = buildContainer()
  await assert.rejects(ventas.cambiarEstadoVenta.execute({ id: '#2851', estado: 'pendiente' }), { code: 'TRANSICION_INVALIDA' })
  const v = await ventas.cambiarEstadoVenta.execute({ id: '#2851', estado: 'cancelado' })
  assert.equal(v.estado, 'cancelado')
  await assert.rejects(ventas.cambiarEstadoVenta.execute({ id: '#2851', estado: 'completado' }), { code: 'TRANSICION_INVALIDA' })
})

test('crear: calcula total en servidor, siguiente id, rechaza sin stock', async () => {
  const { ventas } = buildContainer()
  const v = await ventas.crearVenta.execute({ usuario, clienteNit: '1085822412', metodo: 'efectivo', items: [{ nombre: 'Croissant', cantidad: 2 }, { nombre: 'Baguette', cantidad: 1 }] })
  assert.equal(v.id, '#2852')
  assert.equal(v.total, 34)
  assert.equal(v.productos, 3)
  assert.equal(v.estado, 'pendiente')
  await assert.rejects(ventas.crearVenta.execute({ usuario, clienteNit: '1085822412', metodo: 'efectivo', items: [{ nombre: 'Pan francés', cantidad: 1 }] }), { code: 'SIN_STOCK' })
})

test('abonos: encargo en 2 pagos pasa a "pago parcial" y calcula saldo', async () => {
  const { ventas } = buildContainer()
  let v = await ventas.registrarAbono.execute({ id: '#2848', slot: 1, urlComprobante: 'data:image/png;base64,AAA' })
  assert.equal(v.estado, 'pago parcial')
  assert.deepEqual([v.resumenPagos().totalAbonado, v.resumenPagos().saldoPendiente], [170, 170])
  v = await ventas.registrarAbono.execute({ id: '#2848', slot: 2, urlComprobante: 'data:image/png;base64,BBB' })
  assert.equal(v.resumenPagos().saldoPendiente, 0)
  await assert.rejects(ventas.registrarAbono.execute({ id: '#2851', slot: 2, urlComprobante: 'x' }), { code: 'VALIDATION_ERROR' })
})
