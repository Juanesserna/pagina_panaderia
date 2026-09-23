import { useId } from "react";
import { Dialog, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ANCHOS = { sm: 420, md: 560, lg: 680, xl: 860 };

/**
 * Modal flotante centrado sobre la página (fondo oscurecido + blur), igual
 * que el de "Nueva Orden de Compra" en Figma: cabecera con título y X, cuerpo
 * con scroll propio y (opcional) pie fijo con <ModalFooter>.
 *
 * Reutilizable por cualquier módulo -> shared/.
 *
 * @param {boolean} open
 * @param {() => void} onClose - X, tecla Esc o clic en el fondo
 * @param {string} title
 * @param {string} [subtitle]
 * @param {"sm"|"md"|"lg"|"xl"} [size]
 */
export function Modal({ open, onClose, title, subtitle, size = "md", children }) {
    const titleId = useId();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth={false}
            scroll="paper"
            aria-labelledby={titleId}
            slotProps={{
                backdrop: {
                    sx: { backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(3px)" },
                },
                paper: {
                    sx: {
                        maxWidth: ANCHOS[size] ?? ANCHOS.md,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.45)",
                    },
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography id={titleId} component="h2" sx={{ fontSize: 15, fontWeight: 700, color: "text.primary" }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>{subtitle}</Typography>
                    )}
                </Box>
                <IconButton size="small" onClick={onClose} aria-label="Cerrar" sx={{ color: "text.secondary" }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    p: 3,
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": { width: 6 },
                    "&::-webkit-scrollbar-thumb": { bgcolor: "divider", borderRadius: 3 },
                }}
            >
                {children}
            </Box>
        </Dialog>
    );
}

/**
 * Barra de acciones (Cancelar / Guardar...) que queda pegada al borde
 * inferior del modal mientras el cuerpo hace scroll. Va como ÚLTIMO hijo
 * del contenido del modal.
 */
export function ModalFooter({ children }) {
    return (
        <Box
            sx={{
                position: "sticky",
                bottom: "-24px", // compensa el padding (p: 3) del cuerpo para quedar pegado al borde
                zIndex: 1,
                mx: -3,
                mb: -3,
                px: 3,
                py: 2,
                display: "flex",
                justifyContent: "flex-end",
                flexWrap: "wrap",
                gap: 1.5,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }}
        >
            {children}
        </Box>
    );
}
