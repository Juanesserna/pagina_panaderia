import { Card, CardContent, Box, Stack, Typography, Avatar } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const VARIANT_COLOR = {
    accent: "primary",
    success: "success",
    warning: "warning",
    danger: "error",
};

/**
 * Tarjeta de indicador (KPI) usada en los dashboards de los módulos
 * (Insumos, Proveedores, etc). Reutilizable en 2+ features -> shared/.
 *
 * @param {string} title
 * @param {number|string} value
 * @param {JSX.Element} [icon] - icono de @mui/icons-material
 * @param {"accent"|"success"|"warning"|"danger"} [variant]
 * @param {number} [trend] - variación % vs. mes anterior (opcional)
 */
export function KPICard({ title, value, icon, variant = "accent", trend }) {
    const color = VARIANT_COLOR[variant] ?? "primary";

    return (
        <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 600, fontSize: 11.5 }}
                        >
                            {title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, fontSize: 34 }}>
                            {value}
                        </Typography>
                    </Box>

                    {icon && (
                        <Avatar
                            variant="rounded"
                            sx={{
                                bgcolor: (theme) => `${theme.palette[color].main}1F`,
                                color: (theme) => theme.palette[color].main,
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                            }}
                        >
                            {icon}
                        </Avatar>
                    )}
                </Stack>

                {trend !== undefined && trend !== null && (
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 2 }}>
                        {trend >= 0 ? (
                            <TrendingUpIcon fontSize="small" color="success" />
                        ) : (
                            <TrendingDownIcon fontSize="small" color="error" />
                        )}
                        <Typography variant="caption" color={trend >= 0 ? "success.main" : "error.main"}>
                            {trend >= 0 ? "+" : ""}
                            {trend}% vs. mes anterior
                        </Typography>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
