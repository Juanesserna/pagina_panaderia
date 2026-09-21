import { Box, Grid, Card, CardContent, Typography, Stack, Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import { StatusBadge } from "@shared/components";
import { formatoCodigo, getEstadoVisual, estadoVisualVariant } from "../utils/proveedoresHelpers";

function CampoInfo({ label, value }) {
    return (
        <Box>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 600, fontSize: 11.5 }}
            >
                {label}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.25 }}>
                {value || "—"}
            </Typography>
        </Box>
    );
}

export function DetalleProveedor({ proveedor, onEditar, onVolver }) {
    const estadoVisual = getEstadoVisual(proveedor);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                        onClick={onVolver}
                        startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
                        sx={{ color: "text.secondary", minWidth: 0 }}
                    >
                        Volver
                    </Button>
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            {proveedor.nombre}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                        >
                            {formatoCodigo(proveedor.id)} · NIT {proveedor.nit}
                        </Typography>
                    </Box>
                </Stack>
                <Button variant="contained" startIcon={<EditIcon />} onClick={onEditar}>
                    Editar
                </Button>
            </Stack>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={3}>
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                    <BusinessIcon fontSize="small" color="primary" />
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        Información General
                                    </Typography>
                                </Stack>
                                <Grid container spacing={2.5}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoInfo label="Código" value={formatoCodigo(proveedor.id)} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoInfo label="NIT" value={proveedor.nit} />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <CampoInfo label="Nombre Empresa" value={proveedor.nombre} />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <CampoInfo label="Descripción" value={proveedor.descripcion} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                                    <PhoneIcon fontSize="small" color="primary" />
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        Información de Contacto
                                    </Typography>
                                </Stack>
                                <Grid container spacing={2.5}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoInfo label="Nombre Contacto" value={proveedor.nombreContacto} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoInfo label="Teléfono" value={proveedor.telefono} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoInfo label="Correo" value={proveedor.email} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoInfo label="Dirección" value={proveedor.direccion} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
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
