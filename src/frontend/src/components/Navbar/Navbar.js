import React, { useEffect, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Menu, 
  MenuItem, 
  Badge, 
  Button, 
  Snackbar,
  Collapse
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CartModal from '../Cart/CartModal';
import { useCart } from '../../contexts/CartContext';
import { getProductTypes } from '../../services/productService';
import logo from '../../Logo.png';

function Navbar({ scrollToFooter }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { notification, closeNotification, getTotalItems } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <>
      <AppBar position="sticky" color="primary" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <Link to="/" style={{ flexGrow: 1 }}>
            <img src={logo} alt="Mi Tienda Logo" style={{ height: 40, cursor: 'pointer' }} />
          </Link>

          {/* Menú Desktop */}
          <Button
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ display: { xs: 'none', sm: 'inline-flex' }, marginRight: 2 }}
            >
              Productos
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem 
                onClick={() => {
                  navigate("/productos", { replace: true });  
                  handleMenuClose();
                }}
              >
                Todos
              </MenuItem>
              {tipos.map((tipo) => (
                <MenuItem 
                  key={tipo}
                  onClick={() => {
                    navigate(`/productos?tipo=${tipo}`, { 
                      replace: location.pathname === "/productos" 
                    });
                    handleMenuClose();
                  }}
                >
                  {tipo}
                </MenuItem>
              ))}
            </Menu>
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
            Ilustración Personalizada
          </Button>

          <Button color="inherit" onClick={scrollToFooter}>
            Contacto
          </Button>

          {/* Carrito móvil */}
          <IconButton
            color="inherit"
            onClick={() => setCartOpen(true)}
            sx={{ display: { xs: 'block', sm: 'none' }, ml: 1, marginRight: 2 }}
          >
            <Badge badgeContent={getTotalItems()} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* Menú hamburguesa móvil */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'block', sm: 'none' }, marginTop: 1 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Carrito desktop */}
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

      {/* Drawer móvil */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          <ListItem button component={Link} to="/" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Inicio" />
          </ListItem>
          
          <ListItem button onClick={() => setMobileProductsOpen(!mobileProductsOpen)}>
            <ListItemText primary="Productos" />
            {mobileProductsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          
          <Collapse in={mobileProductsOpen} timeout="auto" unmountOnExit>
            <List disablePadding>

            <ListItem 
              button 
              sx={{ pl: 4 }}
              onClick={() => {
                navigate("/productos", { replace: true }); // 🚨 Mismo fix
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Todos" />
            </ListItem>
            {tipos.map((tipo) => (
              <ListItem 
                key={tipo}
                button 
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate(`/productos?tipo=${tipo}`, {
                    replace: location.pathname === "/productos" // 🚨 Condición clave
                  });
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary={tipo} />
              </ListItem>
            ))}
            </List>
          </Collapse>

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

      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      
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
