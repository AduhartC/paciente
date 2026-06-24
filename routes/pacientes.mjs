import express from 'express';
import Paciente from '../models/Paciente.mjs';

const router = express.Router();

// Helper de búsqueda flexible (RUT exacto o Nombre parcial)
const buscarPorRutONombre = async (parametro) => {
  return await Paciente.findOne({
    $or: [
      { rut: parametro.trim() },
      { nombre: { $regex: parametro.trim(), $options: 'i' } }
    ]
  });
};

// 🟢 INGRESO: Registrar Paciente
router.post('/registro', async (req, res) => {
  try {
    const nuevoPaciente = new Paciente(req.body);
    await nuevoPaciente.save();
    res.status(201).json({ mensaje: 'Paciente registrado con éxito', paciente: nuevoPaciente });
  } catch (error) {
    res.status(400).json({ error: error.code === 11000 ? 'El RUT ya está registrado' : error.message });
  }
});

// 🔍 BUSCAR: Este endpoint es el que hace reaccionar al botón de Editar y Consulta
router.get('/buscar/:criterio', async (req, res) => {
  try {
    const paciente = await buscarPorRutONombre(req.params.criterio);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado en el sistema' });
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: 'Error interno en la búsqueda del servidor' });
  }
});

// 🟡 EDITAR: Actualizar registro usando el ID de MongoDB
router.put('/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    
    Object.assign(paciente, req.body);
    await paciente.save();
    res.json({ mensaje: 'Ficha médica actualizada con éxito', paciente });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el registro' });
  }
});

// 🔴 ELIMINAR: Borrar registro
router.delete('/:criterio', async (req, res) => {
  try {
    const paciente = await buscarPorRutONombre(req.params.criterio);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    
    await Paciente.findByIdAndDelete(paciente._id);
    res.json({ mensaje: `Paciente ${paciente.nombre} eliminado correctamente.` });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});

// 📅 FECHA EXAMEN: Listado cronológico
router.get('/listado-examenes', async (req, res) => {
  try {
    const pacientes = await Paciente.find()
      .select('nombre telefono correo fechaExamen requiereExamen')
      .sort({ fechaExamen: 1 })
      .lean();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar listado de exámenes' });
  }
});

export default router;
