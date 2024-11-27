import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import { createProduct, updateProduct, uploadProductImage } from '../../services/productService';
import api from '../../services/api';

function ProductForm({ product = {}, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    image_url: product?.image_url || '',
    stock: product?.stock || '',
    tipo: product?.tipo || '',
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [additionalImages, setAdditionalImages] = useState([]);

  useEffect(() => {
    setFormData({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      image_url: product?.image_url || '',
      stock: product?.stock || '',
      tipo: product?.tipo || '',
    });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await api.post('/productos/upload-main', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setFormData((prevData) => ({
          ...prevData,
          image_url: response.data.imageUrl,
        }));
        setSnackbarMessage('Imagen principal subida con éxito');
        setSnackbarSeverity('success');
      } catch (error) {
        console.error('Error subiendo imagen principal:', error);
        setSnackbarMessage(
          error.response?.data?.error || 'Error al subir la imagen principal'
        );
        setSnackbarSeverity('error');
      }
      setOpenSnackbar(true);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImages([...e.target.files]);
  };

  const handleUploadAdditionalImages = async () => {
    if (!product || !product.id) {
      setSnackbarMessage(
        'Por favor, guarde el producto antes de subir imágenes adicionales.'
      );
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    try {
      for (const image of additionalImages) {
        const formData = new FormData();
        formData.append('image', image);
        await uploadProductImage(product.id, formData);
      }
      setSnackbarMessage('Imágenes adicionales subidas con éxito');
      setSnackbarSeverity('success');
      setAdditionalImages([]);
    } catch (error) {
      console.error('Error subiendo imágenes adicionales:', error);
      setSnackbarMessage('Error al subir las imágenes adicionales');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'El nombre es obligatorio';
    if (!formData.description) newErrors.description = 'La descripción es obligatoria';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número mayor a 0';
    }
    if (!formData.image_url) newErrors.image_url = 'La imagen es obligatoria';
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número no negativo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (product?.id) {
        await updateProduct(product.id, formData);
        setSnackbarMessage('Producto actualizado con éxito');
      } else {
        await createProduct(formData);
        setSnackbarMessage('Producto creado con éxito');
      }
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error guardando producto:', error);
      setSnackbarMessage(
        error.response?.data?.error || 'Hubo un error al guardar el producto'
      );
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Nombre"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        required
      />
      <TextField
        label="Descripción"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={!!errors.description}
        helperText={errors.description}
        required
      />
      <TextField
        label="Precio"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        error={!!errors.price}
        helperText={errors.price}
        required
      />
      <Button variant="contained" component="label">
        Subir Imagen Principal
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      <TextField
        label="Stock"
        name="stock"
        type="number"
        value={formData.stock}
        onChange={handleChange}
        error={!!errors.stock}
        helperText={errors.stock}
        required
      />
      <TextField label="Tipo" name="tipo" value={formData.tipo} onChange={handleChange} required />
      <Button variant="contained" component="label" sx={{ mt: 2 }}>
        Imágenes Adicionales
        <input type="file" hidden multiple onChange={handleAdditionalImagesChange} />
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleUploadAdditionalImages}
        disabled={additionalImages.length === 0}
      >
        Subir Imágenes Adicionales
      </Button>
      <Button type="submit" variant="contained" color="primary">
        {product?.id ? 'Actualizar Producto' : 'Crear Producto'}
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductForm;
