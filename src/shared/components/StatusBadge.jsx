import { Chip, Box } from "@mui/material";

const VARIANT_COLOR = {
    success: "success",
    warning: "warning",
    danger: "error",
};

/**
 * Reemplazo del "Badge" con punto de color (Activo / Stock Bajo / Inactivo).
 * Reutilizable en 2+ features -> shared/.
 *
 * @param {"success"|"warning"|"danger"} [variant]
 * @param {boolean} [dot] - muestra el puntito de color antes del texto
 * @param {React.ReactNode} children - texto del estado
 */
export function StatusBadge({ variant = "success", dot = true, children }) {
    const color = VARIANT_COLOR[variant] ?? "default";

    return (
        <Chip
            size="small"
            label={children}
            icon={
                dot ? (
                    <Box
                        component="span"
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: `${color}.main`,
                            display: "inline-block",
                        }}
                    />
                ) : undefined
            }
            sx={{
                fontWeight: 500,
                border: "none",
                bgcolor: (theme) => `${theme.palette[color].main}1F`,
                color: (theme) => theme.palette[color].main,
                "& .MuiChip-icon": { ml: 1.2, mr: -0.5 },
            }}
        />
    );
}
