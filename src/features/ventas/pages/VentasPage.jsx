import { useState, useMemo, useRef } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button, IconButton,
  Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, Collapse, Autocomplete, Grid, Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Search, Plus, Minus, Filter, X, Download, Upload, Receipt, Trash2,
  CheckCircle, XCircle, ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  initialVentas, estadoVariant, estadoOptions,
  esTransicionValida, opcionesEstadoParaFila, usuarioAutenticado,
  catalogoClientes, catalogoPanaderia, obtenerProductosVenta,
  obtenerNombreCliente, parseFechaVenta, fechaHoyFormateada, PAGE_SIZE,
} from "@features/ventas/data/ventasMockData";

// ---------- Subcomponentes de presentación ----------

function FilterLabel({ children }) {
  return (
    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>
      {children}
    </Typography>
  );
}

function DialogHeader({ title, onClose }) {
  return (
    <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
      <IconButton size="small" onClick={onClose}><X size={16} /></IconButton>
    </DialogTitle>
  );
}

// Color del estado derivado SIEMPRE del theme (mismo verde/rojo que las KPI cards),
// nunca un hex hardcodeado aparte.
function useEstadoColor(estado) {
  const theme = useTheme();
  const variant = estadoVariant[estado] || "info";
  return theme.palette[variant].main;
}

function EstadoChip({ estado, onClick, disabled }) {
  const color = useEstadoColor(estado);
  return (
    <Chip
      size="small"
      onClick={disabled ? undefined : onClick}
      clickable={!disabled}
      label={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
          <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: color }} />
          {estado.charAt(0).toUpperCase() + estado.slice(1)}
        </Box>
      }
      sx={{ bgcolor: alpha(color, 0.15), color, opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
      title={disabled ? "Una venta cancelada no se puede modificar" : "Cambiar estado"}
    />
  );
}

export default function VentasPage() {
  const theme = useTheme();

  const filledInputSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: theme.palette.ahSurface2,
      "& fieldset": { borderColor: "transparent" },
      "&:hover fieldset": { borderColor: theme.palette.divider },
      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
    },
  };

  const [ventas, setVentas] = useState(initialVentas);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(null);

  const [showFiltros, setShowFiltros] = useState(false);
  const [estadoFilter, setEstadoFilter] = useState("");
  const [metodoFilter, setMetodoFilter] = useState("");
  const [cantidadMin, setCantidadMin] = useState("");
  const [cantidadMax, setCantidadMax] = useState("");
  const [totalMin, setTotalMin] = useState("");
  const [totalMax, setTotalMax] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [ventaEstadoModal, setVentaEstadoModal] = useState(null);
  const [estadoSeleccionadoModal, setEstadoSeleccionadoModal] = useState(null);

  const [showVentaModal, setShowVentaModal] = useState(false);
  const [formItems, setFormItems] = useState([]);
  const [formId, setFormId] = useState("");
  const [formFecha, setFormFecha] = useState("");
  const [formHora, setFormHora] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("pendiente");
  const [productoAutocomplete, setProductoAutocomplete] = useState(null);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);

  const comprobanteRef = useRef(null);
  const transferenciaInputRef = useRef(null);
  const [uploadingVentaId, setUploadingVentaId] = useState(null);

  const [abonos, setAbonos] = useState([]);
  const [showAbonoModal, setShowAbonoModal] = useState(false);
  const [ventaAbonoModal, setVentaAbonoModal] = useState(null);
  const [abonoComprobante, setAbonoComprobante] = useState(null);
  const [abonoMonto, setAbonoMonto] = useState("");
  const [abonoMetodo, setAbonoMetodo] = useState("efectivo");
  const abonoInputRef = useRef(null);
  const [abonoAConfirmarEliminar, setAbonoAConfirmarEliminar] = useState(null);

  const handleClickCargarTransferencia = (id) => {
    setUploadingVentaId(id);
    transferenciaInputRef.current?.click();
  };

  const handleImagenTransferenciaSeleccionada = (e) => {
    const file = e.target.files?.[0];
    const targetId = uploadingVentaId;
    e.target.value = "";
    if (!file || !targetId || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setVentas((prev) => prev.map((v) => (v.id === targetId ? { ...v, imagenTransferencia: dataUrl } : v)));
      setSelected((prev) => (prev && prev.id === targetId ? { ...prev, imagenTransferencia: dataUrl } : prev));
    };
    reader.readAsDataURL(file);
    setUploadingVentaId(null);
  };

  const handleDescargarComprobante = () => {
    if (!selected) return;
    const ventana = window.open("", "_blank", "width=480,height=700");
    if (!ventana || !comprobanteRef.current) return;
    ventana.document.write(`
      <!DOCTYPE html><html><head><meta charset="utf-8" /><title>Comprobante ${selected.id}</title>
      <style>body{margin:0;padding:24px;display:flex;justify-content:center;background:#fff;font-family:monospace;}@media print{body{padding:0;}}</style>
      </head><body>${comprobanteRef.current.outerHTML}
      <script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};}<\/script>
      </body></html>
    `);
    ventana.document.close();
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleCambiarEstado = (id, nuevoEstadoFila) => {
    setVentas((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        if (!esTransicionValida(v.estado, nuevoEstadoFila)) return v;
        return { ...v, estado: nuevoEstadoFila };
      })
    );
    setSelected((prev) =>
      prev && prev.id === id && esTransicionValida(prev.estado, nuevoEstadoFila)
        ? { ...prev, estado: nuevoEstadoFila }
        : prev
    );
  };

  const abrirModalEstado = (venta) => {
    if (venta.estado === "cancelado") return;
    setVentaEstadoModal(venta);
    setEstadoSeleccionadoModal(venta.estado);
    setShowEstadoModal(true);
  };

  const cerrarModalEstado = () => {
    setShowEstadoModal(false);
    setVentaEstadoModal(null);
    setEstadoSeleccionadoModal(null);
  };

  const confirmarCambioEstado = () => {
    if (!ventaEstadoModal || !estadoSeleccionadoModal) return;
    handleCambiarEstado(ventaEstadoModal.id, estadoSeleccionadoModal);
    cerrarModalEstado();
  };

  const nextAbonoId = () => {
    const maxNum = abonos.reduce((max, a) => Math.max(max, parseInt(a.id.replace("AB-", ""), 10) || 0), 0);
    return `AB-${String(maxNum + 1).padStart(3, "0")}`;
  };

  const abrirModalAbono = (venta) => {
    setVentaAbonoModal(venta);
    setAbonoComprobante(null);
    setAbonoMonto("");
    setAbonoMetodo("efectivo");
    setAbonoAConfirmarEliminar(null);
    setShowAbonoModal(true);
  };

  const cerrarModalAbono = () => {
    setShowAbonoModal(false);
    setVentaAbonoModal(null);
    setAbonoComprobante(null);
    setAbonoMonto("");
    setAbonoAConfirmarEliminar(null);
  };

  const handleImagenAbonoSeleccionada = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setAbonoComprobante(reader.result);
    reader.readAsDataURL(file);
  };

  const abonosDeVenta = useMemo(
    () => (ventaAbonoModal ? abonos.filter((a) => a.idVenta === ventaAbonoModal.id) : []),
    [abonos, ventaAbonoModal]
  );

  const totalAbonadoVenta = abonosDeVenta.reduce((s, a) => s + a.monto, 0);
  const saldoPendienteVenta = ventaAbonoModal ? Math.max(ventaAbonoModal.total - totalAbonadoVenta, 0) : 0;
  const montoAbonoValido = parseFloat(abonoMonto) > 0 && parseFloat(abonoMonto) <= saldoPendienteVenta + 0.001;

  const handleCambiarMontoAbono = (valor) => {
    if (valor === "") {
      setAbonoMonto("");
      return;
    }
    const numero = parseFloat(valor);
    if (isNaN(numero)) {
      setAbonoMonto(valor);
      return;
    }
    if (numero > saldoPendienteVenta) setAbonoMonto(saldoPendienteVenta.toFixed(2));
    else setAbonoMonto(valor);
  };

  const resetNuevoAbono = () => {
    setAbonoComprobante(null);
    setAbonoMonto("");
    setAbonoMetodo("efectivo");
  };

  const handleRegistrarAbono = () => {
    if (!ventaAbonoModal || !abonoComprobante || !montoAbonoValido) return;
    const nuevoAbono = {
      id: nextAbonoId(),
      idVenta: ventaAbonoModal.id,
      fecha: fechaHoyFormateada(),
      monto: parseFloat(abonoMonto),
      metodoPago: abonoMetodo,
      urlComprobante: abonoComprobante,
    };
    setAbonos((prev) => [nuevoAbono, ...prev]);
    resetNuevoAbono();
  };

  const handleClickEliminarAbono = (idAbono) => {
    if (abonoAConfirmarEliminar === idAbono) {
      setAbonos((prev) => prev.filter((a) => a.id !== idAbono));
      setAbonoAConfirmarEliminar(null);
    } else {
      setAbonoAConfirmarEliminar(idAbono);
    }
  };

  const filtered = useMemo(() => {
    let data = ventas;
    if (search)
      data = data.filter(
        (v) =>
          v.usuario.toLowerCase().includes(search.toLowerCase()) ||
          (v.cliente ?? "").toLowerCase().includes(search.toLowerCase()) ||
          v.id.includes(search)
      );
    if (estadoFilter) data = data.filter((v) => v.estado === estadoFilter);
    if (metodoFilter) data = data.filter((v) => v.metodo === metodoFilter);
    if (cantidadMin !== "") {
      const min = parseInt(cantidadMin, 10);
      if (!isNaN(min)) data = data.filter((v) => v.productos >= min);
    }
    if (cantidadMax !== "") {
      const max = parseInt(cantidadMax, 10);
      if (!isNaN(max)) data = data.filter((v) => v.productos <= max);
    }
    if (totalMin !== "") {
      const min = parseFloat(totalMin);
      if (!isNaN(min)) data = data.filter((v) => v.total >= min);
    }
    if (totalMax !== "") {
      const max = parseFloat(totalMax);
      if (!isNaN(max)) data = data.filter((v) => v.total <= max);
    }
    if (fechaDesde) {
      const desde = new Date(`${fechaDesde}T00:00:00`);
      data = data.filter((v) => parseFechaVenta(v) >= desde);
    }
    if (fechaHasta) {
      const hasta = new Date(`${fechaHasta}T23:59:59`);
      data = data.filter((v) => parseFechaVenta(v) <= hasta);
    }
    data = [...data].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "id") cmp = parseInt(a.id.replace("#", "")) - parseInt(b.id.replace("#", ""));
      if (sortKey === "total") cmp = a.total - b.total;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [ventas, search, estadoFilter, metodoFilter, cantidadMin, cantidadMax, totalMin, totalMax, fechaDesde, fechaHasta, sortKey, sortDir]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const filtrosActivos = Boolean(
    estadoFilter || metodoFilter || cantidadMin || cantidadMax || totalMin || totalMax || fechaDesde || fechaHasta
  );

  const limpiarFiltros = () => {
    setEstadoFilter("");
    setMetodoFilter("");
    setCantidadMin("");
    setCantidadMax("");
    setTotalMin("");
    setTotalMax("");
    setFechaDesde("");
    setFechaHasta("");
    setPage(1);
  };

  const totalFormulario = formItems.reduce((s, i) => s + i.cantidad * i.precio, 0);

  const resetFormularioVenta = () => {
    setFormItems([]);
    setClienteSeleccionado(null);
    setNuevoEstado("pendiente");
    setProductoAutocomplete(null);
    setCantidadSeleccionada(1);
  };

  const nextId = () => {
    const maxNum = ventas.reduce((max, v) => Math.max(max, parseInt(v.id.replace("#", ""), 10) || 0), 0);
    return `#${maxNum + 1}`;
  };

  const handleNuevaVenta = () => {
    resetFormularioVenta();
    setFormId(nextId());
    setFormFecha(fechaHoyFormateada());
    const ahora = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    setFormHora(`${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`);
    setShowVentaModal(true);
  };

  const handleAgregarProducto = () => {
    if (!productoAutocomplete || cantidadSeleccionada <= 0) return;
    setFormItems((prev) => {
      const existente = prev.find((i) => i.nombre === productoAutocomplete.nombre);
      if (existente) {
        return prev.map((i) =>
          i.nombre === productoAutocomplete.nombre ? { ...i, cantidad: i.cantidad + cantidadSeleccionada } : i
        );
      }
      return [...prev, { nombre: productoAutocomplete.nombre, cantidad: cantidadSeleccionada, precio: productoAutocomplete.precio }];
    });
    setProductoAutocomplete(null);
    setCantidadSeleccionada(1);
  };

  const handleQuitarProducto = (nombre) => setFormItems((prev) => prev.filter((i) => i.nombre !== nombre));

  const handleActualizarCantidad = (nombre, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      handleQuitarProducto(nombre);
      return;
    }
    setFormItems((prev) => prev.map((i) => (i.nombre === nombre ? { ...i, cantidad: nuevaCantidad } : i)));
  };

  const clienteValido = Boolean(clienteSeleccionado);

  const handleConfirmarVenta = () => {
    if (formItems.length === 0 || !clienteValido) return;
    const nuevaVenta = {
      id: formId,
      usuario: usuarioAutenticado.nombre,
      cliente: clienteSeleccionado.nombre || "Cliente no especificado",
      nit: clienteSeleccionado.nit,
      origen: "manual",
      productos: formItems.reduce((s, i) => s + i.cantidad, 0),
      total: totalFormulario,
      estado: nuevoEstado,
      fecha: formFecha,
      hora: formHora,
      items: formItems,
    };
    setVentas((prev) => [nuevaVenta, ...prev]);
    setShowVentaModal(false);
  };

  const completados = ventas.filter((v) => v.estado === "completado").length;
  const cancelados = ventas.filter((v) => v.estado === "cancelado").length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <input ref={transferenciaInputRef} type="file" accept="image/*" hidden onChange={handleImagenTransferenciaSeleccionada} />
      <input ref={abonoInputRef} type="file" accept="image/*" hidden onChange={handleImagenAbonoSeleccionada} />

      {/* KPIs */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined">
            <CardContent sx={{ py: 2, px: 2.5, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Completados
                </Typography>
                <Box sx={{ width: 30, height: 30, borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.main }}>
                  <CheckCircle size={14} />
                </Box>
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ mt: 1.5 }}>{completados}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined">
            <CardContent sx={{ py: 2, px: 2.5, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Cancelados
                </Typography>
                <Box sx={{ width: 30, height: 30, borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: alpha(theme.palette.error.main, 0.12), color: theme.palette.error.main }}>
                  <XCircle size={14} />
                </Box>
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ mt: 1.5 }}>{cancelados}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card variant="outlined">
        {/* Toolbar */}
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.25, px: 2.5, py: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mr: "auto" }}>Registro de ventas</Typography>
          <TextField
            size="small"
            placeholder="Buscar pedido o cliente…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            InputProps={{ startAdornment: <Search size={13} style={{ marginRight: 6, opacity: 0.45, flexShrink: 0 }} /> }}
            sx={{ width: 200, ...filledInputSx }}
          />
          <Button variant="contained" size="small" startIcon={<Plus size={13} />} onClick={handleNuevaVenta}>
            Nueva venta
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Filter size={13} />}
            onClick={() => setShowFiltros((v) => !v)}
            sx={{ borderColor: theme.palette.divider, color: "text.primary" }}
          >
            Filtrar
            {filtrosActivos && (
              <Box component="span" sx={{ ml: 1, bgcolor: theme.palette.ahSurface2, borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>
                {[estadoFilter, metodoFilter, cantidadMin, cantidadMax, totalMin, totalMax, fechaDesde, fechaHasta].filter(Boolean).length}
              </Box>
            )}
          </Button>
        </Box>

        <Divider />

        {/* Filtros */}
        <Collapse in={showFiltros}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, px: 2.5, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box>
              <FilterLabel>Estado</FilterLabel>
              <Select size="small" value={estadoFilter} onChange={(e) => { setEstadoFilter(e.target.value); setPage(1); }} sx={{ width: 130, ...filledInputSx }}>
                <MenuItem value="">Todos</MenuItem>
                {estadoOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </Box>
            <Box>
              <FilterLabel>Método</FilterLabel>
              <Select size="small" value={metodoFilter} onChange={(e) => { setMetodoFilter(e.target.value); setPage(1); }} sx={{ width: 130, ...filledInputSx }}>
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="efectivo">Efectivo</MenuItem>
                <MenuItem value="tarjeta">Tarjeta</MenuItem>
                <MenuItem value="transferencia">Transferencia</MenuItem>
              </Select>
            </Box>
            <Box>
              <FilterLabel>Cantidad mín.</FilterLabel>
              <TextField size="small" type="number" placeholder="0" value={cantidadMin} onChange={(e) => { setCantidadMin(e.target.value); setPage(1); }} sx={{ width: 90, ...filledInputSx }} />
            </Box>
            <Box>
              <FilterLabel>Cantidad máx.</FilterLabel>
              <TextField size="small" type="number" placeholder="Sin límite" value={cantidadMax} onChange={(e) => { setCantidadMax(e.target.value); setPage(1); }} sx={{ width: 100, ...filledInputSx }} />
            </Box>
            <Box>
              <FilterLabel>Total mín.</FilterLabel>
              <TextField size="small" type="number" placeholder="$0" value={totalMin} onChange={(e) => { setTotalMin(e.target.value); setPage(1); }} sx={{ width: 90, ...filledInputSx }} />
            </Box>
            <Box>
              <FilterLabel>Total máx.</FilterLabel>
              <TextField size="small" type="number" placeholder="Sin límite" value={totalMax} onChange={(e) => { setTotalMax(e.target.value); setPage(1); }} sx={{ width: 100, ...filledInputSx }} />
            </Box>
            <Box>
              <FilterLabel>Desde</FilterLabel>
              <TextField size="small" type="date" value={fechaDesde} onChange={(e) => { setFechaDesde(e.target.value); setPage(1); }} sx={{ width: 140, ...filledInputSx }} />
            </Box>
            <Box>
              <FilterLabel>Hasta</FilterLabel>
              <TextField size="small" type="date" value={fechaHasta} onChange={(e) => { setFechaHasta(e.target.value); setPage(1); }} sx={{ width: 140, ...filledInputSx }} />
            </Box>
            {filtrosActivos && (
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Button size="small" onClick={limpiarFiltros}>Limpiar filtros</Button>
              </Box>
            )}
          </Box>
        </Collapse>

        {/* Tabla */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  { key: "id", label: "ID", sortable: true },
                  { key: "nit", label: "NIT/Cédula" },
                  { key: "metodo", label: "Método" },
                  { key: "total", label: "Total", sortable: true, align: "right" },
                  { key: "estado", label: "Estado" },
                  { key: "fecha", label: "Fecha" },
                  { key: "acciones", label: "" },
                ].map((col) => (
                  <TableCell key={col.key} align={col.align}>
                    {col.sortable ? (
                      <TableSortLabel
                        active={sortKey === col.key}
                        direction={sortDir}
                        onClick={() => handleSort(col.key)}
                        sx={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary" }}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      <Typography sx={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary" }}>
                        {col.label}
                      </Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.disabled" }}>Sin ventas encontradas</TableCell></TableRow>
              )}
              {paginated.map((r) => {
                const puedeVerComprobante = r.estado === "completado" || r.estado === "cancelado";
                const abonosCount = abonos.filter((a) => a.idVenta === r.id).length;
                return (
                  <TableRow key={r.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{r.id}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{r.nit || "—"}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {r.metodo ? r.metodo.charAt(0).toUpperCase() + r.metodo.slice(1) : "—"}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>${r.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <EstadoChip estado={r.estado} disabled={r.estado === "cancelado"} onClick={() => abrirModalEstado(r)} />
                    </TableCell>
                    <TableCell sx={{ color: "text.disabled", fontSize: 11.5 }}>{r.fecha} {r.hora}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                        <Button variant="text" size="small" startIcon={<Receipt size={12} />} onClick={() => abrirModalAbono(r)} sx={{ color: "text.secondary" }}>
                          {abonosCount > 0 ? `Abonos (${abonosCount})` : "Abonos"}
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          disabled={!puedeVerComprobante}
                          onClick={() => { setSelected(r); setShowModal(true); }}
                          sx={{ color: "text.secondary" }}
                        >
                          Ver comprobante
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación custom: cuadrados con bordes redondeados, no círculos */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2.5, py: 1.75, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" color="text.secondary">
            Mostrando {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length} registros
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton size="small" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft size={15} />
            </IconButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Box
                key={p}
                onClick={() => setPage(p)}
                sx={{
                  width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "6px", cursor: "pointer", fontSize: 12, fontWeight: 700,
                  bgcolor: p === page ? "primary.main" : "transparent",
                  color: p === page ? "primary.contrastText" : "text.secondary",
                }}
              >
                {p}
              </Box>
            ))}
            <IconButton size="small" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              <ChevronRight size={15} />
            </IconButton>
          </Box>
        </Box>
      </Card>

      {/* Dialog: Cambiar estado */}
      <Dialog open={showEstadoModal} onClose={cerrarModalEstado} maxWidth="xs" fullWidth>
        <DialogHeader title="Cambiar estado" onClose={cerrarModalEstado} />
        <DialogContent>
          {ventaEstadoModal && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              <Typography variant="caption" color="text.secondary">
                Venta <b>{ventaEstadoModal.id}</b> · {obtenerNombreCliente(ventaEstadoModal)}
              </Typography>
              {opcionesEstadoParaFila(ventaEstadoModal.estado).map((o) => {
                const activo = estadoSeleccionadoModal === o.value;
                const color = theme.palette[estadoVariant[o.value]].main;
                return (
                  <Box
                    key={o.value}
                    onClick={() => setEstadoSeleccionadoModal(o.value)}
                    sx={{
                      display: "flex", alignItems: "center", gap: 1.25, cursor: "pointer",
                      border: `1px solid ${activo ? theme.palette.text.primary : theme.palette.divider}`,
                      borderRadius: 1.5, px: 1.25, py: 0.875,
                      bgcolor: activo ? theme.palette.ahSurface2 : "transparent",
                    }}
                  >
                    <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: color }} />
                    <Typography variant="body2" sx={{ flex: 1 }}>{o.label}</Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={cerrarModalEstado}>Cancelar</Button>
          <Button
            size="small"
            variant="contained"
            disabled={!estadoSeleccionadoModal || estadoSeleccionadoModal === ventaEstadoModal?.estado}
            onClick={confirmarCambioEstado}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Comprobante */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogHeader title="Comprobante de venta" onClose={() => setShowModal(false)} />
        <DialogContent>
          {selected && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2.5 }}>
              <Box
                ref={comprobanteRef}
                sx={{
                  width: "100%", maxWidth: 340, fontFamily: "monospace", fontSize: 12,
                  border: `2px dashed ${theme.palette.divider}`, borderRadius: 2,
                  bgcolor: theme.palette.background.default,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, px: 2.5, pt: 2, pb: 1.75, borderBottom: `1px dashed ${theme.palette.divider}` }}>
                  <Typography sx={{ fontWeight: 700, letterSpacing: 2.5, fontSize: 13 }}>PANADERÍA</Typography>
                  <Typography variant="caption" color="text.secondary">Comprobante de venta</Typography>
                  <Typography variant="caption" sx={{ mt: 1 }}>{selected.id}</Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6, px: 2.5, py: 1.25, borderBottom: `1px dashed ${theme.palette.divider}` }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><span>Cliente</span><b>{obtenerNombreCliente(selected)}</b></Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><span>Fecha</span><span>{selected.fecha} · {selected.hora}</span></Box>
                  {selected.nit && <Box sx={{ display: "flex", justifyContent: "space-between" }}><span>NIT/Cédula</span><span>{selected.nit}</span></Box>}
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Pago</span><span>{selected.metodo ? selected.metodo.charAt(0).toUpperCase() + selected.metodo.slice(1) : "—"}</span>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, px: 2.5, py: 1.25, borderBottom: `1px dashed ${theme.palette.divider}` }}>
                  {obtenerProductosVenta(selected).map((p, idx) => (
                    <Box key={idx} sx={{ display: "flex", gap: 1 }}>
                      <span>{p.cantidad}x</span>
                      <span style={{ flex: 1 }}>{p.nombre}</span>
                      <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, px: 2.5, py: 1.25, borderBottom: `1px dashed ${theme.palette.divider}` }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", color: "text.secondary" }}>
                    <span>Artículos</span><span>{selected.productos}</span>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", pt: 0.75 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 13 }}>TOTAL</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 16 }}>${selected.total.toFixed(2)}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, px: 2.5, py: 1.75 }}>
                  <EstadoChip estado={selected.estado} disabled />
                  <Typography variant="caption" color="text.disabled">¡Gracias por su compra!</Typography>
                </Box>
              </Box>

              <Box sx={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <FilterLabel>Captura de comprobante</FilterLabel>
                  <Button size="small" startIcon={<Upload size={12} />} onClick={() => handleClickCargarTransferencia(selected.id)}>
                    {selected.imagenTransferencia ? "Reemplazar" : "Cargar"}
                  </Button>
                </Box>
                {selected.imagenTransferencia ? (
                  <Box component="img" src={selected.imagenTransferencia} alt="Comprobante" sx={{ width: "100%", borderRadius: 1.5, border: `1px solid ${theme.palette.divider}`, maxHeight: 220, objectFit: "contain" }} />
                ) : (
                  <Box sx={{ border: `1px dashed ${theme.palette.divider}`, borderRadius: 1.5, py: 2.5, textAlign: "center", color: "text.disabled", fontSize: 11.5 }}>
                    Sin comprobante cargado
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="contained" startIcon={<Download size={12} />} onClick={handleDescargarComprobante}>Descargar comprobante</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Abonos */}
      <Dialog open={showAbonoModal} onClose={cerrarModalAbono} maxWidth="sm" fullWidth>
        <DialogHeader title="Abonos de la venta" onClose={cerrarModalAbono} />
        <DialogContent>
          {ventaAbonoModal && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
              <Typography variant="caption" color="text.secondary">
                Venta <b>{ventaAbonoModal.id}</b> · {obtenerNombreCliente(ventaAbonoModal)}
              </Typography>

              <Grid container spacing={2} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5, p: 1.75, mx: 0 }}>
                <Grid item xs={4}>
                  <Typography sx={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary" }}>Total venta</Typography>
                  <Typography fontWeight={700} fontSize={14}>${ventaAbonoModal.total.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary" }}>Abonado</Typography>
                  <Typography fontWeight={700} fontSize={14}>${totalAbonadoVenta.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary" }}>Saldo pendiente</Typography>
                  <Typography fontWeight={700} fontSize={14} color={saldoPendienteVenta <= 0 ? "success.main" : "text.primary"}>
                    ${saldoPendienteVenta.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>

              <FilterLabel>Historial de abonos {abonosDeVenta.length > 0 ? `(${abonosDeVenta.length})` : ""}</FilterLabel>

              {abonosDeVenta.length === 0 ? (
                <Box sx={{ border: `1px dashed ${theme.palette.divider}`, borderRadius: 1.5, py: 2.5, textAlign: "center", color: "text.disabled", fontSize: 11.5 }}>
                  Aún no hay abonos registrados para esta venta
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, maxHeight: 200, overflowY: "auto" }}>
                  {abonosDeVenta.map((a) => {
                    const confirmando = abonoAConfirmarEliminar === a.id;
                    return (
                      <Box
                        key={a.id}
                        sx={{
                          display: "flex", alignItems: "center", gap: 1.25,
                          border: `1px solid ${confirmando ? theme.palette.error.main : theme.palette.divider}`,
                          borderRadius: 1.5, px: 1.25, py: 0.875,
                          bgcolor: confirmando ? theme.palette.error.dim : "transparent",
                        }}
                      >
                        <Box
                          component="img"
                          src={a.urlComprobante}
                          alt="Comprobante"
                          onClick={() => window.open(a.urlComprobante, "_blank")}
                          sx={{ width: 38, height: 38, borderRadius: 1, border: `1px solid ${theme.palette.divider}`, objectFit: "cover", cursor: "pointer" }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption">{a.id}</Typography>
                            <Typography variant="caption" color="text.disabled">{a.fecha}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption" color="text.secondary">
                              {a.metodoPago.charAt(0).toUpperCase() + a.metodoPago.slice(1)}
                            </Typography>
                            <Typography fontWeight={700} fontSize={12.5}>${a.monto.toFixed(2)}</Typography>
                          </Box>
                        </Box>
                        <IconButton size="small" color={confirmando ? "error" : "default"} onClick={() => handleClickEliminarAbono(a.id)}>
                          <Trash2 size={13} />
                        </IconButton>
                      </Box>
                    );
                  })}
                </Box>
              )}

              <Divider />

              <FilterLabel>Nuevo abono</FilterLabel>

              {saldoPendienteVenta <= 0 ? (
                <Box sx={{ border: `1px dashed ${theme.palette.divider}`, borderRadius: 1.5, py: 2, textAlign: "center", color: "success.main", fontSize: 11.5 }}>
                  Esta venta ya está completamente pagada.
                </Box>
              ) : !abonoComprobante ? (
                <Button
                  variant="outlined"
                  onClick={() => abonoInputRef.current?.click()}
                  sx={{ display: "flex", flexDirection: "column", gap: 1, py: 3, borderStyle: "dashed", borderColor: theme.palette.divider, color: "text.secondary" }}
                >
                  <Upload size={16} />
                  Subir captura del comprobante
                </Button>
              ) : (
                <>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <FilterLabel>Comprobante</FilterLabel>
                    <Button size="small" startIcon={<Upload size={12} />} onClick={() => abonoInputRef.current?.click()}>Reemplazar</Button>
                  </Box>
                  <Box component="img" src={abonoComprobante} alt="Comprobante" sx={{ width: "100%", borderRadius: 1.5, border: `1px solid ${theme.palette.divider}`, maxHeight: 190, objectFit: "contain" }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FilterLabel>Método de pago</FilterLabel>
                      <Select size="small" fullWidth value={abonoMetodo} onChange={(e) => setAbonoMetodo(e.target.value)} sx={filledInputSx}>
                        <MenuItem value="efectivo">💵 Efectivo</MenuItem>
                        <MenuItem value="tarjeta">💳 Tarjeta</MenuItem>
                        <MenuItem value="transferencia">🏦 Transferencia</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={6}>
                      <FilterLabel>Monto (máx. ${saldoPendienteVenta.toFixed(2)})</FilterLabel>
                      <TextField size="small" fullWidth type="number" placeholder="$0.00" value={abonoMonto} onChange={(e) => handleCambiarMontoAbono(e.target.value)} sx={filledInputSx} />
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={cerrarModalAbono}>Cerrar</Button>
          {abonoComprobante && (
            <Button size="small" variant="contained" disabled={!montoAbonoValido} onClick={handleRegistrarAbono}>Registrar abono</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog: Nueva venta */}
      <Dialog open={showVentaModal} onClose={() => setShowVentaModal(false)} maxWidth="sm" fullWidth>
        <DialogHeader title="Nueva venta" onClose={() => setShowVentaModal(false)} />
        <DialogContent>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ bgcolor: theme.palette.ahSurface2, borderRadius: 1.5, px: 1.5, py: 1.25, display: "flex", flexDirection: "column", gap: 0.4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span>ID de venta</span><b>{formId}</b>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span>Fecha</span><span>{formFecha} · {formHora}</span>
                  </Box>
                </Box>

                <Box>
                  <FilterLabel>NIT/Cédula</FilterLabel>
                  <Autocomplete
                    size="small"
                    options={catalogoClientes}
                    getOptionLabel={(c) => `${c.nit} — ${c.nombre}`}
                    value={clienteSeleccionado}
                    onChange={(_, value) => setClienteSeleccionado(value)}
                    renderInput={(params) => <TextField {...params} placeholder="Buscar por NIT o nombre…" sx={filledInputSx} />}
                  />
                </Box>

                <Box>
                  <FilterLabel>Estado inicial</FilterLabel>
                  <Select size="small" fullWidth value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)} sx={filledInputSx}>
                    {estadoOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                  </Select>
                </Box>

                <Divider />

                <Box>
                  <FilterLabel>Producto</FilterLabel>
                  <Autocomplete
                    size="small"
                    options={catalogoPanaderia}
                    getOptionLabel={(p) => p.nombre}
                    value={productoAutocomplete}
                    onChange={(_, value) => setProductoAutocomplete(value)}
                    renderOption={(props, p) => (
                      <li {...props} key={p.nombre}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: 13 }}>
                          <span>{p.nombre}</span><span>${p.precio.toFixed(2)}</span>
                        </Box>
                      </li>
                    )}
                    renderInput={(params) => <TextField {...params} placeholder="Buscar producto…" sx={filledInputSx} />}
                  />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", bgcolor: theme.palette.ahSurface2, borderRadius: 1.5 }}>
                    <IconButton size="small" onClick={() => setCantidadSeleccionada((c) => Math.max(1, c - 1))}><Minus size={12} /></IconButton>
                    <Typography sx={{ width: 26, textAlign: "center", fontSize: 13 }}>{cantidadSeleccionada}</Typography>
                    <IconButton size="small" onClick={() => setCantidadSeleccionada((c) => c + 1)}><Plus size={12} /></IconButton>
                  </Box>
                  <Button variant="outlined" size="small" startIcon={<Plus size={12} />} disabled={!productoAutocomplete} onClick={handleAgregarProducto}>
                    Agregar
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                <FilterLabel>Resumen</FilterLabel>
                <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5, minHeight: 140, maxHeight: 280, overflowY: "auto" }}>
                  {formItems.length === 0 ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 3, color: "text.disabled", fontSize: 13 }}>
                      Sin productos agregados
                    </Box>
                  ) : (
                    formItems.map((item, idx) => (
                      <Box key={item.nombre} sx={{ px: 1.25, py: 0.875, borderTop: idx > 0 ? `1px solid ${theme.palette.divider}` : "none" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="body2" fontSize={12.5}>{item.nombre}</Typography>
                          <IconButton size="small" onClick={() => handleQuitarProducto(item.nombre)}><X size={13} /></IconButton>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.4 }}>
                          <Box sx={{ display: "flex", alignItems: "center", bgcolor: theme.palette.ahSurface2, borderRadius: 1 }}>
                            <IconButton size="small" onClick={() => handleActualizarCantidad(item.nombre, item.cantidad - 1)}><Minus size={11} /></IconButton>
                            <Typography sx={{ width: 22, textAlign: "center", fontSize: 12 }}>{item.cantidad}</Typography>
                            <IconButton size="small" onClick={() => handleActualizarCantidad(item.nombre, item.cantidad + 1)}><Plus size={11} /></IconButton>
                          </Box>
                          <Typography variant="body2" fontSize={12.5} color="text.secondary">${(item.cantidad * item.precio).toFixed(2)}</Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography fontSize={13} color="text.secondary">Total a pagar</Typography>
                  <Typography fontWeight={700} fontSize={17}>${totalFormulario.toFixed(2)}</Typography>
                </Box>

                <Button variant="contained" size="small" fullWidth disabled={formItems.length === 0 || !clienteValido} onClick={handleConfirmarVenta}>
                  Registrar venta
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Box component="footer" sx={{ pt: 2, pb: 2, borderTop: `1px solid ${theme.palette.divider}`, textAlign: "center", fontSize: 11.5, color: "text.disabled" }}>
        © 2026 Al Horno. Todos los derechos reservados a la institución educativa SENA
      </Box>
    </Box>
  );
}