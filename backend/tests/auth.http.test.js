import './setupEnv.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { createApp } from '../src/main/app.js'
import { buildContainer } from '../src/main/container.js'

const crearApp = async () => createApp(await buildContainer())

// token firmado a mano con los mismos parámetros que JwtTokenService
const firmarToken = (rol, extra = {}) =>
  jwt.sign({ nombre: 'Test', rol }, process.env.JWT_SECRET, {
    algorithm: 'HS256', subject: '1', issuer: 'al-horno', audience: 'al-horno-web', expiresIn: '5m', ...extra,
  })

const loginAdmin = (app) =>
  request(app).post('/api/auth/login').send({
    email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD,
  })

test('sin token → 401', async () => {
  const r = await request(await crearApp()).get('/api/ventas')
  assert.equal(r.status, 401)
})

test('token con alg:none → 401', async () => {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const falso = `${b64({ alg: 'none', typ: 'JWT' })}.${b64({ sub: '1', rol: 'admin' })}.`
  const r = await request(await crearApp()).get('/api/ventas').set('Authorization', `Bearer ${falso}`)
  assert.equal(r.status, 401)
})

test('login correcto devuelve token', async () => {
  const r = await loginAdmin(await crearApp())
  assert.equal(r.status, 200)
  assert.ok(r.body.token)
  assert.equal(r.body.usuario.rol, 'admin')
})

test('login con contraseña incorrecta → 401', async () => {
  const r = await request(await crearApp()).post('/api/auth/login')
    .send({ email: process.env.SEED_ADMIN_EMAIL, password: 'incorrecta' })
  assert.equal(r.status, 401)
  assert.equal(r.body.code, 'AUTH_ERROR')
})

test('login con email inexistente → 401 (mismo error)', async () => {
  const r = await request(await crearApp()).post('/api/auth/login')
    .send({ email: 'nadie@test.local', password: 'loquesea' })
  assert.equal(r.status, 401)
  assert.equal(r.body.message, 'Credenciales inválidas')
})

test('token expirado → TOKEN_EXPIRED', async () => {
  const expirado = firmarToken('admin', { expiresIn: -10 })
  const r = await request(await crearApp()).get('/api/ventas').set('Authorization', `Bearer ${expirado}`)
  assert.equal(r.status, 401)
  assert.equal(r.body.code, 'TOKEN_EXPIRED')
})

test('token válido accede a /api/ventas → 200', async () => {
  const app = await crearApp()
  const { body } = await loginAdmin(app)
  const r = await request(app).get('/api/ventas').set('Authorization', `Bearer ${body.token}`)
  assert.equal(r.status, 200)
})

test('cantidad: "abc" → 400', async () => {
  const app = await crearApp()
  const r = await request(app).post('/api/ventas')
    .set('Authorization', `Bearer ${firmarToken('admin')}`)
    .send({ clienteNit: '123456789', metodo: 'efectivo', items: [{ nombre: 'Croissant', cantidad: 'abc' }] })
  assert.equal(r.status, 400)
  assert.equal(r.body.code, 'VALIDATION_ERROR')
})

test('?search[]=x → 400, no 500', async () => {
  const r = await request(await crearApp()).get('/api/ventas?search[]=x')
    .set('Authorization', `Bearer ${firmarToken('admin')}`)
  assert.equal(r.status, 400)
})

test('pageSize=99999 → 400', async () => {
  const r = await request(await crearApp()).get('/api/ventas?pageSize=99999')
    .set('Authorization', `Bearer ${firmarToken('admin')}`)
  assert.equal(r.status, 400)
})

test('rol sin permiso en PATCH /estado → 403', async () => {
  const r = await request(await crearApp()).patch('/api/ventas/1/estado')
    .set('Authorization', `Bearer ${firmarToken('cliente')}`)
    .send({ estado: 'cancelado' })
  assert.equal(r.status, 403)
  assert.equal(r.body.code, 'FORBIDDEN')
})