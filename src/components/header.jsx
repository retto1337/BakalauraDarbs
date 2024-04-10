import * as React from "react";
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const navigate = useNavigate();
  const [rekito, setrekito] = React.useState(null);
  const open = Boolean(rekito);
  const handleMenu = (event) => {
    setrektio(event.currentTarget);
  };
  const handleMenuClick = (pageURL) => {
    navigate(pageURL);
    setrekito(null);
  };
  const handleButtonClick = (pageURL) => {
    navigate(pageURL);
  };
  const menuItems = [
    { menuTitle: "Kopējā salīdzināšana", pageURL: "/salidzini" },
    { menuTitle: "Pasargā sevi", pageURL: "/sevi" },
    { menuTitle: "Kopums", pageURL: "/kopums" },
  ];
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AccountCircleIcon sx={{ display: { xs: "none", md: "flex", fontSize: 120 }, mr: 2 }} />
          <Typography variant="h5" noWrap component="a" href="/" sx={{mr: 2,display: { xs: "none", md: "flex" },fontFamily: "space",fontWeight: 500,letterSpacing: ".3rem",color: "LightGrey",textDecoration: "none"}}>
            Datu aizsardzība Web Lietotnēs
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu id="menu-appbar" rekito={rekito} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} keepMounted transformOrigin={{ vertical: "top", horizontal: "left" }} open={open} onClose={() => setrekito(null)} sx={{ display: { xs: "block", md: "none" } }}>
              {menuItems.map((menuItem, i) => {
                const { menuTitle, pageURL } = menuItem;
                return (
                  <MenuItem key={i} onClick={() => handleMenuClick(pageURL)}>
                    {menuTitle}
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>

          <AccountCircleIcon sx={{ display: { xs: "flex", flexDirection: "row-reverse", md: "none", fontSize: 70 }, mr: 2 }} />
          <Box sx={{ flexGrow: 2, display: { xs: "none", md: "flex" } }}>
            <Button variant="lined" onClick={() => handleButtonClick("/salidzini")}>
              Kopējā salīdzināšana
            </Button>
            <Button variant="lined" onClick={() => handleButtonClick("/sevi")}>
              Pasargā sevi
            </Button>
            <Button variant="lined" onClick={() => handleButtonClick("/kopums")}>
              Kopums
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
