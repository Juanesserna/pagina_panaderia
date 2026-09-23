import { Grid } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { KPICard } from "./KPICard";

/**
 * Tres KPIs en fila (Total / Activos / Inactivos), mismo componente y
 * estilo de tarjeta que InsumosKpis (KPICard local, no el de shared).
 */
export function ProveedoresKpis({ kpis }) {
    return (
        <Grid container spacing={2} alignItems="stretch">
            <Grid size={{ xs: 12, sm: 4 }}>
                <KPICard title="Total Proveedores" value={kpis.total} icon={<LocalShippingIcon />} variant="accent" />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
                <KPICard title="Activos" value={kpis.activos} icon={<CheckCircleIcon />} variant="success" />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
                <KPICard title="Inactivos" value={kpis.inactivos} icon={<CancelIcon />} variant="danger" />
            </Grid>
        </Grid>
    );
}
