// src/components/ProductForm/ProductFormModal.js
import React from 'react';
import { Modal, Backdrop, Fade, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProductForm from './ProductForm';

function ProductFormModal({ open, onClose, product, onSave }) {
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
            width: '80%',
            maxWidth: 600,
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

          <ProductForm product={product} onSave={onSave} />
        </Box>
      </Fade>
    </Modal>
  );
}

export default ProductFormModal;
