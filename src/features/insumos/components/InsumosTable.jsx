import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  IconButton,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import {
  StatusBadge,
  tableSx,
  tableHeadCellSx,
  tableBodyCellSx,
  codigoCellSx,
  nombreCellSx,
  accionIconSx,
} from "@shared/components";
import {
  formatoCodigo,
  formatoMoneda,
  nombreCategoria,
  unidadAbrev,
  getEstadoVisual,
  estadoVisualVariant,
} from "../utils/insumosHelpers";

const COLUMNS = [
  { key: "id", label: "Código", sortable: true },
  { key: "nombre", label: "Nombre", sortable: true },
  { key: "categoria", label: "Categoría" },
  { key: "unidad", label: "Unidad", align: "center" },
  { key: "stockActual", label: "Stock Act.", align: "right", sortable: true },
  { key: "stockMinimo", label: "Stock Mín.", align: "right" },
  { key: "costoPromedio", label: "Costo Prom.", align: "right" },
  { key: "estado", label: "Estado" },
  { key: "acciones", label: "", align: "right" },
];

export function InsumosTable({ rows, sortKey, sortDir, onSort, onVer, onEditar, onCambiarEstado, onEliminar }) {
  if (rows.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary" variant="body2">
          Sin insumos encontrados
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small" sx={tableSx}>
        <TableHead>
          <TableRow>
            {COLUMNS.map((col) => (
              <TableCell key={col.key} align={col.align ?? "left"} sx={tableHeadCellSx}>
                {col.sortable ? (
                  <TableSortLabel
                    active={sortKey === col.key}
                    direction={sortKey === col.key ? sortDir : "asc"}
                    onClick={() => onSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : (
                  col.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((r) => {
            const ev = getEstadoVisual(r);
            return (
              <TableRow key={r.id} hover>
                <TableCell sx={codigoCellSx}>{formatoCodigo(r.id)}</TableCell>
                <TableCell sx={nombreCellSx}>{r.nombre}</TableCell>
                <TableCell sx={tableBodyCellSx}>{nombreCategoria(r.idCategoria)}</TableCell>
                <TableCell align="center" sx={tableBodyCellSx}>
                  {unidadAbrev(r.idUnidadMedida)}
                </TableCell>
                <TableCell align="right" sx={{ ...tableBodyCellSx, fontWeight: 600 }}>
                  {r.stockActual}
                </TableCell>
                <TableCell align="right" sx={tableBodyCellSx}>
                  {r.stockMinimo}
                </TableCell>
                <TableCell align="right" sx={tableBodyCellSx}>
                  {formatoMoneda(r.costoPromedio)}
                </TableCell>
                <TableCell sx={tableBodyCellSx}>
                  <StatusBadge variant={estadoVisualVariant[ev]}>{ev}</StatusBadge>
                </TableCell>
                <TableCell align="right" sx={{ ...tableBodyCellSx, whiteSpace: "nowrap" }}>
                  <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                    <IconButton size="small" title="Ver detalle" sx={accionIconSx} onClick={() => onVer(r)}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Editar" sx={accionIconSx} onClick={() => onEditar(r)}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      title="Cambiar estado"
                      sx={accionIconSx}
                      onClick={() => onCambiarEstado(r)}
                    >
                      <ToggleOnOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      title="Eliminar"
                      sx={{ ...accionIconSx, "&:hover": { color: "error.main", bgcolor: "action.hover" } }}
                      onClick={() => onEliminar(r)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}
