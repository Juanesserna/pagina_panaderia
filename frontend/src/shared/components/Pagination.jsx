import { Box, Pagination as MuiPagination } from "@mui/material";
import { paginationSx } from "./tableStyles";

/**
 * Paginación de tablas. Calcula el número de páginas a partir del total.
 *
 * @param {number} page - página actual (1-based)
 * @param {number} total - total de registros
 * @param {number} pageSize
 * @param {(page: number) => void} onPageChange
 */
export function Pagination({ page, total, pageSize, onPageChange }) {
    const count = Math.max(1, Math.ceil(total / pageSize));

    return (
        <Box sx={{ py: 1.5 }}>
            <MuiPagination
                page={page}
                count={count}
                onChange={(_, nuevaPagina) => onPageChange(nuevaPagina)}
                shape="rounded"
                size="small"
                sx={paginationSx}
            />
        </Box>
    );
}
