import { Box, Grid, Card, CardContent, Typography, Stack, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { StatusBadge } from "@shared/components";
import { LotesCard } from "./LotesCard";
import {
    formatoCodigo,
    formatoMoneda,
    nombreCategoria,
    unidadAbrev,
    getEstadoVisual,
    estadoVisualVariant,
} from "../utils/insumosHelpers";

function CampoInfo({ label, value }) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                {label}
            </Typography>
            <Typography variant="body2">{value || "—"}</Typography>
        </Box>
    );
}

export function DetalleInsumo({ insumo, onEditar, onVolver }) {
    const estadoVisual = getEstadoVisual(insumo);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton onClick={onVolver}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            {insumo.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                            {formatoCodigo(insumo.id)}
                        </Typography>
                    </Box>
                </Stack>
                <Button variant="contained" startIcon={<EditIcon />} onClick={onEditar}>
                    Editar
                </Button>
            </Stack>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <AssignmentIcon fontSize="small" color="primary" />
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Información General
                                    </Typography>
                                </Stack>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <CampoInfo label="Código" value={formatoCodigo(insumo.id)} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <CampoInfo label="Nombre" value={insumo.nombre} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <CampoInfo label="Categoría" value={nombreCategoria(insumo.idCategoria)} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <CampoInfo label="Descripción" value={insumo.descripcion} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <Inventory2Icon fontSize="small" color="primary" />
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Inventario
                                    </Typography>
                                </Stack>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <CampoInfo label="Unidad de Medida" value={unidadAbrev(insumo.idUnidadMedida)} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <CampoInfo label="Stock Actual" value={insumo.stockActual} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <CampoInfo label="Stock Mínimo" value={insumo.stockMinimo} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <AttachMoneyIcon fontSize="small" color="primary" />
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Costos
                                    </Typography>
                                </Stack>
                                <CampoInfo
                                    label="Costo Promedio"
                                    value={`${formatoMoneda(insumo.costoPromedio)} / ${unidadAbrev(insumo.idUnidadMedida)}`}
                                />
                            </CardContent>
                        </Card>

                        <LotesCard lotes={insumo.lotes} unidad={unidadAbrev(insumo.idUnidadMedida)} />
                    </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                                Estado
                            </Typography>
                            <Box>
                                <StatusBadge variant={estadoVisualVariant[estadoVisual]}>{estadoVisual}</StatusBadge>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
