const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connectToDatabase = require('../config/db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = await connectToDatabase();
    const [users] = await db.query('SELECT * FROM Admins WHERE username = ?', [username]);

    if (users.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // En producción, almacenar el token en una cookie
    if (process.env.NODE_ENV === 'production') {
      res.cookie('token', token, {
        httpOnly: true,   // Evita el acceso desde JavaScript en el frontend
        secure: true,     // Solo HTTPS en producción
        sameSite: 'none' // Protección contra CSRF
      });
      console.log('Una respuesta: ', res.json, res)
      res.json({ message: 'Autenticación exitosa' });
    } else {
      // En desarrollo, devolver el token en el JSON para almacenarlo en localStorage
      res.json({ message: 'Autenticación exitosa', token });
    }
  } catch (error) {
    console.error('Error en la autenticación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



const verifyToken = (req, res) => {
  console.log('Verificando token...', req)
  try {
    // Intenta leer el token de la cookie (producción)
    let token = req.cookies.token;
    console.log('Una cookie: ', token)

    // Si no está en la cookie, intenta leerlo del encabezado de autorización (desarrollo)
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1]; // Elimina el prefijo "Bearer" si está presente
      console.log("Token leído del encabezado de autorización:", token);
    }

    if (!token) return res.status(401).json({ isAdmin: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isAdmin: decoded.isAdmin });
  } catch (error) {
    res.status(401).json({ isAdmin: false });
  }
};


router.get('/verify-token', verifyToken);

module.exports = router;
