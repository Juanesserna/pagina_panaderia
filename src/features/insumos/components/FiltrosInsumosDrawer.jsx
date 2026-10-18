import { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    TextField,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getCategorias, getUnidadesMedida } from "../services/insumosService";

const NIVELES_STOCK = [
    { value: "", label: "Todos" },
    { value: "bajo", label: "Stock Bajo" },
    { value: "normal", label: "Stock Normal" },
    { value: "sin", label: "Sin Stock" },
];

export function FiltrosInsumosDrawer({ open, onClose, filtrosActivos, onAplicar, onLimpiar }) {
    const [form, setForm] = useState(filtrosActivos);
    const categorias = getCategorias();
    const unidades = getUnidadesMedida();

    // Re-sincroniza el formulario cada vez que se abre el drawer
    useEffect(() => {
        if (open) setForm(filtrosActivos);
    }, [open, filtrosActivos]);

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 320, display: "flex", flexDirection: "column", height: "100%" }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Filtros
                    </Typography>
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Stack>
                <Divider />

                <Box sx={{ p: 2, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField
                        select
                        label="Categoría"
                        size="small"
                        value={form.idCategoria}
                        onChange={(e) => setForm((p) => ({ ...p, idCategoria: e.target.value }))}
                    >
                        <MenuItem value="">Todas las categorías</MenuItem>
                        {categorias.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                                {c.nombre}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Estado"
                        size="small"
                        value={form.estado}
                        onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))}
                    >
                        <MenuItem value="">Todos los estados</MenuItem>
                        <MenuItem value="true">Activo</MenuItem>
                        <MenuItem value="false">Inactivo</MenuItem>
                    </TextField>

                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                            Nivel de stock
                        </Typography>
                        <RadioGroup
                            value={form.nivelStock}
                            onChange={(e) => setForm((p) => ({ ...p, nivelStock: e.target.value }))}
                        >
                            {NIVELES_STOCK.map((n) => (
                                <FormControlLabel key={n.label} value={n.value} control={<Radio size="small" />} label={n.label} />
                            ))}
                        </RadioGroup>
                    </Box>

                    <TextField
                        select
                        label="Unidad de medida"
                        size="small"
                        value={form.idUnidadMedida}
                        onChange={(e) => setForm((p) => ({ ...p, idUnidadMedida: e.target.value }))}
                    >
                        <MenuItem value="">Todas</MenuItem>
                        {unidades.map((u) => (
                            <MenuItem key={u.id} value={u.id}>
                                {u.abreviatura}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Stack direction="row" spacing={1.5}>
                        <TextField
                            label="Stock mín. desde"
                            type="number"
                            size="small"
                            fullWidth
                            value={form.stockMinimoDesde}
                            onChange={(e) => setForm((p) => ({ ...p, stockMinimoDesde: e.target.value }))}
                        />
                        <TextField
                            label="Stock mín. hasta"
                            type="number"
                            size="small"
                            fullWidth
                            value={form.stockMinimoHasta}
                            onChange={(e) => setForm((p) => ({ ...p, stockMinimoHasta: e.target.value }))}
                        />
                    </Stack>
                </Box>

                <Divider />
                <Stack spacing={1} sx={{ p: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            onAplicar(form);
                            onClose();
                        }}
                    >
                        Aplicar filtros
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setForm(filtrosActivos);
                            onLimpiar();
                        }}
                    >
                        Limpiar filtros
                    </Button>
                    <Button variant="text" onClick={onClose}>
                        Cancelar
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
}
