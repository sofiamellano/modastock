import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

console.log("🚀 Verificando variables de entorno...");
console.log("Host:", process.env.DB_HOST_LOCAL);
console.log("Usuario:", process.env.DB_USER_LOCAL);
console.log("Contraseña:", process.env.DB_PASS_LOCAL);
console.log("Base de datos:", process.env.DB_NAME_LOCAL);
console.log("Puerto:", process.env.DB_PORT_LOCAL);

// Detectar el entorno actual
const isLocal = process.env.NODE_ENV === "local";

// Configuración de la base de datos según el entorno
const pool = mysql.createPool({
  host: isLocal ? process.env.DB_HOST_LOCAL : process.env.DB_HOST_REMOTE,
  user: isLocal ? process.env.DB_USER_LOCAL : process.env.DB_USER_REMOTE,
  password: isLocal ? process.env.DB_PASS_LOCAL : process.env.DB_PASS_REMOTE,
  database: isLocal ? process.env.DB_NAME_LOCAL : process.env.DB_NAME_REMOTE,
  port: isLocal ? process.env.DB_PORT_LOCAL : process.env.DB_PORT_REMOTE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("✅ Conexión exitosa a la base de datos. Resultado:", rows[0].result);
  } catch (err) {
    console.error("❌ Error al conectar a la base de datos:", err.message);
  } finally {
    console.log("Prueba de conexión finalizada."); // Mantener el pool abierto
  }
};

// Ejecutar la prueba de conexión
testConnection();