// frontend/src/pages/ProductDetails/ProductDetails.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Grid, Dialog, IconButton, Snackbar, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getProductById, getProductImages, uploadProductImage, deleteProductImage } from '../../services/productService';
import { useCart } from '../../contexts/CartContext';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

function ProductDetails({ isAdmin = true }) { 
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [openModal, setOpenModal] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error obteniendo detalles del producto:', error);
      }
    };

    const fetchImages = async () => {
      try {
        const imageList = await getProductImages(id);
        setImages(imageList);
        if (imageList.length > 0) setMainImage(imageList[0].image_url);
      } catch (error) {
        console.error('Error obteniendo imágenes del producto:', error);
      }
    };

    fetchProduct();
    fetchImages();
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
    <Box sx={{ padding: 3 }}>
      {product ? (
        <>
          <Typography variant="h4" gutterBottom>{product.name}</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>{product.description}</Typography>
          <Typography variant="h6" color="primary">${product.price}</Typography>
          <Typography variant="subtitle1" color="textSecondary">Tipo: {product.tipo}</Typography>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6}>
              <img
                src={mainImage}
                alt={product.name}
                style={{ width: '100%', cursor: 'pointer' }}
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
              <TextField
                label="Cantidad"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                inputProps={{ min: 1 }}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleAddToCart}>
                Agregar al Carrito
              </Button>
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
  );
}

export default ProductDetails;
