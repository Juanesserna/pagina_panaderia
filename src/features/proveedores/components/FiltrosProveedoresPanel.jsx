import { Box, Button, MenuItem, TextField } from "@mui/material";
import { FormField, filtrosPanelSx, filtroFieldSx } from "@shared/components";

/**
 * Filtros en línea, debajo del toolbar de la tabla (no lateral, no drawer).
 * Aplica en vivo: cada cambio actualiza filtrosActivos directamente,
 * sin botón "Aplicar" intermedio -- igual que en el diseño de Figma.
 */
export function FiltrosProveedoresPanel({ filtrosActivos, onChange, onLimpiar }) {
    const set = (campo) => (e) => onChange({ ...filtrosActivos, [campo]: e.target.value });

    return (
        <Box sx={filtrosPanelSx}>
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

            <Box sx={{ flex: "1 1 170px", minWidth: 140 }}>
                <FormField label="Empresa">
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Buscar empresa..."
                        value={filtrosActivos.nombre}
                        onChange={set("nombre")}
                        sx={filtroFieldSx}
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
                        sx={filtroFieldSx}
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
                        sx={filtroFieldSx}
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
