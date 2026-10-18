import { Select as MuiSelect, MenuItem } from "@mui/material";

/**
 * Select compacto a partir de un arreglo de opciones.
 * onChange recibe el evento de MUI (e.target.value conserva el tipo original).
 *
 * @param {{ value: string|number, label: string }[]} options
 */
export function Select({ options = [], sx, ...rest }) {
    return (
        <MuiSelect size="small" fullWidth displayEmpty sx={{ fontSize: 13.5, "& .MuiSelect-select": { py: "10px" }, ...sx }} {...rest}>
            {options.map((o) => (
                <MenuItem key={String(o.value)} value={o.value} sx={{ fontSize: 13.5 }}>
                    {o.label}
                </MenuItem>
            ))}
        </MuiSelect>
    );
}
