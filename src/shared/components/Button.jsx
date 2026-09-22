import { Button as MuiButton } from "@mui/material";

// Variantes del diseño: primary (naranja lleno), secondary (borde suave), ghost (solo texto).
const VARIANTES = {
    primary: { variant: "contained", color: "primary" },
    secondary: {
        variant: "outlined",
        color: "inherit",
        sx: { borderColor: "divider", color: "text.primary", bgcolor: "action.hover" },
    },
    ghost: { variant: "text", color: "inherit", sx: { color: "text.secondary" } },
};

/**
 * @param {"primary"|"secondary"|"ghost"} [variant]
 * @param {"sm"|"md"} [size]
 * @param {JSX.Element} [leftIcon]
 */
export function Button({ variant = "primary", size = "md", leftIcon, children, ...rest }) {
    const { sx, ...props } = VARIANTES[variant] ?? VARIANTES.primary;

    return (
        <MuiButton
            {...props}
            size={size === "sm" ? "small" : "medium"}
            startIcon={leftIcon}
            disableElevation
            sx={{ fontSize: 13, ...sx }}
            {...rest}
        >
            {children}
        </MuiButton>
    );
}
