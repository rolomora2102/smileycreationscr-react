const connectToDatabase = require('../backend/src/config/db');

async function createTables() {
  const db = await connectToDatabase();

  try {
    // Crear tabla Clientes
    await db.query(`
      CREATE TABLE Clientes (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            address TEXT,
            phone VARCHAR(20),
            instagram VARCHAR(100) UNIQUE,  -- Campo único para Instagram
            id_number VARCHAR(50),          -- Número de identificación o cédula
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Crear tabla Productos
    await db.query(`
      CREATE TABLE IF NOT EXISTS Productos (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100),
            description TEXT,
            price DECIMAL(10, 2),
            image_url VARCHAR(255),
            stock INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            tipo VARCHAR(50)
        )
    `);

    // Crear tabla ProductImages
    await db.query(`
      CREATE TABLE IF NOT EXISTS ProductImages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES Productos(id) ON DELETE CASCADE
      )
    `);

    await db.query(`
      CREATE TABLE Pedidos (
            id INT PRIMARY KEY AUTO_INCREMENT,
            customer_id INT,
            total_amount DECIMAL(10, 2),
            status VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES Clientes(id)
        );
    `);

    await db.query(`
        CREATE TABLE Detalles_Pedido (
          id INT PRIMARY KEY AUTO_INCREMENT,
          order_id INT,
          product_id INT,
          quantity INT,
          price DECIMAL(10, 2),
          FOREIGN KEY (order_id) REFERENCES Pedidos(id),
          FOREIGN KEY (product_id) REFERENCES Productos(id)
      );
      `);

    console.log("Tablas creadas con éxito");
  } catch (error) {
    console.error("Error al crear tablas:", error);
  } finally {
    db.end(); // Cierra la conexión después de crear las tablas
  }
}

createTables();
