import { Box, Button, MenuItem, TextField } from "@mui/material";
import { FormField, filtrosPanelSx } from "@shared/components";

// Overrides SOLO para este panel (Proveedores): en el Figma de referencia
// los roles de color quedan al revés de lo que traía el estilo compartido
// -- la franja de filtros va casi blanca (como el resto de la tarjeta) y
// son los CAMPOS los que llevan el tono tostado (surface2), no al revés.
// Se sobreescribe acá nomás para no tocar filtrosPanelStyles.js, que usa
// también Insumos.
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
 * sin botón "Aplicar" intermedio -- igual que en el diseño de Figma.
 */
export function FiltrosProveedoresPanel({ filtrosActivos, onChange, onLimpiar }) {
    const set = (campo) => (e) => onChange({ ...filtrosActivos, [campo]: e.target.value });

    return (
        <Box sx={panelSxLocal}>
            <Box sx={{ flex: "1 1 130px", minWidth: 110 }}>
                <FormField label="Estado">
                    <TextField
                        select
                        size="small"
                        fullWidth
                        displayEmpty
                        value={filtrosActivos.estado}
                        onChange={set("estado")}
                        sx={filtroFieldSxLocal}
                        SelectProps={{
                            renderValue: (v) => (v === "true" ? "Activo" : v === "false" ? "Inactivo" : "Todos"),
                        }}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="true">Activo</MenuItem>
                        <MenuItem value="false">Inactivo</MenuItem>
                    </TextField>
                </FormField>
            </Box>

            <Box sx={{ flex: "1 1 170px", minWidth: 140 }}>
                <FormField label="Empresa">
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Buscar empresa..."
                        value={filtrosActivos.nombre}
                        onChange={set("nombre")}
                        sx={filtroFieldSxLocal}
                    />
                </FormField>
            </Box>

            <Box sx={{ flex: "1 1 150px", minWidth: 120 }}>
                <FormField label="NIT">
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Buscar NIT..."
                        value={filtrosActivos.nit}
                        onChange={set("nit")}
                        sx={filtroFieldSxLocal}
                    />
                </FormField>
            </Box>

            <Box sx={{ flex: "1 1 170px", minWidth: 140 }}>
                <FormField label="Contacto">
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Nombre contacto..."
                        value={filtrosActivos.nombreContacto}
                        onChange={set("nombreContacto")}
                        sx={filtroFieldSxLocal}
                    />
                </FormField>
            </Box>

            <Box sx={{ flex: "1 1 190px", minWidth: 160 }}>
                <FormField label="Correo">
                    <TextField
                        size="small"
                        fullWidth
                        type="email"
                        placeholder="correo@empresa.com"
                        value={filtrosActivos.email}
                        onChange={set("email")}
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
