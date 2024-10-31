// frontend/src/services/productService.js
import api from './api';

export const getProducts = async () => {
  const response = await api.get('/productos');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/productos/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/productos', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/productos/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/productos/${id}`);
  return response.data;
};

export const getProductImages = async (productId) => {
  const response = await api.get(`/productos/${productId}/images`);
  return response.data;
};

export const uploadProductImage = async (productId, formData) => {
  const response = await api.post(`/productos/${productId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getFilteredProducts = async (tipo, orderBy, orderDirection) => {
  try {
    const response = await api.get('/productos', {
      params: { tipo, orderBy, orderDirection },
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
};

export const getProductTypes = async () => {
  try {
    const response = await api.get('/productos/tipos');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo tipos de productos:', error);
    throw error;
  }
};

export const deleteProductImage = async (productId, imageId) => {
  try {
    const response = await api.delete(`/productos/${productId}/images/${imageId}`);
    return response.data;
  } catch (error) {
    console.error("Error eliminando la imagen:", error);
    throw error;
  }
};
