import { Box, Typography } from "@mui/material";

/**
 * Envuelve un input (TextField, Select, etc) con una etiqueta pequeña en
 * mayúsculas ARRIBA del campo -- distinto al label flotante por defecto de
 * MUI, que queda encima del borde. Este patrón es el que usa el diseño de
 * Figma: la etiqueta siempre visible arriba, y el placeholder/ejemplo
 * dentro del campo.
 *
 * `sx` permite, por ejemplo, ocupar todo el ancho en una grilla de 2 columnas.
 *
 * Uso:
 *   <FormField label="Nombre empresa" required>
 *     <TextField placeholder="Ej. Molinos El Trigal S.A." fullWidth />
 *   </FormField>
 */
export function FormField({ label, required, children, sx }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, ...sx }}>
            <Typography
                variant="caption"
                sx={{
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: 11.5,
                }}
            >
                {label}
                {required && " *"}
            </Typography>
            {children}
        </Box>
    );
}

// sx compartido para que los TextField/Select se vean espaciosos y sin
// el label flotante encima del borde (solo usamos placeholder).
export const fieldInputSx = {
    "& .MuiOutlinedInput-input": { paddingTop: "12px", paddingBottom: "12px" },
    "& .MuiSelect-select": { paddingTop: "12px", paddingBottom: "12px" },
};
