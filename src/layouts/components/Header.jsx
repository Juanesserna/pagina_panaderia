import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@app/router/routes";
import {
  AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Box, Avatar, Divider, Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Bell, User, ChevronDown, LogOut, Check, Sun, Moon } from "lucide-react";
import { useColorMode } from "@app/providers/ThemeProvider";

const SAMPLE_NOTIFICATIONS = [
  { id: "1", title: "Stock bajo", message: "Harina de trigo por debajo del mínimo requerido.", time: "hace 5 min", read: false, type: "warning" },
];

const PAGE_TITLES = {
  dashboard: "Dashboard", ventas: "Ventas", produccion: "Producción", compras: "Compras",
  proveedores: "Proveedores", insumos: "Insumos", productos: "Productos",
  usuarios: "Usuarios", categorias: "Categorías", roles: "Roles",
  perfil: "Mi perfil",
};

export function Header({ page }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode, toggleMode } = useColorMode();
  const isDark = mode === "dark";

  const [notifAnchor, setNotifAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const typeColor = {
    info: theme.palette.info.main,
    warning: theme.palette.warning.main,
    success: theme.palette.success.main,
    danger: theme.palette.error.main,
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: theme.zIndex.appBar,
        bgcolor: isDark ? '#16110D' : theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderRadius: 0,
        color: theme.palette.text.primary,
        flexShrink: 0,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 48,
          '@media (min-width:600px)': { minHeight: 48 },
          gap: 1.5,
          py: 0.5,
        }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{PAGE_TITLES[page] ?? page}</Typography>
        <Box sx={{ flex: 1 }} />

        <IconButton onClick={toggleMode} title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          size="small"
          sx={{ color: theme.palette.text.secondary, "&:hover": { bgcolor: theme.palette.accentDim, color: theme.palette.text.primary } }}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </IconButton>

        <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)}
          size="small"
          sx={{ color: theme.palette.text.secondary, "&:hover": { bgcolor: theme.palette.accentDim, color: theme.palette.text.primary } }}>
          <Badge variant="dot" color="error" invisible={unread === 0}><Bell size={16} /></Badge>
        </IconButton>
        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={() => setNotifAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              width: 260,
              mt: 1,
              ml: -6,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, py: 0.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Notificaciones {unread > 0 && `(${unread})`}</Typography>
            {unread > 0 && (
              <Button
                size="small"
                startIcon={<Check size={11} />}
                onClick={markAllRead}
                sx={{ fontSize: 12, textTransform: "none", color: theme.palette.text.secondary, "&:hover": { color: theme.palette.text.secondary, bgcolor: "transparent" } }}
              >
                Marcar todo
              </Button>
            )}
          </Box>
          {notifications.map((n) => (
            <MenuItem key={n.id}
              onClick={() => setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
              sx={{ alignItems: "flex-start", gap: 1.5, bgcolor: !n.read ? theme.palette.accentDim : "transparent", whiteSpace: "normal" }}>
              <Box sx={{ mt: 0.75, width: 8, height: 8, borderRadius: "50%", bgcolor: typeColor[n.type], flexShrink: 0 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{n.title}</Typography>
                <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>{n.message}</Typography>
                <Typography sx={{ fontSize: 11, color: theme.palette.text.disabled }}>{n.time}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        <IconButton onClick={(e) => setUserAnchor(e.currentTarget)} sx={{ gap: 1, borderRadius: 1.5, px: 1, py: 0.5, "&:hover": { bgcolor: theme.palette.accentDim } }}>
          <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: theme.palette.accentDim, color: theme.palette.primary.main }}>AM</Avatar>
          <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", alignItems: "flex-start", ml: 1 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>Ana Martínez</Typography>
            <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary, lineHeight: 1.2 }}>Administrador</Typography>
          </Box>
          <ChevronDown size={12} style={{ marginLeft: 4 }} />
        </IconButton>
        <Menu
          anchorEl={userAnchor}
          open={Boolean(userAnchor)}
          onClose={() => setUserAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              width: 260,
              mt: 1,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Ana Martínez</Typography>
            <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>ana@alhorno.mx</Typography>
          </Box>
           <MenuItem
            sx={{ gap: 1.5 }}
            onClick={() => { setUserAnchor(null); navigate(ROUTES.PERFIL); }}
          >
            <User size={13} /> Mi perfil
          </MenuItem>
          <Divider />
          <MenuItem sx={{ gap: 1.5, color: theme.palette.error.main, "&:hover": { bgcolor: theme.palette.error.dim } }}>
            <LogOut size={13} /> Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}