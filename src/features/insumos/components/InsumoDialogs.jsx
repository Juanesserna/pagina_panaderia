import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Stack,
    Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { StatusBadge } from "@shared/components";
import { formatoCodigo, getEstadoVisual, estadoVisualVariant } from "../utils/insumosHelpers";

export function EliminarInsumoDialog({ open, insumo, onClose, onConfirmar }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Eliminar Insumo</DialogTitle>
            <DialogContent>
                {insumo && (
                    <Box sx={{ textAlign: "center", py: 1 }}>
                        <Avatar sx={{ bgcolor: "error.50", color: "error.main", width: 56, height: 56, mx: "auto", mb: 2 }}>
                            <DeleteIcon />
                        </Avatar>
                        <Typography fontWeight={600}>¿Está seguro de eliminar este insumo?</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Esta acción no se puede deshacer.
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 1 }}>
                            {insumo.nombre} ({formatoCodigo(insumo.id)})
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button variant="outlined" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" onClick={onConfirmar}>
                    Confirmar Eliminación
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export function CambiarEstadoInsumoDialog({ open, insumo, onClose, onCambiar }) {
    if (!insumo) return null;
    const ev = getEstadoVisual(insumo);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Cambiar Estado</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ bgcolor: "action.hover", p: 1.5, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Estado actual:
                    </Typography>
                    <StatusBadge variant={estadoVisualVariant[ev]}>{ev}</StatusBadge>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                    Selecciona el nuevo estado para <strong>{insumo.nombre}</strong>:
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => onCambiar(!insumo.estado)}
                    sx={{ justifyContent: "flex-start", gap: 1.5, textTransform: "none" }}
                >
                    <StatusBadge variant={insumo.estado ? "danger" : "success"}>
                        {insumo.estado ? "Inactivo" : "Activo"}
                    </StatusBadge>
                    Cambiar a {insumo.estado ? "Inactivo" : "Activo"}
                </Button>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button variant="outlined" fullWidth onClick={onClose}>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
