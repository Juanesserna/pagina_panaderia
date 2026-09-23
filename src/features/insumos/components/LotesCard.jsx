import { useState } from "react";
import { Card, CardContent, Stack, Typography, Box, Button } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import BlockIcon from "@mui/icons-material/Block";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CalculateIcon from "@mui/icons-material/Calculate";
import { formatoFecha, diasParaVencer } from "../utils/insumosHelpers";

function LoteRow({ lote, unidad }) {
  const dias = diasParaVencer(lote.fechaVencimiento);
  const agotado = lote.cantidadDisponible <= 0;
  const porVencer = !agotado && dias !== null && dias <= 20;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 2,
        border: "1px solid",
        borderColor: porVencer ? "warning.main" : "divider",
        bgcolor: porVencer ? "warning.50" : "transparent",
        opacity: agotado ? 0.5 : 1,
      }}
    >
      <Box>
        <Typography variant="body2" fontWeight={600} color={porVencer ? "warning.main" : "text.primary"}>
          {lote.codigoLote}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Compra #{lote.idCompra} · ingresó {formatoFecha(lote.fechaRecepcion)}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Typography variant="body2" fontWeight={600}>
          {lote.cantidadDisponible} {unidad}{" "}
          <Typography component="span" variant="caption" color="text.secondary">
            / {lote.cantidadRecibida} {unidad}
          </Typography>
        </Typography>
        {agotado ? (
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
            <BlockIcon sx={{ fontSize: 12 }} color="error" />
            <Typography variant="caption" color="error.main">
              Agotado
            </Typography>
          </Stack>
        ) : porVencer ? (
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
            <WarningAmberIcon sx={{ fontSize: 12 }} color="warning" />
            <Typography variant="caption" color="warning.main">
              Vence en {dias} días
            </Typography>
          </Stack>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Vence {formatoFecha(lote.fechaVencimiento)}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

export function LotesCard({ lotes, unidad = "" }) {
  const [expandido, setExpandido] = useState(false);

  const ordenados = [...lotes].sort((a, b) => {
    const da = diasParaVencer(a.fechaVencimiento) ?? Infinity;
    const db = diasParaVencer(b.fechaVencimiento) ?? Infinity;
    return da - db;
  });
  const activos = ordenados.filter((l) => l.cantidadDisponible > 0).length;
  const visibles = expandido ? ordenados : ordenados.slice(0, 2);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Inventory2Icon fontSize="small" color="primary" />
            <Typography variant="subtitle2" fontWeight={600}>
              Lotes
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {activos} lotes activos
          </Typography>
        </Stack>

        {ordenados.length === 0 ? (
          <Typography variant="caption" color="text.secondary" sx={{ py: 1 }}>
            Este insumo no tiene lotes registrados todavía. Se crean automáticamente al recibir una compra.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {visibles.map((lote) => (
              <LoteRow key={lote.id} lote={lote} unidad={unidad} />
            ))}
          </Stack>
        )}

        {ordenados.length > 2 && (
          <Button size="small" onClick={() => setExpandido((v) => !v)}>
            {expandido ? "Ver menos" : "Ver todos los lotes"}
          </Button>
        )}

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <CalculateIcon sx={{ fontSize: 13 }} color="disabled" />
          <Typography variant="caption" color="text.secondary">
            El stock actual y el costo promedio los recalcula la BD automáticamente al recibir un lote.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
