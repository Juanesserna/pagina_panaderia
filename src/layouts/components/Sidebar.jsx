import { useState } from "react";
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, IconButton, Typography, Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  LayoutDashboard, TrendingUp, Factory, ShoppingCart, Truck,
  Package, Layers, Users, Tag, Shield, ChevronLeft, ChevronRight, ChevronDown,
} from "lucide-react";
import { useColorMode } from "@app/providers/ThemeProvider";
import logoOscuro from "@assets/img/logo_oscuro.png";
import logoClaro from "@assets/img/logo_claro.png";

const NAV_GROUPS = [
  { key: "general", label: "Dashboard", icon: <LayoutDashboard size={18} />,
    items: [{ id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> }] },
  { key: "ventas", label: "Ventas", icon: <TrendingUp size={18} />,
    items: [{ id: "ventas", label: "Ventas", icon: <TrendingUp size={18} /> }] },
  { key: "produccion", label: "Producción", icon: <Factory size={18} />,
    items: [
      { id: "produccion", label: "Producción", icon: <Factory size={18} /> },
      { id: "insumos", label: "Insumos", icon: <Package size={18} /> },
    ] },
  { key: "compras", label: "Compras", icon: <ShoppingCart size={18} />,
    items: [
      { id: "compras", label: "Compras", icon: <ShoppingCart size={18} /> },
      { id: "proveedores", label: "Proveedores", icon: <Truck size={18} /> },
    ] },
  { key: "catalogo", label: "Catálogo", icon: <Layers size={18} />,
    items: [
      { id: "categorias", label: "Categorías", icon: <Tag size={18} /> },
      { id: "productos", label: "Productos", icon: <Layers size={18} /> },
    ] },
  { key: "administracion", label: "Administración", icon: <Shield size={18} />,
    items: [
      { id: "usuarios", label: "Usuarios", icon: <Users size={18} /> },
      { id: "roles", label: "Roles", icon: <Shield size={18} /> },
    ] },
];

function findGroupKeyByPage(page) {
  return NAV_GROUPS.find((g) => g.items.some((i) => i.id === page))?.key;
}

export function Sidebar({ activePage, onNavigate, collapsed, onToggle }) {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === "dark";
  const sb = theme.palette.ahSidebar;

  const [openGroups, setOpenGroups] = useState(() => {
    const initial = findGroupKeyByPage(activePage);
    return new Set(initial ? [initial] : []);
  });

  const toggleGroup = (key) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleGroupClick = (group) => {
    if (group.items.length === 1) {
      onNavigate(group.items[0].id);
      if (collapsed) return;
    } else if (collapsed) {
      onNavigate(group.items[0].id);
    } else {
      toggleGroup(group.key);
    }
  };

  const drawerWidth = collapsed ? 64 : 232;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: "width 0.3s",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: sb.main,
          borderRight: `1px solid ${sb.border}`,
          transition: "width 0.3s",
          overflowX: "hidden",
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", height: 64, px: collapsed ? 1.5 : 2, gap: 1.25, overflow: "hidden" }}>
        <Box component="img" src={isDark ? logoOscuro : logoClaro} alt="AlHorno"
          sx={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
        {!collapsed && (
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2, color: sb.contrastText }}>
              AlHorno
            </Typography>
            <Typography noWrap sx={{ fontSize: 10, lineHeight: 1.4, color: theme.palette.primary.main, letterSpacing: "0.08em" }}>
              SISTEMA DE GESTIÓN
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation — sin Divider arriba, solo un pequeño espacio */}
      <List sx={{ flex: 1, overflowY: "auto", pt: 2, pb: 1, px: 1 }}>
        {!collapsed && (
          <Typography
            sx={{
              px: 1, mb: 1, fontSize: 11, fontWeight: 600,
              color: sb.contrastText, opacity: 0.4,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}
          >
            Menú principal
          </Typography>
        )}

        {NAV_GROUPS.map((group) => {
          const hasSubmenu = group.items.length > 1;
          const isOpen = openGroups.has(group.key) && !collapsed;
          const isGroupActive = group.items.some((i) => i.id === activePage);

          return (
            <Box key={group.key} sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleGroupClick(group)}
                title={collapsed ? group.label : undefined}
                disableRipple
                sx={{
                  borderRadius: 1.5,
                  py: 0.75,
                  minHeight: 38,
                  justifyContent: collapsed ? "center" : "flex-start",
                  bgcolor: "transparent",
                  color: isGroupActive ? theme.palette.primary.main : sb.contrastText,
                  opacity: isGroupActive ? 1 : 0.75,
                  "&:hover": { bgcolor: "transparent", color: theme.palette.primary.main, opacity: 1 },
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 34, color: "inherit" }}>
                  {group.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography sx={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.3 }}>
                        {group.label}
                      </Typography>
                    }
                  />
                )}
                {!collapsed && hasSubmenu && (
                  <ChevronDown
                    size={14}
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
                  />
                )}
              </ListItemButton>

              {hasSubmenu && (
                <Collapse in={isOpen} timeout={200} unmountOnExit>
                  <List disablePadding sx={{ pt: 0.5 }}>
                    {group.items.map((item) => {
                      const isActive = activePage === item.id;
                      return (
                        <ListItemButton
                          key={item.id}
                          onClick={() => onNavigate(item.id)}
                          disableRipple
                          sx={{
                            borderRadius: 1.5,
                            pl: 4,
                            py: 0.65,
                            mb: 0.25,
                            minHeight: 34,
                            bgcolor: "transparent",
                            color: isActive ? theme.palette.primary.main : sb.contrastText,
                            opacity: isActive ? 1 : 0.65,
                            "&:hover": { bgcolor: "transparent", color: theme.palette.primary.main, opacity: 1 },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 26, color: "inherit", opacity: 0.8 }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            disableTypography
                            primary={<Typography sx={{ fontSize: 13, lineHeight: 1.3 }}>{item.label}</Typography>}
                          />
                          {isActive && (
                            <Box sx={{ width: 4, height: 14, borderRadius: 4, bgcolor: theme.palette.primary.main, ml: "auto" }} />
                          )}
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>

      {/* Collapse toggle — sin Divider arriba, contenido centrado */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48, px: 1 }}>
        <IconButton
          onClick={onToggle}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            width: collapsed ? 40 : "100%",
            height: 34,
            borderRadius: 1.5,
            color: sb.contrastText,
            opacity: 0.6,
            "&:hover": { bgcolor: sb.hover, opacity: 1 },
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <Typography sx={{ fontSize: 13 }}>Contraer</Typography>}
        </IconButton>
      </Box>
    </Drawer>
  );
}