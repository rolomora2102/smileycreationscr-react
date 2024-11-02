const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  // Intenta leer el token de la cookie (producción)
  let token = req.cookies.token;

  // Si no está en la cookie, intenta leerlo del encabezado de autorización (desarrollo)
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1]; // Elimina el prefijo "Bearer" si está presente
  }

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // payload contiene los datos del usuario si el token es válido
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ message: "Token no válido" });
  }
};

module.exports = verifyAdmin;
