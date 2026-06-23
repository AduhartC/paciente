import express from 'express';
import Paciente from '../models/Paciente.mjs';

const router = express.Router();

// 🟢 C: CREAR un paciente (Registro)
router.post('/registro', async (req, res) => {
  try {
    const nuevoPaciente = new Paciente(req.body);
    await nuevoPaciente.save();
    res.status(201).json({ mensaje: 'Paciente registrado con éxito', paciente: nuevoPaciente });
  } catch (error) {
    res.status(400).json({ error: 'Error al registrar', detalle: error.message });
  }
});

// 🔵 R: LEER todos los pacientes (Separa las Alertas)
router.get('/', async (req, res) => {
  try {
    const pacientes = await Paciente.find().lean();
    const alertas = pacientes.filter(p => p.requiereExamen);

    res.json({
      total: pacientes.length,
      alertasActivas: alertas.length,
      pacientes,
      listaAlertas: alertas.map(p => `⚠️ Paciente ${p.nombre} requiere examen urgentemente.`)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

// 🟡 U: ACTUALIZAR datos de un paciente
router.put('/:rut', async (req, res) => {
  try {
    const paciente = await Paciente.findOne({ rut: req.params.rut });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    Object.assign(paciente, req.body);
    await paciente.save(); 

    res.json({ mensaje: 'Paciente actualizado con éxito', paciente });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar' });
  }
});

// 🔴 D: ELIMINAR un paciente
router.delete('/:rut', async (req, res) => {
  try {
    const resultado = await Paciente.findOneAndDelete({ rut: req.params.rut });
    if (!resultado) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json({ mensaje: 'Paciente eliminado del sistema' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

export default router;

// 🧪 RUTA DE PRUEBA RÁPIDA (Escribe esto justo antes de export default router)
router.get('/crear-ficticio', async (req, res) => {
  try {
    const pacienteFicticio = new Paciente({
      rut: "12345678-9",
      nombre: "Carlos González",
      edad: 38,
      telefono: "+56987654321",
      correo: "carlos@email.com",
      proximoExamen: new Date("2026-05-10") // Fecha pasada (vencida) para forzar la alerta
    });

    await pacienteFicticio.save();
    res.send(`<h1>✅ Paciente Ficticio Creado</h1><p>Revisa la terminal de tu servidor o ve a http://localhost:3000/api/pacientes para ver la lista y la alerta activa.</p>`);
  } catch (error) {
    res.status(400).send(`<h1>❌ Error al crear</h1><p>${error.message}</p>`);
  }
});
