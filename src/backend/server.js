// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://smileycreationscr.com/api' : 'http://localhost:3001/api'
});

export default api;


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
