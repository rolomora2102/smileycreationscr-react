<<<<<<< Updated upstream
// server.js
=======
>>>>>>> Stashed changes
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

<<<<<<< Updated upstream
// Configuración de CORS (ajusta el origen según tu necesidad)
app.use(cors({
  origin: 'http://localhost:3000' // Reemplaza con el origen del frontend en producción
=======
// Configurar CORS para permitir solicitudes desde el frontend
app.use(cors({
  origin: 'http://localhost:3000' // Ajusta esto según la URL de tu frontend
>>>>>>> Stashed changes
}));

app.use(express.json());

<<<<<<< Updated upstream
// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});

// Configuración de rutas de la API
=======
// Configuración de rutas para la API
>>>>>>> Stashed changes
const routes = require('./src/routes');
app.use('/api', routes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
