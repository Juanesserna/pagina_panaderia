import { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  changeEstadoProveedor,
} from "../services/proveedoresService";

const PAGE_SIZE = 8;

export const filtrosVacios = {
  estado: "",
  nombre: "",
  nit: "",
  nombreContacto: "",
  email: "",
};

export function useProveedores() {
  const [proveedores, setProveedores] = useState([]);
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
  const [proveedorAccion, setProveedorAccion] = useState(null);

  const cargar = useCallback(() => {
    setLoading(true);
    fetchProveedores().then((data) => {
      setProveedores(data);
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
    if (!form.nombre || !form.nit) return;

    if (vista === "crear") {
      await createProveedor(form);
    } else if (vista === "editar" && seleccionado) {
      await updateProveedor(seleccionado.id, form);
    }
    await cargar();
    setVista("lista");
  };

  const handleEliminar = async () => {
    if (!proveedorAccion) return;
    await deleteProveedor(proveedorAccion.id);
    await cargar();
    setModalEliminar(false);
    if (vista !== "lista") setVista("lista");
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    if (!proveedorAccion) return;
    await changeEstadoProveedor(proveedorAccion.id, nuevoEstado);
    await cargar();
    setModalEstado(false);
  };

  const limpiarFiltros = () => {
    setFiltrosActivos(filtrosVacios);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let data = proveedores;

    if (search) {
      const txt = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.nombre.toLowerCase().includes(txt) ||
          `prv-${String(p.id).padStart(3, "0")}`.includes(txt) ||
          p.nit.toLowerCase().includes(txt) ||
          p.nombreContacto.toLowerCase().includes(txt)
      );
    }
    if (filtrosActivos.estado)
      data = data.filter((p) => p.estado === (filtrosActivos.estado === "true"));
    if (filtrosActivos.nombre)
      data = data.filter((p) => p.nombre.toLowerCase().includes(filtrosActivos.nombre.toLowerCase()));
    if (filtrosActivos.nit)
      data = data.filter((p) => p.nit.toLowerCase().includes(filtrosActivos.nit.toLowerCase()));
    if (filtrosActivos.nombreContacto)
      data = data.filter((p) =>
        p.nombreContacto.toLowerCase().includes(filtrosActivos.nombreContacto.toLowerCase())
      );
    if (filtrosActivos.email)
      data = data.filter((p) => p.email.toLowerCase().includes(filtrosActivos.email.toLowerCase()));

    const sorted = [...data].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [proveedores, search, filtrosActivos, sortKey, sortDir]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filtrosActivosCount = Object.values(filtrosActivos).filter(Boolean).length;

  const kpis = {
    total: proveedores.length,
    activos: proveedores.filter((p) => p.estado).length,
    inactivos: proveedores.filter((p) => !p.estado).length,
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
    proveedorAccion,
    setProveedorAccion,
  };
}
