import React, { useEffect, useState, useRef } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Menu, MenuItem, Badge, Button, Snackbar } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import CartModal from '../Cart/CartModal';
import { useCart } from '../../contexts/CartContext';
import { getProductTypes } from '../../services/productService';
import logo from '../../Logo.png';

function Navbar({ scrollToFooter  }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { notification, closeNotification, getTotalItems } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tipos, setTipos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const tiposData = await getProductTypes();
        setTipos(Array.isArray(tiposData) ? tiposData : []);
      } catch (error) {
        console.error('Error obteniendo tipos de productos:', error);
        setTipos([]);
      }
    };
    fetchTypes();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterByType = (tipo) => {
    navigate(`/?tipo=${tipo}`);
    handleMenuClose();
  };

  return (
    <>
      <AppBar position="sticky" color="primary" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <Link to="/" style={{ flexGrow: 1 }}>
            <img src={logo} alt="Mi Tienda Logo" style={{ height: 40, cursor: 'pointer' }} />
          </Link>

          {/* Links a secciones principales */}
          <Button
            color="inherit"
            component={Link}
            to="/productos"
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, marginRight: 2 }}
          >
            Productos
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/producto-personalizado"
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, marginRight: 2 }}
          >
            Personalizados
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/ilustracion-personalizada"
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, marginRight: 2 }}
          >
            Ilustracion Personalizada
          </Button>

          <Button color="inherit" onClick={scrollToFooter}>
            Contacto
          </Button>

          {/* Ícono de carrito en móvil */}
          <IconButton
            color="inherit"
            onClick={() => setCartOpen(true)}
            sx={{ display: { xs: 'block', sm: 'none' }, ml: 1, marginRight: 2 }}
          >
            <Badge badgeContent={getTotalItems()} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* Menú hamburguesa en móvil */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'block', sm: 'none' }, marginTop: 1 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Carrito para pantallas grandes */}
          <Button
            color="inherit"
            onClick={() => setCartOpen(true)}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            <Badge badgeContent={getTotalItems()} color="secondary" sx={{ marginRight: 1 }}>
              <ShoppingCartIcon sx={{ marginRight: 1 }} />
            </Badge>
            Ver Carrito
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer para menú hamburguesa en móvil */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          <ListItem button component={Link} to="/" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Inicio" />
          </ListItem>
          <ListItem button component={Link} to="/productos" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Productos" />
          </ListItem>
          <ListItem button component={Link} to="/producto-personalizado" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Personalizados" />
          </ListItem>
          <ListItem button component={Link} to="/ilustracion-personalizada" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Ilustraciones" />
          </ListItem>
          <ListItem button component={Link} to="/checkout" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Checkout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Modal del carrito */}
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Snackbar de notificación */}
      <Snackbar
        open={notification}
        autoHideDuration={3000}
        onClose={closeNotification}
        message="Producto añadido al carrito"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </>
  );
}

export default Navbar;
