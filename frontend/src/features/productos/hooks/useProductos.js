import { useState, useEffect, useCallback } from 'react';
import { productosApi } from '../api/productosApi';

// Mantiene tu función original de mapeo para los modales
function mapFormDataToProducto(datos) {
  return {
    id: datos.id,
    codigo: datos.codigo,
    nombre: datos.nombre,
    categoria: datos.categoria,
    precioVenta: Number(datos.precioVenta),
    stock: Number(datos.stockActual ?? datos.stock),
    stockMinimo: Number(datos.stockMinimo),
    cantMinimaProduccion: Number(datos.cantMinimaProduccion),
    cantMaximaProduccion: Number(datos.cantMaximaProduccion),
    estado: datos.activo !== undefined ? (datos.activo ? 'Activo' : 'Agotado') : (datos.estado || 'Activo'),
    imagenUrl: datos.imagen || datos.imagenUrl,
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
      // Asume que el backend devuelve { datos, total, pagina, totalPaginas }
      setProductos(respuesta.datos || respuesta);
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
    cargarProductos();
  }, [cargarProductos]);

  const crearProducto = useCallback(async (datos) => {
    try {
      const datosMapeados = mapFormDataToProducto({
        ...datos,
        id: datos.id ?? Date.now(),
        codigo: datos.codigo ?? `PR-${Math.floor(Math.random() * 900) + 100}`,
      });
      const nuevo = await productosApi.crearProducto(datosMapeados);
      await cargarProductos(); // Refresca la lista desde el servidor
      return nuevo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [cargarProductos]);

  const editarProducto = useCallback(async (id, datos) => {
    try {
      const datosMapeados = mapFormDataToProducto({ ...datos, id, codigo: datos.codigo });
      await productosApi.actualizarProducto(id, datosMapeados);
      await cargarProductos();
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
      await productosApi.cambiarEstado(id, estado);
      await cargarProductos();
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