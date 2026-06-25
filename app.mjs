import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import rutasPacientes from './routes/pacientes.mjs';

dotenv.config();

const app = express();

// 🔧 MIDDLEWARES
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

// 📦 ROUTES
app.use('/api/pacientes', rutasPacientes);

// 🟢 HEALTHCHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: "online",
    message: "Servidor médico operativo",
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;

// 🔥 CONTROL DE CONEXIÓN MONGODB
let serverStarted = false;

const startServer = async () => {
  try {
    console.log('⏳ Conectando a MongoDB Atlas...');

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // evita cuelgues
      socketTimeoutMS: 45000
    });

    console.log('✅ MongoDB conectado exitosamente');

    if (!serverStarted) {
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        console.log(`📡 API disponible en /api/pacientes`);
      });

      serverStarted = true;
    }

    // 🔴 DETECTA DESCONEXIÓN MONGO
    mongoose.connection.on('disconnected', () => {
      console.error('❌ MongoDB desconectado');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Error MongoDB:', err.message);
    });

  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
};

startServer();