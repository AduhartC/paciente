import express from 'express';
import Paciente from '../models/Paciente.mjs';

const router = express.Router();

// 🟢 CREAR PACIENTE COMPLETO (según schema real)
router.post('/', async (req, res) => {
  try {
    const {
      rut,
      ficha,
      nombre,
      edad,
      fechaNacimiento,
      diagnostico,
      presentadoComite,
      cirugiasPrevias,
      biopsiasPrevias,
      qtRtPrevia,
      especialidadPaseQx,
      otros,
      fechasEstudios,
      evaluaciones
    } = req.body;

    // 🔴 VALIDACIÓN SEGÚN SCHEMA (obligatorios reales)
    if (!rut || !ficha || !nombre || !edad || !fechaNacimiento || !diagnostico) {
      return res.status(400).json({
        message: "Faltan campos obligatorios del paciente"
      });
    }

    const cleanRut = String(rut).trim();
    const cleanFicha = String(ficha).trim();

    // 🔍 duplicados
    const existe = await Paciente.findOne({
      $or: [{ rut: cleanRut }, { ficha: cleanFicha }]
    });

    if (existe) {
      return res.status(409).json({
        message: "Paciente ya existe"
      });
    }

    // 🟢 CREACIÓN COMPLETA SEGÚN SCHEMA
    const nuevoPaciente = new Paciente({
      rut: cleanRut,
      ficha: cleanFicha,
      nombre: String(nombre).trim(),
      edad,
      fechaNacimiento,
      diagnostico,
      presentadoComite: presentadoComite || "No",

      cirugiasPrevias: cirugiasPrevias || "",
      biopsiasPrevias: biopsiasPrevias || "",
      qtRtPrevia: qtRtPrevia || "",

      especialidadPaseQx: especialidadPaseQx || null,
      otros: otros || "",

      fechasEstudios: fechasEstudios || {
        tac: null,
        petCt: null,
        rnmCerebro: null
      },

      evaluaciones: evaluaciones || {
        dlco: "Pendiente",
        espirometria: "Pendiente",
        ecocardio: "Pendiente"
      }
    });

    const saved = await nuevoPaciente.save();

    return res.status(201).json({
      message: "Paciente creado correctamente",
      data: saved
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
});

router.get('/buscar', async (req, res) => {
    try {
        const { rut, nombre } = req.query;

        const paciente = await Paciente.findOne({
            $or: [
                { rut: rut || null },
                { nombre: nombre || null }
            ]
        });

        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        res.json(paciente);

    } catch (error) {
        res.status(500).json({
            message: "Error al buscar paciente",
            error: error.message
        });
    }
});


router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // ❌ proteger campos críticos
        delete req.body.rut;
        delete req.body.nombre;

        const actualizado = await Paciente.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!actualizado) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        res.json({
            message: "Paciente actualizado correctamente",
            data: actualizado
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar paciente",
            error: error.message
        });
    }
});

export default router;