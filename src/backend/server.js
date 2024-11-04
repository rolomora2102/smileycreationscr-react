require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Configuración de CORS

// change to 'http://localhost:3000' for Local dev
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://smileycreationscr.com', 'https://admin.smileycreationscr.com'] : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
app.use(cookieParser()); 

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
