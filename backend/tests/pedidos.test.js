import './setupEnv.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { buildContainer } from '../src/main/container.js'
import { ESTADOS_PEDIDO } from '../src/domain/pedidos/constants.js'

const usuario = { nombre: 'Andrea Gómez', nit: '1020304050' }

test('Pedidos - Listado: filtra, ordena y pagina correctamente', async () => {
  const { pedidos } = await buildContainer()
  const r = await pedidos.listarPedidos.execute({ page: 1, pageSize: 3 })
  assert.equal(r.items.length, 3)
  assert.ok(r.total >= 5)
})

test('Pedidos - Tarea 2: Estado inicial predeterminado es "pendiente"', async () => {
  const { pedidos } = await buildContainer()
  const nuevo = await pedidos.crearPedido.execute({
    usuario,
    clienteNit: '1085822412',
    metodo: 'transferencia',
    items: [
      { nombre: 'Croissant', cantidad: 3, precio: 12.0 },
      { nombre: 'Baguette', cantidad: 2, precio: 10.0 },
    ],
  })

  assert.equal(nuevo.estado, ESTADOS_PEDIDO.PENDIENTE)
  assert.equal(nuevo.total, 56)
  assert.equal(nuevo.productos, 5)
  assert.equal(nuevo.historialEstados.length, 1)
  assert.equal(nuevo.historialEstados[0].estado, ESTADOS_PEDIDO.PENDIENTE)
})

test('Pedidos - Tarea 4: Reemplazar "Cancelado" por "Anulado" y bloquear modificaciones', async () => {
  const { pedidos } = await buildContainer()
  // ID 104 ya viene en estado 'anulado' en el seed
  const pedidoAnulado = await pedidos.obtenerPedido.execute({ id: '104' })
  assert.equal(pedidoAnulado.estado, 'anulado')

  // Intentar cambiar el estado de un pedido ya anulado DEBE ser rechazado
  await assert.rejects(
    pedidos.cambiarEstadoPedido.execute({ id: '104', estado: 'pendiente' }),
    { code: 'TRANSICION_INVALIDA' }
  )

  await assert.rejects(
    pedidos.cambiarEstadoPedido.execute({ id: '104', estado: 'en proceso' }),
    { code: 'TRANSICION_INVALIDA' }
  )

  // Pedido en proceso puede anularse
  const pedidoEnProceso = await pedidos.obtenerPedido.execute({ id: '101' })
  assert.equal(pedidoEnProceso.estado, 'en proceso')
  const actualizado = await pedidos.cambiarEstadoPedido.execute({ id: '101', estado: 'anulado', motivo: 'Cancelación solicitada por cliente' })
  assert.equal(actualizado.estado, 'anulado')

  // Y una vez anulado, ya no puede cambiar a otro estado
  await assert.rejects(
    pedidos.cambiarEstadoPedido.execute({ id: '101', estado: 'en proceso' }),
    { code: 'TRANSICION_INVALIDA' }
  )
})

test('Pedidos - Tarea 5: Resumen financiero dinámico sin abonos y con abonos', async () => {
  const { pedidos } = await buildContainer()

  // 1. Sin abonos (103)
  const sinAbonos = await pedidos.obtenerPedido.execute({ id: '103' })
  const res1 = sinAbonos.resumenFinanciero()
  assert.equal(res1.totalPagado, 0)
  assert.equal(res1.diferenciaPorPagar, sinAbonos.total)
  assert.equal(res1.estaPagadoTotalmente, false)

  // 2. Con abonos (101 tiene total 320 y 1 abono de 160)
  const conAbono = await pedidos.obtenerPedido.execute({ id: '101' })
  const res2 = conAbono.resumenFinanciero()
  assert.equal(res2.totalPagado, 160)
  assert.equal(res2.diferenciaPorPagar, 160)
  assert.equal(res2.porcentajePagado, 50)

  // 3. Actualización automática e inmediata al registrar un nuevo abono
  const pedidoActualizado = await pedidos.registrarAbonoPedido.execute({
    id: '103',
    slot: 1,
    urlComprobante: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    monto: 105.0,
  })

  const res3 = pedidoActualizado.resumenFinanciero()
  assert.equal(res3.totalPagado, 105.0)
  assert.equal(res3.diferenciaPorPagar, 105.0)
  assert.equal(res3.cantidadAbonos, 1)
})

