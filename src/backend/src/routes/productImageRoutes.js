// backend/src/routes/productImageRoutes.js
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const connectToDatabase = require('../config/db');
const verifyAdmin = require('../middlewere/verifyAdmin'); // Importar verifyAdmin

const router = express.Router();

// Configuración de S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir una imagen adicional asociada a un producto específico en el bucket de imágenes adicionales
router.post('/:productId/upload-additional', verifyAdmin, upload.single('image'), async (req, res) => {
  const { productId } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }

  const fileName = `additional/${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: process.env.S3_ADDITIONAL_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    // Subir la imagen a S3
    const data = await s3.upload(params).promise();
    const imageUrl = data.Location;

    // Guardar la URL de la imagen en la base de datos
    const db = await connectToDatabase();
    const query = 'INSERT INTO ProductImages (product_id, image_url) VALUES (?, ?)';
    await db.query(query, [productId, imageUrl]);

    res.status(201).json({ message: 'Imagen adicional subida con éxito', imageUrl });
  } catch (error) {
    console.error('Error subiendo imagen adicional a S3:', error);
    res.status(500).json({ error: 'Error al subir la imagen adicional' });
  }
});

// Ruta para obtener todas las imágenes de un producto
router.get('/:productId/images', async (req, res) => {
  const { productId } = req.params;

  try {
    const db = await connectToDatabase();
    const [results] = await db.query('SELECT * FROM ProductImages WHERE product_id = ?', [productId]);
    res.json(results);
  } catch (error) {
    console.error('Error obteniendo imágenes:', error);
    res.status(500).json({ error: 'Error al obtener imágenes' });
  }
});

// Ruta para agregar una imagen usando URL en el body
router.post('/:productId/images-url', verifyAdmin, async (req, res) => {
  const { productId } = req.params;
  const { imageUrl } = req.body;

  try {
    const db = await connectToDatabase();
    const query = 'INSERT INTO ProductImages (product_id, image_url) VALUES (?, ?)';
    await db.query(query, [productId, imageUrl]);
    res.status(201).json({ message: 'Imagen añadida correctamente' });
  } catch (error) {
    console.error('Error añadiendo imagen:', error);
    res.status(500).json({ error: 'Error al añadir imagen' });
  }
});

// Ruta para eliminar una imagen específica de un producto
router.delete('/:productId/images/:imageId', verifyAdmin, async (req, res) => {
  const { productId, imageId } = req.params;

  try {
    // Primero obtenemos la URL de la imagen para eliminarla del bucket S3
    const db = await connectToDatabase();
    const [results] = await db.query('SELECT image_url FROM ProductImages WHERE id = ? AND product_id = ?', [imageId, productId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    const imageUrl = results[0].image_url;
    const fileName = imageUrl.split('/').pop(); // Extrae el nombre del archivo de la URL

    // Elimina la imagen de S3
    await s3.deleteObject({
      Bucket: process.env.S3_ADDITIONAL_BUCKET_NAME,
      Key: fileName,
    }).promise();

    // Elimina la imagen de la base de datos
    await db.query('DELETE FROM ProductImages WHERE id = ? AND product_id = ?', [imageId, productId]);

    res.status(200).json({ message: 'Imagen eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
});

module.exports = router;
