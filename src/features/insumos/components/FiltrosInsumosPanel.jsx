import { Box, Button, MenuItem, TextField } from "@mui/material";
import { FormField, filtrosPanelSx } from "@shared/components";
import { getCategorias, getUnidadesMedida } from "../services/insumosService";

const NIVELES_STOCK = [
    { value: "", label: "Todos" },
    { value: "bajo", label: "Stock Bajo" },
    { value: "normal", label: "Stock Normal" },
    { value: "sin", label: "Sin Stock" },
];

// Overrides SOLO para este panel (Insumos), igual que en Proveedores:
// el panel queda casi blanco (como el resto de la tarjeta) y son los
// CAMPOS los que llevan el tono tostado (surface2). Se sobreescribe acá
// nomás para no tocar filtrosPanelStyles.js, que usa también Producción.
const panelSxLocal = { ...filtrosPanelSx, bgcolor: "background.paper" };

const filtroFieldSxLocal = {
    bgcolor: (theme) => theme.alhorno.surface2,
    "& .MuiOutlinedInput-root": { bgcolor: (theme) => theme.alhorno.surface2 },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
    "& .MuiOutlinedInput-input": { paddingTop: "9px", paddingBottom: "9px" },
    "& .MuiSelect-select": { paddingTop: "9px", paddingBottom: "9px" },
};

/**
 * Filtros en línea, debajo del toolbar de la tabla (no lateral, no drawer).
 * Aplica en vivo: cada cambio actualiza filtrosActivos directamente,
 * mismo patrón y estilo que FiltrosProveedoresPanel.
 */
export function FiltrosInsumosPanel({ filtrosActivos, onChange, onLimpiar }) {
    const categorias = getCategorias();
    const unidades = getUnidadesMedida();
    const set = (campo) => (e) => onChange({ ...filtrosActivos, [campo]: e.target.value });

    return (
        <Box sx={panelSxLocal}>
            <Box sx={{ flex: "1 1 170px", minWidth: 150 }}>
                <FormField label="Categoría">
                    <TextField
                        select
                        size="small"
                        fullWidth
                        value={filtrosActivos.idCategoria}
                        onChange={set("idCategoria")}
                        sx={filtroFieldSxLocal}
                    >
                        <MenuItem value="">Todas</MenuItem>
                        {categorias.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                                {c.nombre}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormField>
            </Box>

            <Box sx={{ flex: "1 1 130px", minWidth: 110 }}>
                <FormField label="Estado">
                    <TextField
                        select
                        size="small"
                        fullWidth
                        value={filtrosActivos.estado}
                        onChange={set("estado")}
                        sx={filtroFieldSxLocal}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="true">Activo</MenuItem>
                        <MenuItem value="false">Inactivo</MenuItem>
                    </TextField>
                </FormField>
            </Box>

            <Box sx={{ flex: "1 1 150px", minWidth: 130 }}>
                <FormField label="Nivel de stock">
                    <TextField
                        select
                        size="small"
                        fullWidth
                        value={filtrosActivos.nivelStock}
                        onChange={set("nivelStock")}
                        sx={filtroFieldSxLocal}
                    >
                        {NIVELES_STOCK.map((n) => (
                            <MenuItem key={n.value || "todos"} value={n.value}>
                                {n.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormField>
            </Box>

            <Box sx={{ flex: "1 1 130px", minWidth: 110 }}>
                <FormField label="Unidad">
                    <TextField
                        select
                        size="small"
                        fullWidth
                        value={filtrosActivos.idUnidadMedida}
                        onChange={set("idUnidadMedida")}
                        sx={filtroFieldSxLocal}
                    >
                        <MenuItem value="">Todas</MenuItem>
                        {unidades.map((u) => (
                            <MenuItem key={u.id} value={u.id}>
                                {u.abreviatura}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormField>
            </Box>

            <Box sx={{ flex: "1 1 110px", minWidth: 100 }}>
                <FormField label="Stock mín.">
                    <TextField
                        type="number"
                        size="small"
                        fullWidth
                        placeholder="0"
                        value={filtrosActivos.stockMinimoDesde}
                        onChange={set("stockMinimoDesde")}
                        sx={filtroFieldSxLocal}
                    />
                </FormField>
            </Box>

            <Box sx={{ flex: "1 1 110px", minWidth: 100 }}>
                <FormField label="Stock máx.">
                    <TextField
                        type="number"
                        size="small"
                        fullWidth
                        placeholder="Sin límite"
                        value={filtrosActivos.stockMinimoHasta}
                        onChange={set("stockMinimoHasta")}
                        sx={filtroFieldSxLocal}
                    />
                </FormField>
            </Box>

            <Button variant="text" size="small" onClick={onLimpiar} sx={{ mb: 0.5, whiteSpace: "nowrap" }}>
                Limpiar filtros
            </Button>
        </Box>
    );
}
