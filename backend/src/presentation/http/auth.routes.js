import { Router } from 'express'
import { z } from 'zod'
import { validar } from './validar.js'

const loginBody = z.object({ email: z.string().email().max(120), password: z.string().min(1).max(128) }).strict()

export const authRouter = ({ login }) => {
  const r = Router()
  r.post('/login', validar(loginBody), (req, res, next) => login.execute(req.body).then((d) => res.json(d)).catch(next))
  return r
}