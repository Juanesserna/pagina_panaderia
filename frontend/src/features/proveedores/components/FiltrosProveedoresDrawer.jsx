import { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    TextField,
    MenuItem,
    Stack,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function FiltrosProveedoresDrawer({ open, onClose, filtrosActivos, onAplicar, onLimpiar }) {
    const [form, setForm] = useState(filtrosActivos);

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
                        label="Estado"
                        size="small"
                        value={form.estado}
                        onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))}
                    >
                        <MenuItem value="">Todos los estados</MenuItem>
                        <MenuItem value="true">Activo</MenuItem>
                        <MenuItem value="false">Inactivo</MenuItem>
                    </TextField>

                    <TextField
                        label="Empresa"
                        size="small"
                        placeholder="Buscar empresa..."
                        value={form.nombre}
                        onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                    />

                    <TextField
                        label="NIT"
                        size="small"
                        placeholder="Buscar NIT..."
                        value={form.nit}
                        onChange={(e) => setForm((p) => ({ ...p, nit: e.target.value }))}
                    />

                    <TextField
                        label="Contacto"
                        size="small"
                        placeholder="Nombre contacto..."
                        value={form.nombreContacto}
                        onChange={(e) => setForm((p) => ({ ...p, nombreContacto: e.target.value }))}
                    />

                    <TextField
                        label="Correo"
                        size="small"
                        type="email"
                        placeholder="correo@empresa.com"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    />
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
