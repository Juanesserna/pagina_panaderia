import { Box, Button, MenuItem, TextField } from "@mui/material";
import { FormField, filtrosPanelSx, filtroFieldSx } from "@shared/components";
import { getCategorias, getUnidadesMedida } from "../services/insumosService";

const NIVELES_STOCK = [
    { value: "", label: "Todos" },
    { value: "bajo", label: "Stock Bajo" },
    { value: "normal", label: "Stock Normal" },
    { value: "sin", label: "Sin Stock" },
];

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
        <Box sx={filtrosPanelSx}>
            <Box sx={{ flex: "1 1 170px", minWidth: 150 }}>
                <FormField label="Categoría">
                    <TextField
                        select
                        size="small"
                        fullWidth
                        value={filtrosActivos.idCategoria}
                        onChange={set("idCategoria")}
                        sx={filtroFieldSx}
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
                        sx={filtroFieldSx}
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
                        sx={filtroFieldSx}
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
                        sx={filtroFieldSx}
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
                        sx={filtroFieldSx}
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
                        sx={filtroFieldSx}
                    />
                </FormField>
            </Box>

            <Button variant="text" size="small" onClick={onLimpiar} sx={{ mb: 0.5, whiteSpace: "nowrap" }}>
                Limpiar filtros
            </Button>
        </Box>
    );
}
