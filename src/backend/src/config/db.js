// backend/config/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let pool;

async function connectToDatabase() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('Conectado a la base de datos en AWS RDS');
  }
  return pool;
}

module.exports = connectToDatabase;



// Local Env

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',      
//   password: 'password123', 
//   database: 'smileycreations' 
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error al conectar con la base de datos:', err);
//   } else {
//     console.log('Conectado a la base de datos MySQL.');
//   }
// });

// module.exports = connection;
