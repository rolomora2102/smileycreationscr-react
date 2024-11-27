import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductFormModal from '../../components/ProductForm/ProductFormModal';
import { getFilteredProducts, getProductTypes, deleteProduct } from '../../services/productService';
import { verifyToken } from '../../services/authService';

function Products() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tipo, setTipo] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [orderDirection, setOrderDirection] = useState('ASC');
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const adminStatus = await verifyToken();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error verificando estado de admin:', error);
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getFilteredProducts(tipo, orderBy, orderDirection);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error obteniendo productos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [tipo, orderBy, orderDirection]);

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.'
    );
    if (confirmDelete) {
      try {
        await deleteProduct(id);
        const updatedProducts = products.filter((product) => product.id !== id);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const handleFormSave = async () => {
    setShowFormModal(false);
    try {
      const data = await getFilteredProducts(tipo, orderBy, orderDirection);
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error refrescando productos:', error);
    }
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredProducts(
      products.filter((product) => product.name.toLowerCase().includes(query))
    );
  };

  const renderProductSections = () => {
    const groupedProducts = filteredProducts.reduce((acc, product) => {
      acc[product.tipo] = acc[product.tipo] || [];
      acc[product.tipo].push(product);
      return acc;
    }, {});

    return Object.keys(groupedProducts).map((tipo) => (
      <Box key={tipo} sx={{ width: '100%', mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'left' }}>
          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
        </Typography>
        <Grid container spacing={3}>
          {groupedProducts[tipo].map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard
                product={product}
                onDelete={() => handleDelete(product.id)}
                onEdit={() => handleEdit(product)}
                isAdmin={isAdmin}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    ));
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          sx={{ flex: 1, mr: 2 }}
        />
        <Button variant="outlined" startIcon={<FilterListIcon />} onClick={toggleDrawer(true)}>
          Filtros
        </Button>
      </Box>

      {isAdmin && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProduct}
          sx={{ mb: 3 }}
        >
          Agregar Producto
        </Button>
      )}

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
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Dirección</InputLabel>
            <Select sx={{ mt: 1 }} value={orderDirection} onChange={(e) => setOrderDirection(e.target.value)}>
              <MenuItem value="ASC">Ascendente</MenuItem>
              <MenuItem value="DESC">Descendente</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Drawer>

      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        renderProductSections()
      )}

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

export default Products;
