import { OutlinedInput, InputAdornment } from "@mui/material";

/**
 * Campo de texto compacto (usa el estilo de OutlinedInput del theme).
 * Acepta min / max / step directamente, como un <input> normal.
 *
 * @param {JSX.Element} [leftIcon] - icono dentro del campo, a la izquierda
 */
export function Input({ leftIcon, min, max, step, sx, ...rest }) {
    return (
        <OutlinedInput
            size="small"
            fullWidth
            startAdornment={
                leftIcon ? (
                    <InputAdornment position="start" sx={{ color: "text.secondary" }}>
                        {leftIcon}
                    </InputAdornment>
                ) : undefined
            }
            inputProps={{ min, max, step }}
            sx={{
                fontSize: 13.5,
                "& .MuiOutlinedInput-input": { py: "10px" },
                "&.Mui-disabled .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                ...sx,
            }}
            {...rest}
        />
    );
}
