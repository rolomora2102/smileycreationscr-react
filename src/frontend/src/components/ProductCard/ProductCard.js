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
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '420px', // Altura consistente
          padding: 2,
          boxSizing: 'border-box',
          borderRadius: '12px', // Bordes redondeados
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          image={product.image_url}
          alt={product.name}
          sx={{
            width: '100%',
            height: '170px', // Altura fija para imágenes
            objectFit: 'contain', // Contiene la imagen sin cortarla
            objectPosition: 'center', // Centra la imagen
          }}
        />
        <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
          <Typography
            gutterBottom
            variant="h6"
            sx={{
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2, // Limita el texto a 2 líneas
              overflow: 'hidden',
            }}
          >
            {product.description}
          </Typography>
          <Typography
            variant="h6"
            color="primary"
            sx={{ fontWeight: 'bold', marginTop: 2 }}
          >
            ₡{product.price}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
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
              <Button size="small" color="error" onClick={onDelete}>
                Eliminar
              </Button>
            </Box>
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
