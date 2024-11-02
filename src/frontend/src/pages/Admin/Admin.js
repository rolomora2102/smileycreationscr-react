// src/pages/Admin/Admin.js
import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductFormModal from '../../components/ProductForm/ProductFormModal';
import { getProducts, deleteProduct } from '../../services/productService';
import { verifyToken } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [isAdmin, setIsAdmin] = useState(null); // Inicia como `null` para evitar renderización prematura
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const adminStatus = await verifyToken();
        setIsAdmin(adminStatus);
        if (!adminStatus) {
          navigate('/'); // Redirige a la página principal si no es admin
        }
      } catch (error) {
        console.error('Error verificando estado de admin:', error);
        setIsAdmin(false);
        navigate('/'); // Redirige a la página principal en caso de error
      }
    };
    checkAdminStatus();
  }, [navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
    }
  }, [isAdmin]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    loadProducts();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormSave = () => {
    loadProducts();
    handleCloseModal();
  };

  // Muestra un mensaje de carga o vacío mientras verifica el estado de admin
  if (isAdmin === null) return <Typography>Verificando acceso de administrador...</Typography>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Administración de Productos
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddProduct}
        sx={{ marginBottom: 2 }}
      >
        Agregar Producto
      </Button>

      <Grid container spacing={3} justifyContent="center">
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard
              product={product}
              onDelete={() => handleDelete(product.id)}
              onEdit={() => handleEdit(product)}
              isAdmin={isAdmin} // Aquí pasamos directamente el estado isAdmin
            />
          </Grid>
        ))}
      </Grid>

      {/* Modal para el formulario de producto */}
      <ProductFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        product={editingProduct}
        onSave={handleFormSave}
      />
    </Box>
  );
}

export default Admin;
