import './setupEnv.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { createApp } from '../src/main/app.js'
import { buildContainer } from '../src/main/container.js'

const crearApp = async () => createApp(await buildContainer())

const firmarToken = (rol, extra = {}) =>
  jwt.sign({ nombre: 'Test', rol }, process.env.JWT_SECRET, {
    algorithm: 'HS256', subject: '1', issuer: 'al-horno', audience: 'al-horno-web', expiresIn: '5m', ...extra,
  })

const loginAdmin = async (app) =>
  request(app).post('/api/auth/login').send({
    email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD,
  })

test('GET /api/productos sin token → 401', async () => {
  const r = await request(await crearApp()).get('/api/productos')
  assert.equal(r.status, 401)
})

test('POST /api/productos con imagen válida → 201', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const r = await request(app).post('/api/productos')
    .set('Authorization', `Bearer ${body.token}`)
    .send({
      nombre: 'Pan Integral',
      categoria: 'Panadería',
      precio: 4000,
      stock: 20,
      estado: 'ACTIVO',
      imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    })
  assert.equal(r.status, 201)
  assert.equal(r.body.nombre, 'Pan Integral')
})

test('POST /api/productos con imagen javascript: → 400', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const r = await request(app).post('/api/productos')
    .set('Authorization', `Bearer ${body.token}`)
    .send({
      nombre: 'Producto Malo',
      categoria: 'Panadería',
      precio: 1000,
      stock: 5,
      estado: 'ACTIVO',
      imagen: 'javascript:alert(1)',
    })
  assert.equal(r.status, 400)
  assert.equal(r.body.code, 'VALIDATION_ERROR')
})

test('PUT /api/productos/:id → 200', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const creado = await request(app).post('/api/productos')
    .set('Authorization', `Bearer ${body.token}`)
    .send({
      nombre: 'Para Actualizar',
      categoria: 'Panadería',
      precio: 3000,
      stock: 10,
      estado: 'ACTIVO',
    })
  const r = await request(app).put(`/api/productos/${creado.body.id}`)
    .set('Authorization', `Bearer ${body.token}`)
    .send({ nombre: 'Actualizado', precio: 3500 })
  assert.equal(r.status, 200)
  assert.equal(r.body.nombre, 'Actualizado')
  assert.equal(r.body.precio, 3500)
})

test('PATCH /api/productos/:id/estado → 200', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const creado = await request(app).post('/api/productos')
    .set('Authorization', `Bearer ${body.token}`)
    .send({
      nombre: 'Para Cambiar Estado',
      categoria: 'Panadería',
      precio: 2000,
      stock: 5,
      estado: 'ACTIVO',
    })
  const r = await request(app).patch(`/api/productos/${creado.body.id}/estado`)
    .set('Authorization', `Bearer ${body.token}`)
    .send({ estado: 'INACTIVO' })
  assert.equal(r.status, 200)
  assert.equal(r.body.estado, 'INACTIVO')
})

test('DELETE /api/productos/:id → 204', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const creado = await request(app).post('/api/productos')
    .set('Authorization', `Bearer ${body.token}`)
    .send({
      nombre: 'Para Eliminar',
      categoria: 'Panadería',
      precio: 1000,
      stock: 1,
      estado: 'ACTIVO',
    })
  const r = await request(app).delete(`/api/productos/${creado.body.id}`)
    .set('Authorization', `Bearer ${body.token}`)
  assert.equal(r.status, 204)
})

test('GET /api/productos/:id inexistente → 404', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const r = await request(app).get('/api/productos/999999')
    .set('Authorization', `Bearer ${body.token}`)
  assert.equal(r.status, 404)
  assert.equal(r.body.code, 'NOT_FOUND')
})

const crearProd = (app, token, extra) =>
  request(app).post('/api/productos')
    .set('Authorization', `Bearer ${token}`)
    .send({ categoria: 'Panadería', stock: 10, ...extra })

const INSUMO = { origen: 'INSUMO', idComponente: 1, nombre: 'Harina', cantidad: 1, unidad: 'kg' }
const compProducto = (p, cantidad = 0.1) => ({ origen: 'PRODUCTO', idComponente: p.id, nombre: p.nombre, cantidad, unidad: 'kg' })

test('Intermedio no vendible se crea sin precio y recibe código PI → 201', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const r = await crearProd(app, body.token, { nombre: 'Masa X', tipo: 'INTERMEDIO', esVendible: false })
  assert.equal(r.status, 201)
  assert.equal(r.body.esVendible, false)
  assert.match(r.body.codigo, /^PI-/)
})

test('Terminado no vendible → 400', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const r = await crearProd(app, body.token, { nombre: 'Pastel malo', tipo: 'TERMINADO', esVendible: false, precio: 1000 })
  assert.equal(r.status, 400)
})

test('Producto vendible sin precio → 400', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const r = await crearProd(app, body.token, { nombre: 'Sin precio', precio: 0 })
  assert.equal(r.status, 400)
})

test('Nombre duplicado (sin distinguir mayúsculas) → 400', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  await crearProd(app, body.token, { nombre: 'Masa Dup', tipo: 'INTERMEDIO', esVendible: false })
  const r = await crearProd(app, body.token, { nombre: 'masa dup', tipo: 'INTERMEDIO', esVendible: false })
  assert.equal(r.status, 400)
})

test('El tipo no se puede modificar → 400', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const masa = await crearProd(app, body.token, { nombre: 'Masa Tipo', tipo: 'INTERMEDIO', esVendible: false })
  const r = await request(app).put(`/api/productos/${masa.body.id}`)
    .set('Authorization', `Bearer ${body.token}`)
    .send({ tipo: 'TERMINADO' })
  assert.equal(r.status, 400)
})

test('Un Terminado no puede ser componente de otra receta → 400', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const a = await crearProd(app, body.token, { nombre: 'Pastel A', precio: 5000 })
  const r = await crearProd(app, body.token, { nombre: 'Pastel B', precio: 5000, receta: [compProducto(a.body)] })
  assert.equal(r.status, 400)
})

test('Un Intermedio no puede contener otros productos en su receta → 400', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const a = await crearProd(app, body.token, { nombre: 'Masa A', tipo: 'INTERMEDIO', esVendible: false, receta: [INSUMO] })
  const r = await crearProd(app, body.token, {
    nombre: 'Masa B', tipo: 'INTERMEDIO', esVendible: false, receta: [compProducto(a.body)],
  })
  assert.equal(r.status, 400)
})

test('Un Intermedio usado en una receta no se elimina ni se inactiva', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const auth = { Authorization: `Bearer ${body.token}` }
  const masa = await crearProd(app, body.token, { nombre: 'Masa Uso', tipo: 'INTERMEDIO', esVendible: false, receta: [INSUMO] })
  const pastel = await crearProd(app, body.token, { nombre: 'Pastel Uso', precio: 5000, receta: [compProducto(masa.body)] })
  assert.equal(pastel.status, 201)

  const del = await request(app).delete(`/api/productos/${masa.body.id}`).set(auth)
  assert.equal(del.status, 400)
  const inact = await request(app).patch(`/api/productos/${masa.body.id}/estado`).set(auth).send({ estado: 'INACTIVO' })
  assert.equal(inact.status, 400)

  await request(app).delete(`/api/productos/${pastel.body.id}`).set(auth)
  const inact2 = await request(app).patch(`/api/productos/${masa.body.id}/estado`).set(auth).send({ estado: 'INACTIVO' })
  assert.equal(inact2.status, 200)
})

test('Agotado se calcula por stock cero', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const r = await crearProd(app, body.token, { nombre: 'Sin stock', precio: 1000, stock: 0 })
  assert.equal(r.status, 201)
  assert.equal(r.body.estado, 'AGOTADO')
  assert.equal(r.body.activo, true)
})

test('GET /api/productos filtra por tipo y por vendible', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const auth = { Authorization: `Bearer ${body.token}` }
  const inter = await request(app).get('/api/productos?tipo=INTERMEDIO').set(auth)
  assert.equal(inter.status, 200)
  assert.ok(inter.body.items.length >= 2)
  assert.ok(inter.body.items.every((p) => p.tipo === 'INTERMEDIO'))
  const noVend = await request(app).get('/api/productos?esVendible=false').set(auth)
  assert.equal(noVend.status, 200)
  assert.ok(noVend.body.items.length >= 1)
  assert.ok(noVend.body.items.every((p) => p.esVendible === false))
})

test('El estado AGOTADO no se acepta al crear ni al cambiar estado → 400', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const malo = await crearProd(app, body.token, { nombre: 'Estado malo', precio: 1000, estado: 'AGOTADO' })
  assert.equal(malo.status, 400)
  const ok = await crearProd(app, body.token, { nombre: 'Estado ok', precio: 1000 })
  const r = await request(app).patch(`/api/productos/${ok.body.id}/estado`)
    .set('Authorization', `Bearer ${body.token}`)
    .send({ estado: 'AGOTADO' })
  assert.equal(r.status, 400)
})
