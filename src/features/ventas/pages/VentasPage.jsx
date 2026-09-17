import { useState, useMemo, useRef } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button, IconButton,
  Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Pagination, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, Collapse, Autocomplete,
  Grid, Divider, Badge as MuiBadge,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Search, Plus, Minus, Filter, X, Download, Upload, Receipt, Trash2,
  CheckCircle, XCircle,
} from "lucide-react";
import {
  initialVentas, estadoVariant, estadoDotColor, estadoOptions,
  esTransicionValida, opcionesEstadoParaFila, usuarioAutenticado,
  catalogoClientes, catalogoPanaderia, obtenerProductosVenta,
  obtenerNombreCliente, parseFechaVenta, fechaHoyFormateada, PAGE_SIZE,
} from "@features/ventas/data/ventasMockData";

export default function VentasPage() {
  const theme = useTheme();

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

  // ---------- Abonos ----------

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

  // ---------- Filtros ----------

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

  // ---------- Nueva venta ----------

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
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <input ref={transferenciaInputRef} type="file" accept="image/*" hidden onChange={handleImagenTransferenciaSeleccionada} />
      <input ref={abonoInputRef} type="file" accept="image/*" hidden onChange={handleImagenAbonoSeleccionada} />

      {/* KPIs */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined">
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ color: theme.palette.success.main }}><CheckCircle size={20} /></Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Completados</Typography>
                <Typography variant="h6" fontWeight={700}>{completados}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined">
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ color: theme.palette.error.main }}><XCircle size={20} /></Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Cancelados</Typography>
                <Typography variant="h6" fontWeight={700}>{cancelados}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card variant="outlined">
        {/* Toolbar */}
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, px: 2.5, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mr: "auto" }}>Registro de ventas</Typography>
          <TextField
            size="small"
            placeholder="Buscar pedido o cliente…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            InputProps={{ startAdornment: <Search size={14} style={{ marginRight: 6, opacity: 0.5 }} /> }}
            sx={{ width: 220 }}
          />
          <Button variant="contained" size="small" startIcon={<Plus size={14} />} onClick={handleNuevaVenta}>
            Nueva venta
          </Button>
          <Button
            variant={filtrosActivos ? "contained" : "outlined"}
            size="small"
            startIcon={<Filter size={14} />}
            onClick={() => setShowFiltros((v) => !v)}
          >
            Filtrar
            {filtrosActivos && (
              <MuiBadge
                badgeContent={[estadoFilter, metodoFilter, cantidadMin, cantidadMax, totalMin, totalMax, fechaDesde, fechaHasta].filter(Boolean).length}
                color="secondary"
                sx={{ ml: 1.5 }}
              />
            )}
          </Button>
        </Box>

        {/* Filtros */}
        <Collapse in={showFiltros}>
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 2, px: 2.5, py: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.action.hover }}>
            <FormControl size="small" sx={{ width: 160 }}>
              <InputLabel>Estado</InputLabel>
              <Select label="Estado" value={estadoFilter} onChange={(e) => { setEstadoFilter(e.target.value); setPage(1); }}>
                <MenuItem value="">Todos</MenuItem>
                {estadoOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 150 }}>
              <InputLabel>Método</InputLabel>
              <Select label="Método" value={metodoFilter} onChange={(e) => { setMetodoFilter(e.target.value); setPage(1); }}>
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="efectivo">Efectivo</MenuItem>
                <MenuItem value="tarjeta">Tarjeta</MenuItem>
                <MenuItem value="transferencia">Transferencia</MenuItem>
              </Select>
            </FormControl>

            <TextField size="small" type="number" label="Cantidad mín." value={cantidadMin} onChange={(e) => { setCantidadMin(e.target.value); setPage(1); }} sx={{ width: 110 }} />
            <TextField size="small" type="number" label="Cantidad máx." value={cantidadMax} onChange={(e) => { setCantidadMax(e.target.value); setPage(1); }} sx={{ width: 110 }} />
            <TextField size="small" type="number" label="Total mín." value={totalMin} onChange={(e) => { setTotalMin(e.target.value); setPage(1); }} sx={{ width: 110 }} />
            <TextField size="small" type="number" label="Total máx." value={totalMax} onChange={(e) => { setTotalMax(e.target.value); setPage(1); }} sx={{ width: 110 }} />
            <TextField size="small" type="date" label="Desde" InputLabelProps={{ shrink: true }} value={fechaDesde} onChange={(e) => { setFechaDesde(e.target.value); setPage(1); }} sx={{ width: 150 }} />
            <TextField size="small" type="date" label="Hasta" InputLabelProps={{ shrink: true }} value={fechaHasta} onChange={(e) => { setFechaHasta(e.target.value); setPage(1); }} sx={{ width: 150 }} />

            {filtrosActivos && <Button size="small" onClick={limpiarFiltros}>Limpiar filtros</Button>}
          </Box>
        </Collapse>

        {/* Tabla */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel active={sortKey === "id"} direction={sortDir} onClick={() => handleSort("id")}>ID</TableSortLabel>
                </TableCell>
                <TableCell>NIT/Cédula</TableCell>
                <TableCell>Método</TableCell>
                <TableCell align="right">
                  <TableSortLabel active={sortKey === "total"} direction={sortDir} onClick={() => handleSort("total")}>Total</TableSortLabel>
                </TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.disabled" }}>Sin ventas encontradas</TableCell></TableRow>
              )}
              {paginated.map((r) => {
                const bloqueado = r.estado === "cancelado";
                const puedeVerComprobante = r.estado === "completado" || r.estado === "cancelado";
                const abonosCount = abonos.filter((a) => a.idVenta === r.id).length;
                return (
                  <TableRow key={r.id} hover>
                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 500 }}>{r.id}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", color: "text.secondary" }}>{r.nit || "—"}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {r.metodo ? r.metodo.charAt(0).toUpperCase() + r.metodo.slice(1) : "—"}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>${r.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}
                        color={estadoVariant[r.estado]}
                        onClick={bloqueado ? undefined : () => abrirModalEstado(r)}
                        clickable={!bloqueado}
                        title={bloqueado ? "Una venta cancelada no se puede modificar" : "Cambiar estado"}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "text.disabled", fontSize: 12 }}>{r.fecha} {r.hora}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Button size="small" startIcon={<Receipt size={13} />} onClick={() => abrirModalAbono(r)}>
                          {abonosCount > 0 ? `Abonos (${abonosCount})` : "Abonos"}
                        </Button>
                        <Button
                          size="small"
                          disabled={!puedeVerComprobante}
                          onClick={() => { setSelected(r); setShowModal(true); }}
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

        <Box sx={{ display: "flex", justifyContent: "center", px: 2.5, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} size="small" />
        </Box>
      </Card>

      {/* Dialog: Cambiar estado */}
      <Dialog open={showEstadoModal} onClose={cerrarModalEstado} maxWidth="xs" fullWidth>
        <DialogTitle>Cambiar estado</DialogTitle>
        <DialogContent>
          {ventaEstadoModal && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, pt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Venta <b>{ventaEstadoModal.id}</b> · {obtenerNombreCliente(ventaEstadoModal)}
              </Typography>
              {opcionesEstadoParaFila(ventaEstadoModal.estado).map((o) => {
                const activo = estadoSeleccionadoModal === o.value;
                return (
                  <Box
                    key={o.value}
                    onClick={() => setEstadoSeleccionadoModal(o.value)}
                    sx={{
                      display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer",
                      border: `1px solid ${activo ? theme.palette.text.primary : theme.palette.divider}`,
                      borderRadius: 1.5, px: 1.5, py: 1,
                      bgcolor: activo ? theme.palette.action.selected : "transparent",
                    }}
                  >
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: estadoDotColor[o.value] }} />
                    <Typography variant="body2" sx={{ flex: 1 }}>{o.label}</Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModalEstado}>Cancelar</Button>
          <Button
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
        <DialogTitle>Comprobante de venta</DialogTitle>
        <DialogContent>
          {selected && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <Box
                ref={comprobanteRef}
                sx={{
                  width: "100%", maxWidth: 360, fontFamily: "monospace",
                  border: `2px dashed ${theme.palette.divider}`, borderRadius: 1,
                  bgcolor: theme.palette.background.default,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, px: 3, pt: 2, pb: 2, borderBottom: `1px dashed ${theme.palette.divider}` }}>
                  <Typography sx={{ fontWeight: 700, letterSpacing: 3, fontSize: 14 }}>PANADERÍA</Typography>
                  <Typography variant="caption" color="text.secondary">Comprobante de venta</Typography>
                  <Typography variant="caption" sx={{ mt: 1 }}>{selected.id}</Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, px: 3, py: 1.5, borderBottom: `1px dashed ${theme.palette.divider}`, fontSize: 12 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><span>Cliente</span><b>{obtenerNombreCliente(selected)}</b></Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><span>Fecha</span><span>{selected.fecha} · {selected.hora}</span></Box>
                  {selected.nit && <Box sx={{ display: "flex", justifyContent: "space-between" }}><span>NIT/Cédula</span><span>{selected.nit}</span></Box>}
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Pago</span><span>{selected.metodo ? selected.metodo.charAt(0).toUpperCase() + selected.metodo.slice(1) : "—"}</span>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, px: 3, py: 1.5, borderBottom: `1px dashed ${theme.palette.divider}` }}>
                  {obtenerProductosVenta(selected).map((p, idx) => (
                    <Box key={idx} sx={{ display: "flex", gap: 1, fontSize: 12 }}>
                      <span>{p.cantidad}x</span>
                      <span style={{ flex: 1 }}>{p.nombre}</span>
                      <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, px: 3, py: 1.5, borderBottom: `1px dashed ${theme.palette.divider}` }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "text.secondary" }}>
                    <span>Artículos</span><span>{selected.productos}</span>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", pt: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>TOTAL</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 18 }}>${selected.total.toFixed(2)}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, px: 3, py: 2 }}>
                  <Chip size="small" label={selected.estado.charAt(0).toUpperCase() + selected.estado.slice(1)} color={estadoVariant[selected.estado]} />
                  <Typography variant="caption" color="text.disabled">¡Gracias por su compra!</Typography>
                </Box>
              </Box>

              <Box sx={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>Captura de comprobante</Typography>
                  <Button size="small" startIcon={<Upload size={13} />} onClick={() => handleClickCargarTransferencia(selected.id)}>
                    {selected.imagenTransferencia ? "Reemplazar" : "Cargar"}
                  </Button>
                </Box>
                {selected.imagenTransferencia ? (
                  <Box component="img" src={selected.imagenTransferencia} alt="Comprobante" sx={{ width: "100%", borderRadius: 1, border: `1px solid ${theme.palette.divider}`, maxHeight: 256, objectFit: "contain" }} />
                ) : (
                  <Box sx={{ border: `1px dashed ${theme.palette.divider}`, borderRadius: 1, py: 3, textAlign: "center", color: "text.disabled", fontSize: 12 }}>
                    Sin comprobante cargado
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" startIcon={<Download size={13} />} onClick={handleDescargarComprobante}>Descargar comprobante</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Abonos */}
      <Dialog open={showAbonoModal} onClose={cerrarModalAbono} maxWidth="sm" fullWidth>
        <DialogTitle>Abonos de la venta</DialogTitle>
        <DialogContent>
          {ventaAbonoModal && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Venta <b>{ventaAbonoModal.id}</b> · {obtenerNombreCliente(ventaAbonoModal)}
              </Typography>

              <Grid container spacing={1} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5, p: 1.5, mx: 0 }}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">Total venta</Typography>
                  <Typography fontWeight={600}>${ventaAbonoModal.total.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">Abonado</Typography>
                  <Typography fontWeight={600}>${totalAbonadoVenta.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">Saldo pendiente</Typography>
                  <Typography fontWeight={600} color={saldoPendienteVenta <= 0 ? "success.main" : "text.primary"}>
                    ${saldoPendienteVenta.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                Historial de abonos {abonosDeVenta.length > 0 ? `(${abonosDeVenta.length})` : ""}
              </Typography>

              {abonosDeVenta.length === 0 ? (
                <Box sx={{ border: `1px dashed ${theme.palette.divider}`, borderRadius: 1, py: 3, textAlign: "center", color: "text.disabled", fontSize: 12 }}>
                  Aún no hay abonos registrados para esta venta
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 220, overflowY: "auto" }}>
                  {abonosDeVenta.map((a) => {
                    const confirmando = abonoAConfirmarEliminar === a.id;
                    return (
                      <Box
                        key={a.id}
                        sx={{
                          display: "flex", alignItems: "center", gap: 1.5,
                          border: `1px solid ${confirmando ? theme.palette.error.main : theme.palette.divider}`,
                          borderRadius: 1.5, px: 1.5, py: 1,
                          bgcolor: confirmando ? theme.palette.error.dim : "transparent",
                        }}
                      >
                        <Box
                          component="img"
                          src={a.urlComprobante}
                          alt="Comprobante"
                          onClick={() => window.open(a.urlComprobante, "_blank")}
                          sx={{ width: 44, height: 44, borderRadius: 1, border: `1px solid ${theme.palette.divider}`, objectFit: "cover", cursor: "pointer" }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption" sx={{ fontFamily: "monospace" }}>{a.id}</Typography>
                            <Typography variant="caption" color="text.disabled">{a.fecha}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption" color="text.secondary">
                              {a.metodoPago.charAt(0).toUpperCase() + a.metodoPago.slice(1)}
                            </Typography>
                            <Typography fontWeight={600}>${a.monto.toFixed(2)}</Typography>
                          </Box>
                        </Box>
                        <IconButton size="small" color={confirmando ? "error" : "default"} onClick={() => handleClickEliminarAbono(a.id)}>
                          <Trash2 size={14} />
                        </IconButton>
                      </Box>
                    );
                  })}
                </Box>
              )}

              <Divider />

              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>Nuevo abono</Typography>

              {saldoPendienteVenta <= 0 ? (
                <Box sx={{ border: `1px dashed ${theme.palette.divider}`, borderRadius: 1, py: 2.5, textAlign: "center", color: "success.main", fontSize: 12 }}>
                  Esta venta ya está completamente pagada.
                </Box>
              ) : !abonoComprobante ? (
                <Button
                  variant="outlined"
                  onClick={() => abonoInputRef.current?.click()}
                  sx={{ display: "flex", flexDirection: "column", gap: 1, py: 4, borderStyle: "dashed" }}
                >
                  <Upload size={18} />
                  Subir captura del comprobante
                </Button>
              ) : (
                <>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>Comprobante</Typography>
                    <Button size="small" startIcon={<Upload size={13} />} onClick={() => abonoInputRef.current?.click()}>Reemplazar</Button>
                  </Box>
                  <Box component="img" src={abonoComprobante} alt="Comprobante" sx={{ width: "100%", borderRadius: 1, border: `1px solid ${theme.palette.divider}`, maxHeight: 220, objectFit: "contain" }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl size="small" fullWidth>
                        <InputLabel>Método de pago</InputLabel>
                        <Select label="Método de pago" value={abonoMetodo} onChange={(e) => setAbonoMetodo(e.target.value)}>
                          <MenuItem value="efectivo">💵 Efectivo</MenuItem>
                          <MenuItem value="tarjeta">💳 Tarjeta</MenuItem>
                          <MenuItem value="transferencia">🏦 Transferencia</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        size="small" fullWidth type="number" label="Monto"
                        helperText={`Máximo: $${saldoPendienteVenta.toFixed(2)}`}
                        value={abonoMonto}
                        onChange={(e) => handleCambiarMontoAbono(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModalAbono}>Cerrar</Button>
          {abonoComprobante && (
            <Button variant="contained" disabled={!montoAbonoValido} onClick={handleRegistrarAbono}>Registrar abono</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog: Nueva venta */}
      <Dialog open={showVentaModal} onClose={() => setShowVentaModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nueva venta</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5, px: 2, py: 1.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span>ID de venta</span><b style={{ fontFamily: "monospace" }}>{formId}</b>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span>Fecha</span><span>{formFecha} · {formHora}</span>
                  </Box>
                </Box>

                <Autocomplete
                  size="small"
                  options={catalogoClientes}
                  getOptionLabel={(c) => `${c.nit} — ${c.nombre}`}
                  value={clienteSeleccionado}
                  onChange={(_, value) => setClienteSeleccionado(value)}
                  renderInput={(params) => <TextField {...params} label="NIT/Cédula" placeholder="Buscar por NIT o nombre…" />}
                />

                <FormControl size="small" fullWidth>
                  <InputLabel>Estado inicial</InputLabel>
                  <Select label="Estado inicial" value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)}>
                    {estadoOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                  </Select>
                </FormControl>

                <Divider />

                <Autocomplete
                  size="small"
                  options={catalogoPanaderia}
                  getOptionLabel={(p) => p.nombre}
                  value={productoAutocomplete}
                  onChange={(_, value) => setProductoAutocomplete(value)}
                  renderOption={(props, p) => (
                    <li {...props} key={p.nombre}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{p.nombre}</span><span style={{ fontFamily: "monospace" }}>${p.precio.toFixed(2)}</span>
                      </Box>
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Producto" placeholder="Buscar producto…" />}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                    <IconButton size="small" onClick={() => setCantidadSeleccionada((c) => Math.max(1, c - 1))}><Minus size={13} /></IconButton>
                    <Typography sx={{ width: 32, textAlign: "center" }}>{cantidadSeleccionada}</Typography>
                    <IconButton size="small" onClick={() => setCantidadSeleccionada((c) => c + 1)}><Plus size={13} /></IconButton>
                  </Box>
                  <Button variant="outlined" size="small" startIcon={<Plus size={13} />} disabled={!productoAutocomplete} onClick={handleAgregarProducto}>
                    Agregar
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>Resumen</Typography>
                <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5, minHeight: 160, maxHeight: 320, overflowY: "auto" }}>
                  {formItems.length === 0 ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 4, color: "text.disabled", fontSize: 14 }}>
                      Sin productos agregados
                    </Box>
                  ) : (
                    formItems.map((item, idx) => (
                      <Box key={item.nombre} sx={{ px: 1.5, py: 1, borderTop: idx > 0 ? `1px solid ${theme.palette.divider}` : "none" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="body2">{item.nombre}</Typography>
                          <IconButton size="small" onClick={() => handleQuitarProducto(item.nombre)}><X size={14} /></IconButton>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                            <IconButton size="small" onClick={() => handleActualizarCantidad(item.nombre, item.cantidad - 1)}><Minus size={12} /></IconButton>
                            <Typography sx={{ width: 26, textAlign: "center", fontSize: 13 }}>{item.cantidad}</Typography>
                            <IconButton size="small" onClick={() => handleActualizarCantidad(item.nombre, item.cantidad + 1)}><Plus size={12} /></IconButton>
                          </Box>
                          <Typography variant="body2" color="text.secondary">${(item.cantidad * item.precio).toFixed(2)}</Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Total a pagar</Typography>
                  <Typography variant="h6" fontWeight={700}>${totalFormulario.toFixed(2)}</Typography>
                </Box>

                <Button variant="contained" disabled={formItems.length === 0 || !clienteValido} onClick={handleConfirmarVenta}>
                  Registrar venta
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Box component="footer" sx={{ pt: 2, pb: 2, borderTop: `1px solid ${theme.palette.divider}`, textAlign: "center", fontSize: 12, color: "text.disabled" }}>
        © 2026 Al Horno. Todos los derechos reservados a la institución educativa SENA
      </Box>
    </Box>
  );
}