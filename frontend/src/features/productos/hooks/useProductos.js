import { useState, useEffect, useCallback, useRef } from 'react';
import { productosApi } from '../api/productosApi';

function mapearProductoFrontend(p) {
  return {
    id: p.id,
    codigo: p.codigo ?? `PR-${p.id}`,
    nombre: p.nombre,
    categoria: p.categoria,
    tipo: p.tipo ?? 'TERMINADO',
    esVendible: p.esVendible ?? true,
    precioVenta: Number(p.precioVenta ?? p.precio ?? 0),
    stock: Number(p.stockActual ?? p.stock ?? 0),
    stockMinimo: p.stockMinimo == null ? undefined : Number(p.stockMinimo),
    cantMinimaProduccion: p.cantMinimaProduccion == null ? undefined : Number(p.cantMinimaProduccion),
    cantMaximaProduccion: p.cantMaximaProduccion == null ? undefined : Number(p.cantMaximaProduccion),
    // estado calculado por el backend: 'Activo' | 'Inactivo' | 'Agotado'
    estado: p.estado || 'Activo',
    // activo = estado guardado (el toggle del formulario); distinto de "Agotado", que se calcula por stock
    activo: p.activo ?? p.estado !== 'Inactivo',
    imagenUrl: p.imagenUrl || p.imagen,
    imagen: p.imagenUrl || p.imagen,
    receta: p.receta ?? [],
  }
}

// Filtros que viajan al servidor. estado: '' | 'Activo' | 'Inactivo' | 'Agotado'; esVendible: '' | 'true' | 'false'
const FILTROS_INICIALES = {
  buscar: '',
  categoria: '',
  estado: '',
  tipo: '',
  esVendible: '',
  pagina: 1,
  limite: 10,
};

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltrosState] = useState(FILTROS_INICIALES);
  const [paginacion, setPaginacion] = useState({ total: 0, totalPaginas: 1, pagina: 1 });
  const [conteos, setConteos] = useState({ activos: 0, agotados: 0 });
  // Descarta respuestas viejas si el usuario escribe o filtra más rápido de lo que responde el servidor
  const peticionActual = useRef(0);

  // Cambia filtros; si no se indica la página, vuelve a la primera
  const setFiltros = useCallback((cambios) => {
    setFiltrosState((prev) => {
      const siguiente = { ...prev, ...cambios };
      if (!('pagina' in cambios)) siguiente.pagina = 1;
      return siguiente;
    });
  }, []);

  const cargarProductos = useCallback(async () => {
    const id = ++peticionActual.current;
    setCargando(true);
    setError(null);
    try {
      const respuesta = await productosApi.obtenerProductos(filtros);
      if (id !== peticionActual.current) return;
      const lista = (respuesta.datos || []).map(mapearProductoFrontend);
      const totalPaginas = respuesta.totalPaginas ?? 1;
      // Si se borró el último producto de la última página, vuelve a la página anterior
      if (lista.length === 0 && filtros.pagina > 1 && filtros.pagina > totalPaginas) {
        setFiltrosState((prev) => ({ ...prev, pagina: Math.max(1, totalPaginas) }));
        return;
      }
      setProductos(lista);
      setPaginacion({
        total: respuesta.total ?? lista.length,
        totalPaginas: Math.max(1, totalPaginas),
        pagina: respuesta.pagina ?? filtros.pagina,
      });
    } catch (err) {
      if (id === peticionActual.current) setError(err.message);
    } finally {
      if (id === peticionActual.current) setCargando(false);
    }
  }, [filtros]);

  // Conteos para las tarjetas del encabezado (no dependen de los filtros ni de la página)
  const cargarConteos = useCallback(async () => {
    try {
      const [activos, agotados] = await Promise.all([
        productosApi.obtenerProductos({ estado: 'Activo', limite: 1 }),
        productosApi.obtenerProductos({ estado: 'Agotado', limite: 1 }),
      ]);
      setConteos({ activos: activos.total ?? 0, agotados: agotados.total ?? 0 });
    } catch {
      // los conteos son informativos: si fallan, no se interrumpe la pantalla
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarProductos();
  }, [cargarProductos]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarConteos();
  }, [cargarConteos]);

  // Las acciones relanzan el error para que lo muestre quien las llamó (modal o página)
  const crearProducto = useCallback(async (datos) => {
    const nuevo = await productosApi.crearProducto(datos);
    await Promise.all([cargarProductos(), cargarConteos()]);
    return mapearProductoFrontend(nuevo);
  }, [cargarProductos, cargarConteos]);

  const editarProducto = useCallback(async (id, datos) => {
    const actualizado = await productosApi.actualizarProducto(id, datos);
    await Promise.all([cargarProductos(), cargarConteos()]);
    return mapearProductoFrontend(actualizado);
  }, [cargarProductos, cargarConteos]);

  const eliminarProducto = useCallback(async (id) => {
    await productosApi.eliminarProducto(id);
    await Promise.all([cargarProductos(), cargarConteos()]);
  }, [cargarProductos, cargarConteos]);

  const cambiarEstado = useCallback(async (id, estado) => {
    const cambiado = await productosApi.cambiarEstado(id, estado);
    await Promise.all([cargarProductos(), cargarConteos()]);
    return mapearProductoFrontend(cambiado);
  }, [cargarProductos, cargarConteos]);

  return {
    productos,
    cargando,
    error,
    filtros,
    setFiltros,
    paginacion,
    conteos,
    crearProducto,
    editarProducto,
    eliminarProducto,
    cambiarEstado,
    recargar: cargarProductos,
  };
}
