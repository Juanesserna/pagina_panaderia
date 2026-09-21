import { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchInsumos,
  createInsumo,
  updateInsumo,
  deleteInsumo,
  changeEstadoInsumo,
} from "../services/insumosService";
import { getEstadoVisual } from "../utils/insumosHelpers";

const PAGE_SIZE = 8;

export const filtrosVacios = {
  idCategoria: "",
  estado: "",
  nivelStock: "",
  idUnidadMedida: "",
  stockMinimoDesde: "",
  stockMinimoHasta: "",
};

export function useInsumos() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [vista, setVista] = useState("lista"); // lista | crear | editar | detalle
  const [seleccionado, setSeleccionado] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  const [filtrosActivos, setFiltrosActivos] = useState(filtrosVacios);

  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalEstado, setModalEstado] = useState(false);
  const [insumoAccion, setInsumoAccion] = useState(null);

  const cargar = useCallback(() => {
    setLoading(true);
    fetchInsumos().then((data) => {
      setInsumos(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleGuardar = async (form) => {
    if (!form.nombre || !form.idCategoria || !form.idUnidadMedida) return;

    if (vista === "crear") {
      await createInsumo(form);
    } else if (vista === "editar" && seleccionado) {
      await updateInsumo(seleccionado.id, form);
    }
    await cargar();
    setVista("lista");
  };

  const handleEliminar = async () => {
    if (!insumoAccion) return;
    await deleteInsumo(insumoAccion.id);
    await cargar();
    setModalEliminar(false);
    if (vista !== "lista") setVista("lista");
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    if (!insumoAccion) return;
    await changeEstadoInsumo(insumoAccion.id, nuevoEstado);
    await cargar();
    setModalEstado(false);
  };

  const limpiarFiltros = () => {
    setFiltrosActivos(filtrosVacios);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let data = insumos;

    if (search) {
      const txt = search.toLowerCase();
      data = data.filter(
        (i) =>
          i.nombre.toLowerCase().includes(txt) ||
          `ins-${String(i.id).padStart(3, "0")}`.includes(txt)
      );
    }
    if (filtrosActivos.idCategoria)
      data = data.filter((i) => i.idCategoria === Number(filtrosActivos.idCategoria));
    if (filtrosActivos.estado)
      data = data.filter((i) => i.estado === (filtrosActivos.estado === "true"));
    if (filtrosActivos.nivelStock === "bajo")
      data = data.filter((i) => getEstadoVisual(i) === "Stock Bajo");
    if (filtrosActivos.nivelStock === "sin") data = data.filter((i) => i.stockActual === 0);
    if (filtrosActivos.nivelStock === "normal")
      data = data.filter((i) => getEstadoVisual(i) === "Activo" && i.stockActual > 0);
    if (filtrosActivos.idUnidadMedida)
      data = data.filter((i) => i.idUnidadMedida === Number(filtrosActivos.idUnidadMedida));
    if (filtrosActivos.stockMinimoDesde !== "")
      data = data.filter((i) => i.stockMinimo >= Number(filtrosActivos.stockMinimoDesde));
    if (filtrosActivos.stockMinimoHasta !== "")
      data = data.filter((i) => i.stockMinimo <= Number(filtrosActivos.stockMinimoHasta));

    const sorted = [...data].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [insumos, search, filtrosActivos, sortKey, sortDir]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filtrosActivosCount = Object.values(filtrosActivos).filter(Boolean).length;

  const kpis = {
    total: insumos.length,
    activos: insumos.filter((i) => getEstadoVisual(i) === "Activo").length,
    stockBajo: insumos.filter((i) => getEstadoVisual(i) === "Stock Bajo").length,
    inactivos: insumos.filter((i) => getEstadoVisual(i) === "Inactivo").length,
  };

  return {
    // datos
    loading,
    kpis,
    filtered,
    paginated,
    pageSize: PAGE_SIZE,
    // vista
    vista,
    setVista,
    seleccionado,
    setSeleccionado,
    // tabla
    search,
    setSearch,
    page,
    setPage,
    sortKey,
    sortDir,
    handleSort,
    // filtros
    filtrosActivos,
    setFiltrosActivos,
    filtrosActivosCount,
    limpiarFiltros,
    // acciones
    handleGuardar,
    handleEliminar,
    handleCambiarEstado,
    modalEliminar,
    setModalEliminar,
    modalEstado,
    setModalEstado,
    insumoAccion,
    setInsumoAccion,
  };
}
