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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import {
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
} from "../utils/insumosHelpers";
import { EstadoSwitch } from "./EstadoSwitch";

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

// Jerarquía de texto igual a la de Producción: el dato principal
// (código, nombre, stock actual) va oscuro/negrita; los datos secundarios
// (categoría, unidad, stock mínimo, costo promedio) van en gris y en el
// mismo tamaño de letra entre sí, para que ninguna columna se vea "distinta"
// por accidente.
const secundariaCellSx = { ...tableBodyCellSx, fontSize: 12.5, color: "text.secondary" };

// Tabla más compacta (menos alto por fila) que la del resto de módulos,
// pedido puntual para Insumos -- se sobreescribe solo aquí, sin tocar
// tableHeadCellSx/tableBodyCellSx de shared.
const compactoHeadSx = { ...tableHeadCellSx, py: 0.9, px: 2 };
const compactoPy = { py: 1, px: 2 };

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
              <TableCell key={col.key} align={col.align ?? "left"} sx={compactoHeadSx}>
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
                <TableCell sx={{ ...codigoCellSx, ...compactoPy }}>{formatoCodigo(r.id)}</TableCell>
                <TableCell sx={{ ...nombreCellSx, ...compactoPy }}>{r.nombre}</TableCell>
                <TableCell sx={{ ...secundariaCellSx, ...compactoPy }}>{nombreCategoria(r.idCategoria)}</TableCell>
                <TableCell align="center" sx={{ ...secundariaCellSx, ...compactoPy }}>
                  {unidadAbrev(r.idUnidadMedida)}
                </TableCell>
                <TableCell align="right" sx={{ ...tableBodyCellSx, ...compactoPy, fontWeight: 600 }}>
                  {r.stockActual}
                </TableCell>
                <TableCell align="right" sx={{ ...secundariaCellSx, ...compactoPy }}>
                  {r.stockMinimo}
                </TableCell>
                <TableCell align="right" sx={{ ...secundariaCellSx, ...compactoPy }}>
                  {formatoMoneda(r.costoPromedio)}
                </TableCell>
                <TableCell sx={{ ...tableBodyCellSx, ...compactoPy }}>
                  <EstadoSwitch
                    activo={r.estado}
                    stockBajo={ev === "Stock Bajo"}
                    nombre={r.nombre}
                    onChange={() => onCambiarEstado(r)}
                  />
                </TableCell>
                <TableCell align="right" sx={{ ...tableBodyCellSx, ...compactoPy, whiteSpace: "nowrap" }}>
                  <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                    <IconButton size="small" title="Ver detalle" sx={accionIconSx} onClick={() => onVer(r)}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Editar" sx={accionIconSx} onClick={() => onEditar(r)}>
                      <EditOutlinedIcon fontSize="small" />
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
