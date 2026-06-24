import express from 'express';
import mongoose from 'mongoose';
import rutasPacientes from './routes/pacientes.mjs';
import dotenv from 'dotenv';
dotenv.config(); // O algo similar

// Inicializamos Express
const app = express();

// Middleware obligatorio para que el servidor entienda datos en formato JSON
app.use(express.json());

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

// 🚀 LEVANTAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor médico corriendo exitosamente en el puerto ${PORT}`);
});
document.getElementById('formIngreso').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const msgBox = document.getElementById('ing-msg');
    msgBox.textContent = "Procesando registro clínico...";
    msgBox.className = "msg-box info";

    // Capturar valor del Radio Button seleccionado
    const seleccionadoComite = document.querySelector('input[name="ing-comite"]:checked');

    const pacienteData = {
        nombre: document.getElementById('ing-nombre').value.trim(),
        rut: document.getElementById('ing-rut').value.trim(),
        edad: parseInt(document.getElementById('ing-edad').value, 10),
        ficha: document.getElementById('ing-ficha').value.trim(),
        fechaNacimiento: document.getElementById('ing-fecha-nacimiento').value,
        fechaIngreso: document.getElementById('ing-fecha-ingreso').value,
        diagnostico: document.getElementById('ing-diagnostico').value.trim(),
        cirugiasPrevias: document.getElementById('ing-cirugias').value.trim(),
        biopsiasPrevias: document.getElementById('ing-biopsias').value.trim(),
        qtRtPrevia: document.getElementById('ing-qt-rt').value.trim(),
        presentadoComite: seleccionadoComite ? seleccionadoComite.value : "No",
        fechasEstudios: {
            tac: document.getElementById('ing-fecha-tac').value || null,
            petCt: document.getElementById('ing-fecha-pet').value || null,
            rnmCerebro: document.getElementById('ing-fecha-rnm').value || null
        },
        evaluaciones: {
            dlco: document.getElementById('ing-dlco').value,
            espirometria: document.getElementById('ing-espirometria').value,
            ecocardio: document.getElementById('ing-ecocardio').value
        },
        especialidadPaseQx: document.getElementById('ing-pase-qx').value.trim() || null,
        otros: document.getElementById('ing-otros').value.trim()
    };

    try {
        const urlServer = window.location.hostname === 'localhost' 
            ? 'http://localhost:10000/api/pacientes' 
            : 'https://onrender.com';

        const response = await fetch(urlServer, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pacienteData)
        });

        const resultado = await response.json();

        if (response.ok) {
            msgBox.textContent = "✅ Ficha oncológica almacenada de forma segura en MongoDB Atlas.";
            msgBox.className = "msg-box success";
            document.getElementById('formIngreso').reset();
        } else {
            msgBox.textContent = `❌ Error: ${resultado.message || 'No se pudo guardar la información.'}`;
            msgBox.className = "msg-box error";
        }
    } catch (error) {
        console.error("Error en la conexión HTTP:", error);
        msgBox.textContent = "🚨 Error de red: Sin comunicación con el servidor médico central.";
        msgBox.className = "msg-box error";
    }
});
