// Estilos del panel de filtros en línea (Insumos, Proveedores, Producción...).
// Franja debajo del toolbar de la tabla, con etiqueta arriba de cada campo
// en mayúsculas, campos compactos y "Limpiar filtros" alineado a la derecha.
// Centralizado aquí para que todos los módulos se vean idénticos.

export const filtrosPanelSx = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    columnGap: 2.5,
    rowGap: 2,
    px: 2.5,
    py: 2.25,
    borderBottom: "1px solid",
    borderColor: "divider",
    bgcolor: (theme) => theme.alhorno.surface2,
};

// sx compartido para los TextField/Select del panel: campo blanco con
// borde suave (contraste sobre el fondo tostado del panel) y altura
// compacta, igual a la referencia de Figma.
export const filtroFieldSx = {
    bgcolor: "background.paper",
    "& .MuiOutlinedInput-root": { bgcolor: "background.paper" },
    "& .MuiOutlinedInput-input": { paddingTop: "9px", paddingBottom: "9px" },
    "& .MuiSelect-select": { paddingTop: "9px", paddingBottom: "9px" },
};

// Ancho recomendado por tipo de campo, para que las columnas queden
// parejas entre módulos.
export const filtroAnchoSx = {
    xs: { flex: "1 1 100%", minWidth: 0 },
    sm: (px) => ({ flex: `1 1 ${px}px`, minWidth: px * 0.75 }),
};
