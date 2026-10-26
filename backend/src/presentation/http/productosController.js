export function crearProductosRouter({ listarProductos, crearProducto, obtenerProducto }) {
  const express = require('express');
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const resultado = await listarProductos.execute(req.query);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const nuevoProducto = await crearProducto.execute(req.body);
      res.status(201).json(nuevoProducto);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}