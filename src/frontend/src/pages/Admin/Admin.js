// src/pages/Admin/Admin.js
import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductFormModal from '../../components/ProductForm/ProductFormModal';
import { getProducts, deleteProduct } from '../../services/productService';

function Admin() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
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
              isAdmin
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
