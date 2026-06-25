import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import rutasPacientes from './routes/pacientes.mjs';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/pacientes', rutasPacientes);

app.get('/api/health', (req, res) => {
  res.json({
    status: "online",
    message: "Servidor médico RedSalud operando de forma óptima."
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('⏳ Conectando a MongoDB Atlas...');

    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB conectado exitosamente');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
};

startServer();