// src/components/ProductCard/ProductCard.js
import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions, Box } from '@mui/material';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import ProductFormModal from '../ProductForm/ProductFormModal';

function ProductCard({ product, onDelete, onEdit, isAdmin }) {
  const { addToCart } = useCart();
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' }, // Fila en móvil, columna en escritorio
          alignItems: { xs: 'center', md: 'flex-start' },
          maxWidth: { xs: '100%', sm: '100%', md: 450 },
          m: 1,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          height="100"
          image={product.image_url}
          alt={product.name}
          sx={{
            width: { xs: 100, md: '100%' }, // Imagen más pequeña en móvil
            height: { xs: 'auto', md: 300 },
            objectFit: 'cover',
          }}
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent sx={{ flex: '1 0 auto', textAlign: { xs: 'left', md: 'left' } }}>
            <Typography gutterBottom variant="h5" component="div">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
              ${product.price}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: { xs: 'flex-start', md: 'center' } }}>
            <Button size="small" variant="contained" color="primary" onClick={() => addToCart(product)}>
              Agregar al carrito
            </Button>
            <Button
              size="small"
              color="secondary"
              component={Link}
              to={`/producto/${product.id}`}
            >
              Ver Más
            </Button>
            {isAdmin && (
              <Box>
                <Button size="small" color="secondary" onClick={handleEditClick}>
                  Editar
                </Button>
                <Button size="" color="error" onClick={onDelete}>
                  Eliminar
                </Button>
              </Box>
            )}
          </CardActions>
        </Box>
      </Card>

      {/* Modal de edición */}
      {isAdmin && (
        <ProductFormModal
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          product={product}
          onSave={() => {
            handleCloseEditModal();
            if (onEdit) onEdit();
          }}
        />
      )}
    </>
  );
}

export default ProductCard;
