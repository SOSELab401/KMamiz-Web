import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import {
  BarChart,
  BubbleChart,
  CompareArrows,
  Insights,
  LocalOffer,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();

  const routes = [
    { name: "Dependency Graph", path: "/", icon: <BubbleChart /> },
    { name: "Metrics", path: "/metrics", icon: <BarChart /> },
    { name: "Insights", path: "/insights", icon: <Insights /> },
    { name: "Labels", path: "/labels", icon: <LocalOffer /> },
    { name: "Interfaces", path: "/interfaces", icon: <CompareArrows /> },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(!isOpen)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={isOpen} onClose={() => setOpen(false)}>
            <List>
              {routes.map((r) => (
                <ListItemButton key={r.name} onClick={() => navigate(r.path)}>
                  <ListItemIcon>{r.icon}</ListItemIcon>
                  <ListItemText primary={r.name} />
                </ListItemButton>
              ))}
            </List>
          </Drawer>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Monitoring Kubernetes w/ Istio
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}
