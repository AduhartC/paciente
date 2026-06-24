import express from 'express';
import Paciente from '../models/Paciente.mjs'; // Asegúrate de que la ruta a tu modelo sea la correcta

const router = express.Router();

// 📥 1. RUTA: REGISTRAR UN NUEVO PACIENTE (POST)
// Endpoint: POST /api/pacientes
router.post('/', async (req, res) => {
    try {
        const { rut, ficha, nombre } = req.body;

        // Validación de campos obligatorios en el servidor
        if (!rut || !ficha || !nombre) {
            return res.status(400).json({ 
                message: "Campos críticos ausentes. El RUT, N° de Ficha y Nombre son estrictamente obligatorios." 
            });
        }

        // Verificar si el paciente o la ficha ya existen en MongoDB Atlas
        const pacienteExistente = await Paciente.findOne({ 
            $or: [{ rut: rut.trim() }, { ficha: ficha.trim() }] 
        });

        if (pacienteExistente) {
            return res.status(409).json({ 
                message: "Conflicto: Ya existe un registro médico en el sistema con ese RUT o N° de Ficha." 
            });
        }

        // Crear una nueva instancia mapeada al modelo oncológico
        const nuevoPaciente = new Paciente(req.body);
        
        // Guardar la información de salud de manera asíncrona
        const pacienteGuardado = await nuevoPaciente.save();
        
        res.status(201).json({
            message: "Ficha oncológica almacenada exitosamente.",
            data: pacienteGuardado
        });

    } catch (error) {
        console.error("Error en servidor al guardar paciente:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al procesar el alta clínica.", 
            error: error.message 
        });
    }
});

// 📤 2. RUTA: OBTENER TODOS LOS PACIENTES (GET)
// Endpoint: GET /api/pacientes
router.get('/', async (req, res) => {
    try {
        // Recuperar registros ordenados de forma descendente por su fecha de creación
        const listaPacientes = await Paciente.find().sort({ createdAt: -1 });
        res.status(200).json(listaPacientes);
    } catch (error) {
        console.error("Error al consultar pacientes:", error);
        res.status(500).json({ message: "No se pudieron recuperar las fichas clínicas." });
    }
});

// 🔍 3. RUTA: BUSCAR PACIENTE INDIVIDUAL POR RUT (GET)
// Endpoint: GET /api/pacientes/:rut
router.get('/:rut', async (req, res) => {
    try {
        const pacienteEncontrado = await Paciente.findOne({ rut: req.params.rut.trim() });
        
        if (!pacienteEncontrado) {
            return res.status(404).json({ message: "Paciente no encontrado en el sistema." });
        }
        
        res.status(200).json(pacienteEncontrado);
    } catch (error) {
        console.error("Error al buscar paciente:", error);
        res.status(500).json({ message: "Error interno durante la búsqueda." });
    }
});

export default router;
