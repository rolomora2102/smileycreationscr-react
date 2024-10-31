// backend/src/routes/index.js
const express = require('express');
const router = express.Router();
const productRoutes = require('./productRoutes');
const clientRoutes = require('./clientRoutes');
const productImageRoutes = require('./productImageRoutes');

// Usar las rutas de productos en /api/productos
router.use('/productos', productRoutes);

// Usar las rutas de clientes en /api/clientes
router.use('/clientes', clientRoutes);

// Usar las rutas de imágenes de productos en /api/productos/:productId/images
router.use('/productos', productImageRoutes);

module.exports = router;
