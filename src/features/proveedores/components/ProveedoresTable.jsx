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
  monoCellSx,
  linkCellSx,
  accionIconSx,
} from "@shared/components";
import { formatoCodigo } from "../utils/proveedoresHelpers";
import { EstadoSwitch } from "./EstadoSwitch";

// Tabla más compacta (menos alto por fila), igual que la de Insumos, para
// que ambos módulos se vean como parte del mismo sistema.
// El fontWeight de acá abajo SOLO se aplica en esta tabla (Proveedores):
// letra más delgada que la del resto de los módulos, pedido puntual.
const compactoHeadSx = { ...tableHeadCellSx, py: 0.9, px: 2, fontWeight: 500 };
const compactoPy = { py: 1, px: 2, fontWeight: 400 };
const compactoPyNombre = { py: 1, px: 2, fontWeight: 500 };

const COLUMNS = [
  { key: "id", label: "Código", sortable: true },
  { key: "nombre", label: "Nombre Empresa", sortable: true },
  { key: "nit", label: "NIT" },
  { key: "nombreContacto", label: "Contacto" },
  { key: "telefono", label: "Teléfono" },
  { key: "email", label: "Correo" },
  { key: "estado", label: "Estado" },
  { key: "acciones", label: "", align: "right" },
];

export function ProveedoresTable({
  rows,
  sortKey,
  sortDir,
  onSort,
  onVer,
  onEditar,
  onCambiarEstado,
  onEliminar,
}) {
  if (rows.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary" variant="body2">
          Sin proveedores encontrados
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
            return (
              <TableRow key={r.id} hover>
                <TableCell sx={{ ...codigoCellSx, ...compactoPy }}>{formatoCodigo(r.id)}</TableCell>
                <TableCell sx={{ ...nombreCellSx, ...compactoPyNombre }}>{r.nombre}</TableCell>
                <TableCell sx={{ ...monoCellSx, ...compactoPy }}>{r.nit}</TableCell>
                <TableCell sx={{ ...tableBodyCellSx, ...compactoPy, whiteSpace: "nowrap" }}>
                  {r.nombreContacto}
                </TableCell>
                <TableCell sx={{ ...tableBodyCellSx, ...compactoPy, whiteSpace: "nowrap" }}>{r.telefono}</TableCell>
                <TableCell sx={{ ...linkCellSx, ...compactoPy }}>{r.email}</TableCell>
                <TableCell sx={{ ...tableBodyCellSx, ...compactoPy }}>
                  <EstadoSwitch activo={r.estado} nombre={r.nombre} onChange={() => onCambiarEstado(r)} />
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