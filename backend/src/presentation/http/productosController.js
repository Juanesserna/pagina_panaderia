import express from 'express';

export function crearProductosRouter({ listarProductos, crearProducto, actualizarProducto, cambiarEstadoProducto, eliminarProducto }) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const resultado = await listarProductos.execute(req.query);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async (req, res) => {
    try {
      const nuevoProducto = await crearProducto.execute(req.body);
      res.status(201).json(nuevoProducto);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const producto = await actualizarProducto.execute(req.params.id, req.body);
      res.json(producto);
    } catch (err) {
      if (err.message.includes('no encontrado')) {
        return res.status(404).json({ error: err.message });
      }
      res.status(400).json({ error: err.message });
    }
  });

  router.patch('/:id/estado', async (req, res) => {
    try {
      const { estado } = req.body || {};
      const producto = await cambiarEstadoProducto.execute(req.params.id, estado);
      res.json(producto);
    } catch (err) {
      if (err.message.includes('no encontrado')) {
        return res.status(404).json({ error: err.message });
      }
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await eliminarProducto.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      if (err.message.includes('no encontrado')) {
        return res.status(404).json({ error: err.message });
      }
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}

