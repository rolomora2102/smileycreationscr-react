// src/components/ProductCard/ProductCard.js
import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import ProductFormModal from '../ProductForm/ProductFormModal';

function ProductCard({ product, onDelete, onEdit, isAdmin = false }) {
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
          maxWidth: { xs: 345, sm: 400, md: 450 },
          m: 2,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          height="350"
          image={product.image_url}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
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
        <CardActions>
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
            <>
              <Button size="small" color="secondary" onClick={handleEditClick}>
                Editar
              </Button>
              <Button size="small" color="error" onClick={onDelete}>
                Eliminar
              </Button>
            </>
          )}
        </CardActions>
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
