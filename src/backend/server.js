// backend/server.js
const express = require('express');
const cors = require('cors'); // Importa el paquete cors
const app = express();
const PORT = 3001;

// Configurar CORS para permitir solicitudes desde http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000' // Reemplaza con el origen del frontend
}));

app.use(express.json());

// Configuración de rutas
const routes = require('./src/routes');
app.use('/api', routes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
