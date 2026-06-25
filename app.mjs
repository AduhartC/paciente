import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import rutasPacientes from './routes/pacientes.mjs';

// 1. Inicializar variables de entorno
dotenv.config();

// 2. Inicializar Express
const app = express();

// 3. Configuración de Middlewares (ORDEN ESTRICTO)
app.use(cors()); 
app.use(express.json()); // Primero habilitamos la lectura de JSON
app.use(express.static('public')); // Luego servimos la carpeta pública

// 4. Conexión a MongoDB Atlas
console.log('⏳ Conectando a MongoDB Atlas...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado exitosamente a la base de datos de pacientes.');
  })
  .catch((err) => {
    console.error('❌ Error crítico al conectar a MongoDB Atlas:');
    console.error(err.message);
  });

// 5. Rutas de la API
app.use('/api/pacientes', rutasPacientes);

// Ruta base alternativa para chequear estado
app.get('/status', (req, res) => {
  res.json({ status: "online", message: "Servidor médico RedSalud activo." });
});

// 6. Levantar Servidor
const PORT = process.env.PORT || 3000; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor médico corriendo exitosamente en el puerto ${PORT}`);
});
