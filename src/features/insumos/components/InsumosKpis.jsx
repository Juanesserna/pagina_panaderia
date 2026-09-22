import { Grid } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import { KPICard } from "@shared/components";

export function InsumosKpis({ kpis }) {
    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
                <KPICard title="Total Insumos" value={kpis.total} icon={<InventoryIcon />} variant="accent" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <KPICard title="Activos" value={kpis.activos} icon={<CheckCircleIcon />} variant="success" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <KPICard title="Stock Bajo" value={kpis.stockBajo} icon={<WarningAmberIcon />} variant="warning" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <KPICard title="Inactivos" value={kpis.inactivos} icon={<CancelIcon />} variant="danger" />
            </Grid>
        </Grid>
    );
}
