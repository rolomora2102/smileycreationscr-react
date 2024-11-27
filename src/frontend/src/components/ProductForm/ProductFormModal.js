import React from 'react';
import { Modal, Backdrop, Fade, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProductForm from './ProductForm';

function ProductFormModal({ open, product, onSave, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose} // Ahora cierra el modal correctamente
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
          {/* Botón de cerrar (X) vinculado a onClose */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.secondary',
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Formulario del producto */}
          <ProductForm product={product} onSave={onSave} />
        </Box>
      </Fade>
    </Modal>
  );
}

export default ProductFormModal;
