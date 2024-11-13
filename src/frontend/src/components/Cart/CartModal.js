// src/components/Cart/CartModal.js
import React from 'react';
import { Modal, Backdrop, Box, Typography, IconButton, Fade, Button, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

function CartModal({ open, onClose }) {
  const { cart, removeFromCart, calculateTotal, updateQuantity } = useCart();

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'relative',
            width: 400,
            bgcolor: 'background.paper',
            color: 'text.primary',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            mx: 'auto',
            my: '10%',
          }}
        >
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" gutterBottom>
            Carrito de Compras
          </Typography>

          <List>
          {cart.map((item) => (
            <ListItem key={item.id} sx={{ mb: 1 }}>
              <ListItemText
                primary={item.name}
                secondary={`$${item.price} x ${item.quantity || 1} = $${(item.price * (item.quantity || 1)).toFixed(2)}`}
              />
              <IconButton size="small" color="primary" onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)} disabled={item.quantity === 1}>
                <RemoveIcon />
              </IconButton>
              <Typography>{item.quantity || 1}</Typography>
              <IconButton size="small" color="primary" onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>
                <AddIcon />
              </IconButton>
              <IconButton color="secondary" onClick={() => removeFromCart(item.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ${calculateTotal()}
          </Typography>

          {/* Botón de Checkout en el modal del carrito */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            component={Link}
            to="/checkout"
            onClick={onClose}
            sx={{ mt: 2 }}
          >
            Checkout
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}

export default CartModal;
