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
