// frontend/src/pages/Home/Home.js
import React, { useEffect, useState } from 'react';
import { Box, Grid, MenuItem, Select, FormControl, InputLabel, CircularProgress, Button, Drawer, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductFormModal from '../../components/ProductForm/ProductFormModal'; // Importamos el modal de formulario
import { getFilteredProducts, getProductTypes, deleteProduct } from '../../services/productService';
import { useLocation } from 'react-router-dom';

function Home({ isAdmin }) { 
  const [products, setProducts] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tipo, setTipo] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [orderDirection, setOrderDirection] = useState('ASC');
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const location = useLocation();

  // Cargar productos según el filtro
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getFilteredProducts(tipo, orderBy, orderDirection);
        setProducts(data);
      } catch (error) {
        console.error('Error obteniendo productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [tipo, orderBy, orderDirection]);

  // Cargar los tipos de productos desde el backend
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const tiposData = await getProductTypes();
        setTipos(tiposData);
      } catch (error) {
        console.error('Error obteniendo tipos de productos:', error);
      }
    };

    fetchTypes();
  }, []);

  // Actualizar el tipo al cambiar la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newTipo = params.get('tipo') || '';
    setTipo(newTipo);
  }, [location]);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const handleFormSave = () => {
    setShowFormModal(false);
    setEditingProduct(null);
    // Recargar los productos después de agregar/editar
    const fetchProducts = async () => {
      const data = await getFilteredProducts(tipo, orderBy, orderDirection);
      setProducts(data);
    };
    fetchProducts();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
        padding: 3,
      }}
    >
      {/* Botón para abrir filtros en móvil */}
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={toggleDrawer(true)}
        sx={{ display: { xs: 'block', sm: 'none' }, mb: 2 }}
      >
        Filtros
      </Button>

      {/* Drawer para filtros en móvil */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Tipo</InputLabel>
            <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              {tipos.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
              <MenuItem value="">Ninguno</MenuItem>
              <MenuItem value="name">Nombre</MenuItem>
              <MenuItem value="price">Precio</MenuItem>
              <MenuItem value="tipo">Tipo</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Dirección</InputLabel>
            <Select value={orderDirection} onChange={(e) => setOrderDirection(e.target.value)}>
              <MenuItem value="ASC">Ascendente</MenuItem>
              <MenuItem value="DESC">Descendente</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Drawer>

      {/* Botón de agregar producto solo visible para admin */}
      {isAdmin && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProduct}
          sx={{ mb: 2 }}
        >
          Agregar Producto
        </Button>
      )}

      {/* Estado de carga */}
      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard
                product={product}
                onDelete={() => handleDelete(product.id)}
                onEdit={() => handleEdit(product)}
                isAdmin={isAdmin}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal para agregar/editar producto */}
      {isAdmin && (
        <ProductFormModal
          open={showFormModal}
          onClose={() => setShowFormModal(false)}
          product={editingProduct}
          onSave={handleFormSave}
        />
      )}
    </Box>
  );
}

export default Home;
