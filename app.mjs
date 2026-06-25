import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import rutasPacientes from './routes/pacientes.mjs';

// 1. Inicializar variables de entorno
dotenv.config();

// 2. Inicializar la aplicación Express
const app = express();

// 3. Configuración de Middlewares globales de seguridad y datos
app.use(cors()); 
app.use(express.json()); 

// Servir la carpeta pública de forma estática sin redirecciones intermedias
app.use(express.static('public'));

// 4. Conexión limpia a tu base de datos de MongoDB Atlas
console.log('⏳ Conectando a MongoDB Atlas...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado exitosamente a la base de datos de pacientes.');
  })
  .catch((err) => {
    console.error('❌ Error crítico al conectar a MongoDB Atlas:', err.message);
  });

// 5. Enlazar las rutas oficiales de la API Médica
app.use('/api/pacientes', rutasPacientes);

// Endpoint de control rápido para verificar el estado sin chocar con el HTML
app.get('/api/health', (req, res) => {
  res.json({ status: "online", message: "Servidor médico RedSalud operando de forma óptima." });
});

// 6. Levantar Servidor en puertos de producción
const PORT = process.env.PORT || 3000; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor médico corriendo exitosamente en el puerto ${PORT}`);
});
