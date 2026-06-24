// app.mjs - ASEGÚRATE DE QUE ESTAS DOS LÍNEAS ESTÉN AL PRINCIPIO DE TODO:
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import rutasPacientes from './routes/pacientes.mjs';

// Inicializamos Express
const app = express();
dotenv.config(); // Carga el archivo .env local si existe

// Middleware obligatorio para que el servidor entienda datos en formato JSON
app.use(express.json());
// 🔥 AÑADE ESTA LÍNEA AQUÍ PARA SERVIR TU CARPETA PUBLIC:
app.use(express.static('public'));

console.log('⏳ Conectando a MongoDB Atlas...');
// 🔌 CONEXIÓN A MONGO DB ATLAS
// Node.js leerá automáticamente la variable MONGO_URI desde tu archivo .env
console.log('⏳ Conectando a MongoDB Atlas...');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado exitosamente a la base de datos de pacientes.');
  })
  .catch((err) => {
    console.error('❌ Error crítico al conectar a MongoDB Atlas:');
    console.error(err.message);
  });

// 📊 RUTAS DEL MENÚ CRUD
// Todos los endpoints de pacientes empezarán con /api/pacientes
app.use('/api/pacientes', rutasPacientes);

// Ruta de prueba inicial en el navegador
app.get('/', (req, res) => {
  res.send('🚀 Servidor de control de pacientes activo y corriendo.');
});

// Render inyectará el puerto correcto automáticamente aquí
const PORT = process.env.PORT || 3000; 

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor médico corriendo exitosamente en el puerto ${PORT}`);
});
