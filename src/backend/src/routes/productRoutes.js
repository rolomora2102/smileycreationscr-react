// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const verifyAdmin = require('../middlewere/verifyAdmin');
const connectToDatabase = require('../config/db');

// Configuración de S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configuración de almacenamiento en memoria con multer para cargar directamente a S3
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir la imagen principal al bucket de S3 para imágenes principales (solo administradores)
router.post('/upload-main', verifyAdmin, upload.single('image'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }

  const fileName = `main/${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: process.env.S3_MAIN_BUCKET_NAME, // Nombre del bucket principal
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    res.status(201).json({ imageUrl: data.Location }); // Retorna el URL de S3
  } catch (error) {
    console.error('Error subiendo imagen principal a S3:', error);
    res.status(500).json({ error: 'Error al subir la imagen principal' });
  }
});

// Ruta para subir una imagen adicional asociada a un producto específico en el bucket de imágenes adicionales (solo administradores)
router.post('/:id/images', verifyAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }

  const fileName = `additional/${Date.now()}-${req.file.originalname}`;
  const params = {
    Bucket: process.env.S3_ADDITIONAL_BUCKET_NAME, // Nombre del bucket para imágenes adicionales
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    const imageUrl = data.Location;

    // Guardar la URL de la imagen en la base de datos
    const db = await connectToDatabase();
    const query = 'INSERT INTO ProductImages (product_id, image_url) VALUES (?, ?)';
    await db.query(query, [id, imageUrl]);

    res.status(201).json({ message: 'Imagen adicional subida con éxito', imageUrl });
  } catch (error) {
    console.error('Error subiendo imagen adicional a S3:', error);
    res.status(500).json({ error: 'Error al subir la imagen adicional' });
  }
});

// Obtener todos los productos (disponible para todos)
router.get('/', async (req, res) => {
  const { tipo, orderBy, orderDirection = 'ASC' } = req.query;
  let query = 'SELECT * FROM Productos';
  const queryParams = [];

  if (tipo) {
    query += ' WHERE tipo = ?';
    queryParams.push(tipo);
  }

  const validColumns = ['name', 'price', 'tipo', 'created_at'];

  query += ' ORDER BY tipo';
  
  if (orderBy && validColumns.includes(orderBy)) {
    query += `, ${orderBy} ${orderDirection === 'DESC' ? 'DESC' : 'ASC'}`;
  }
  
  query += ', created_at DESC';

  try {
    const db = await connectToDatabase();
    const [results] = await db.query(query, queryParams);
    res.json(results);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Ruta para obtener los tipos únicos de productos (disponible para todos)
router.get('/tipos', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [results] = await db.query('SELECT DISTINCT tipo FROM Productos');
    const tipos = results.map(row => row.tipo);
    res.json(tipos);
  } catch (error) {
    console.error('Error obteniendo tipos de productos:', error);
    res.status(500).json({ error: 'Error al obtener tipos de productos' });
  }
});

// Obtener un producto por ID (disponible para todos)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = await connectToDatabase();
    const [result] = await db.query('SELECT * FROM Productos WHERE id = ?', [id]);
    if (result.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(result[0]);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Crear un nuevo producto (solo administradores)
router.post('/', verifyAdmin, async (req, res) => {
  const { name, description, price, image_url, stock, tipo } = req.body;
  const query = 'INSERT INTO Productos (name, description, price, image_url, stock, tipo) VALUES (?, ?, ?, ?, ?, ?)';

  try {
    const db = await connectToDatabase();
    await db.query(query, [name, description, price, image_url, stock, tipo]);
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Actualizar un producto existente (solo administradores)
router.put('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, stock, tipo } = req.body;
  const query = 'UPDATE Productos SET name = ?, description = ?, price = ?, image_url = ?, stock = ?, tipo = ? WHERE id = ?';

  try {
    const db = await connectToDatabase();
    await db.query(query, [name, description, price, image_url, stock, tipo, id]);
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto (solo administradores)
router.delete('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const db = await connectToDatabase();
    await db.query('DELETE FROM Productos WHERE id = ?', [id]);
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
