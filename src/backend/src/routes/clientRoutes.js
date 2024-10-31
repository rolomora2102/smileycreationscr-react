// backend/src/routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../config/db');
const verifyAdmin = require('../middlewere/verifyAdmin'); // Importar el middleware de verificación de admin

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [results] = await db.query('SELECT * FROM Clientes');
    res.json(results);
  } catch (err) {
    console.error('Error obteniendo clientes:', err);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectToDatabase();
    const [result] = await db.query('SELECT * FROM Clientes WHERE id = ?', [id]);
    if (result.length === 0) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(result[0]);
  } catch (err) {
    console.error('Error obteniendo cliente por ID:', err);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

// Crear un nuevo cliente (requiere verificación de administrador)
router.post('/', verifyAdmin, async (req, res) => {
  const { name, email, phone, address, instagram, id_number } = req.body;
  try {
    const db = await connectToDatabase();
    const [result] = await db.query(
      'INSERT INTO Clientes (name, email, phone, address, instagram, id_number) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, address, instagram, id_number]
    );
    res.status(201).json({ message: 'Cliente creado con éxito', clientId: result.insertId });
  } catch (err) {
    console.error('Error creando cliente:', err);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// Actualizar un cliente existente (requiere verificación de administrador)
router.put('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, instagram, id_number } = req.body;
  try {
    const db = await connectToDatabase();
    await db.query(
      'UPDATE Clientes SET name = ?, email = ?, phone = ?, address = ?, instagram = ? WHERE id_number = ?',
      [name, email, phone, address, instagram, id_number]
    );
    res.json({ message: 'Cliente actualizado con éxito' });
  } catch (err) {
    console.error('Error actualizando cliente:', err);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// Eliminar un cliente (requiere verificación de administrador)
router.delete('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectToDatabase();
    await db.query('DELETE FROM Clientes WHERE id = ?', [id]);
    res.json({ message: 'Cliente eliminado con éxito' });
  } catch (err) {
    console.error('Error eliminando cliente:', err);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;
