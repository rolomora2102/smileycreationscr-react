// src/pages/ProductDetails/ProductDetails.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Grid, Dialog, IconButton, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProductImages, uploadProductImage, deleteProductImage } from '../../services/productService';
import { useCart } from '../../contexts/CartContext';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { verifyToken } from '../../services/authService';

function ProductDetails() { 
  const [isAdmin, setIsAdmin] = useState(false);
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [openModal, setOpenModal] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

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
    const fetchProductDetails = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);

        const imageList = await getProductImages(id);
        setImages(imageList);
        if (imageList.length > 0) setMainImage(imageList[0].image_url);
      } catch (error) {
        console.error('Error obteniendo detalles del producto:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleThumbnailClick = (imageUrl) => {
    setMainImage(imageUrl); 
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      setSnackbarMessage('Producto añadido al carrito');
    } else {
      console.error("Producto no está cargado correctamente");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await uploadProductImage(id, formData);
      setSnackbarMessage('Imagen agregada con éxito');
      setImages((prevImages) => [...prevImages, response.data]);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      setSnackbarMessage('Error al subir la imagen');
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteProductImage(id, imageId);
      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
      setSnackbarMessage('Imagen eliminada con éxito');
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      setSnackbarMessage('Error al eliminar la imagen');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarMessage('');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3, backgroundColor: '#FDE2E4', minHeight: '100vh' }}>
      <Box 
        sx={{ 
          width: '100%', 
          maxWidth: '900px', 
          backgroundColor: '#FFF', 
          padding: 4, 
          borderRadius: 2, 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
          mb: 5 
        }}
      >
        {/* Botón de Retroceso */}
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 1 }}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>

        {product ? (
          <>
            <Typography variant="h4" gutterBottom>{product.name}</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>{product.description}</Typography>
            <Typography variant="h6" color="primary">${product.price}</Typography>
            <Typography variant="h5" color="textSecondary">Tipo: {product.tipo}</Typography>

            <Grid container spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
              <Grid item xs={12} sm={6}>
                <img
                  src={mainImage}
                  alt={product.name}
                  style={{
                    width: '100%',
                    maxWidth: '400px',      // Limita el ancho en pantallas grandes
                    maxHeight: '400px',     // Limita la altura en pantallas grandes
                    cursor: 'pointer',
                    objectFit: 'contain',   // Mantiene la relación de aspecto
                  }}
                  onClick={() => setOpenModal(true)} 
                />

                <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="lg">
                  <Box sx={{ position: 'relative' }}>
                    <IconButton
                      sx={{ position: 'absolute', top: 10, right: 10 }}
                      onClick={() => setOpenModal(false)}
                    >
                      <CloseIcon />
                    </IconButton>
                    <img src={mainImage} alt="Imagen Grande" style={{ width: '100%' }} />
                  </Box>
                </Dialog>

                <Box sx={{ display: 'flex', mt: 2, gap: 1, overflowX: 'auto' }}>
                  {images.map((img) => (
                    <Box key={img.id} sx={{ position: 'relative' }}>
                      <img
                        src={img.image_url}
                        alt="Thumbnail"
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: mainImage === img.image_url ? '2px solid #1976d2' : '1px solid #ccc',
                        }}
                        onClick={() => handleThumbnailClick(img.image_url)}
                      />
                      {isAdmin && (
                        <IconButton
                          sx={{ position: 'absolute', top: -5, right: -5 }}
                          color="error"
                          onClick={() => handleDeleteImage(img.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Cantidad"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    inputProps={{ min: 1 }}
                    sx={{ mb: 2 }}
                  />
                  <Button variant="contained" color="primary" onClick={handleAddToCart} fullWidth>
                    Agregar al Carrito
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {isAdmin && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Agregar Imagen al Producto</Typography>
                <input type="file" onChange={handleFileChange} />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleUploadImage}
                  disabled={!selectedFile}
                  sx={{ mt: 1 }}
                >
                  Subir Imagen
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">Cargando detalles del producto...</Typography>
        )}

        {snackbarMessage && (
          <Snackbar
            open={Boolean(snackbarMessage)}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarMessage.includes('error') ? 'error' : 'success'}
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        )}
      </Box>
    </Box>
  );
}

export default ProductDetails;
