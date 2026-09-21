// Estilos compartidos de tablas (Insumos, Proveedores, ...).
// Centralizados aquí para que todos los módulos se vean IDÉNTICOS y se
// puedan ajustar desde un solo archivo.

// Cabecera: etiquetas pequeñas en mayúsculas, gris, sin negrita fuerte.
export const tableHeadCellSx = {
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontSize: 11,
    fontWeight: 600,
    color: "text.secondary",
    whiteSpace: "nowrap",
    py: 1.5,
    px: 2.5,
    borderBottom: "1px solid",
    borderColor: "divider",
};

// Celdas del cuerpo: filas altas y aireadas como en el diseño.
export const tableBodyCellSx = {
    py: 1.75,
    px: 2.5,
    borderBottom: "1px solid",
    borderColor: "divider",
    fontSize: 13.5,
};

// Código (PRV-001 / INS-001): monoespaciado y en color de marca.
export const codigoCellSx = {
    ...tableBodyCellSx,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 11.5,
    letterSpacing: 0.3,
    color: "primary.main",
    whiteSpace: "nowrap",
};

// Nombre principal de la fila.
export const nombreCellSx = {
    ...tableBodyCellSx,
    fontWeight: 600,
};

// Datos secundarios monoespaciados (NIT, cantidades).
export const monoCellSx = {
    ...tableBodyCellSx,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 11.5,
    color: "text.secondary",
    whiteSpace: "nowrap",
};

// Correo / enlaces.
export const linkCellSx = {
    ...tableBodyCellSx,
    fontSize: 12.5,
    color: "primary.main",
};

// sx del <Table> completo: quita el borde de la última fila.
export const tableSx = {
    "& tbody tr:last-of-type td": { borderBottom: "none" },
};

// Botones de acción (ver / editar / estado / eliminar) de la última columna.
export const accionIconSx = {
    color: "text.secondary",
    "&:hover": { color: "primary.main", bgcolor: "action.hover" },
};

// Paginación redonda estilo Figma (número activo en color de marca).
export const paginationSx = {
    "& .MuiPaginationItem-root": {
        borderRadius: 2,
        fontSize: 13,
        minWidth: 30,
        height: 30,
    },
    "& .Mui-selected": {
        bgcolor: "primary.main",
        color: "primary.contrastText",
        "&:hover": { bgcolor: "primary.dark" },
    },
};
