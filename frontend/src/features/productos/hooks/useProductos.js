import { useState, useEffect, useCallback } from 'react';
import { productosApi } from '../api/productosApi';

function mapearProductoFrontend(p) {
  return {
    id: p.id,
    codigo: p.codigo ?? `PR-${p.id}`,
    nombre: p.nombre,
    categoria: p.categoria,
    precioVenta: Number(p.precioVenta),
    stock: Number(p.stockActual ?? p.stock),
    stockMinimo: p.stockMinimo == null ? undefined : Number(p.stockMinimo),
    cantMinimaProduccion: p.cantMinimaProduccion == null ? undefined : Number(p.cantMinimaProduccion),
    cantMaximaProduccion: p.cantMaximaProduccion == null ? undefined : Number(p.cantMaximaProduccion),
    estado: p.activo !== undefined ? (p.activo ? 'Activo' : 'Agotado') : (p.estado || 'Activo'),
    imagenUrl: p.imagenUrl || p.imagen,
    imagen: p.imagenUrl || p.imagen,
  }
}

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ buscar: '', categoria: '', estado: '', pagina: 1, limite: 10 });
  const [paginacion, setPaginacion] = useState({ total: 0, totalPaginas: 1 });

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await productosApi.obtenerProductos(filtros);
      setProductos((respuesta.datos || respuesta.items || respuesta || []).map(mapearProductoFrontend));
      if (respuesta.totalPaginas) {
        setPaginacion({ total: respuesta.total, totalPaginas: respuesta.totalPaginas });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarProductos();
  }, [cargarProductos]);

  const crearProducto = useCallback(async (datos) => {
    try {
      const nuevo = await productosApi.crearProducto(datos);
      const normalizado = mapearProductoFrontend(nuevo);
      await cargarProductos();
      return normalizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [cargarProductos]);

  const editarProducto = useCallback(async (id, datos) => {
    try {
      const actualizado = await productosApi.actualizarProducto(id, datos);
      const normalizado = mapearProductoFrontend(actualizado);
      await cargarProductos();
      return normalizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [cargarProductos]);

  const eliminarProducto = useCallback(async (id) => {
    try {
      await productosApi.eliminarProducto(id);
      await cargarProductos();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [cargarProductos]);

  const cambiarEstado = useCallback(async (id, estado) => {
    try {
      const cambiado = await productosApi.cambiarEstado(id, estado);
      const normalizado = mapearProductoFrontend(cambiado);
      await cargarProductos();
      return normalizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [cargarProductos]);

  return {
    productos,
    cargando,
    error,
    filtros,
    setFiltros,
    paginacion,
    crearProducto,
    editarProducto,
    eliminarProducto,
    cambiarEstado,
    recargar: cargarProductos,
  };
}
