// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Configuración de CORS (ajusta el origen según tu necesidad)
app.use(cors({
  origin: 'http://localhost:3000' // Reemplaza con el origen del frontend en producción
}));

app.use(express.json());

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});

// Configuración de rutas de la API
const routes = require('./src/routes');
app.use('/api', routes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
