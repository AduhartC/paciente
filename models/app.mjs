import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; // Requerido para permitir que tu HTML hable con el backend
import rutasPacientes from './routes/pacientes.mjs';
import dotenv from 'dotenv';

// Inicializar variables de entorno del archivo .env local
dotenv.config();

const app = express();

// 🛠️ MIDDLEWARES
app.use(cors()); // Permite peticiones externas desde tu interfaz HTML
app.use(express.json()); // Permite procesar los datos JSON enviados por el formulario

// Servir archivos estáticos (para que Render pueda cargar tu HTML, CSS y JS frontend automáticamente)
app.use(express.static('public'));

// 🔌 CONEXIÓN A MONGO DB ATLAS
const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('❌ Error crítico: La variable MONGO_URI no está configurada.');
  process.exit(1);
}

console.log('⏳ Conectando a MongoDB Atlas...');

// Conexión estable optimizada para producción
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado exitosamente a la base de datos de pacientes.');
  })
  .catch((err) => {
    console.error('❌ Error crítico al conectar a MongoDB Atlas:');
    console.error(err.message);
  });

// 📊 RUTAS DEL SERVIDOR
app.use('/api/pacientes', rutasPacientes);

// Ruta base alternativa
app.get('/status', (req, res) => {
  res.json({ status: "active", message: "Servidor médico corriendo exitosamente." });
});

// 🚀 LEVANTAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor médico corriendo exitosamente en el puerto ${PORT}`);
});
