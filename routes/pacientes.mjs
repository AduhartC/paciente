import express from 'express';
import Paciente from '../models/Paciente.mjs';

const router = express.Router();

// 🟢 CREATE
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

    if (!rut || !ficha || !nombre || !edad || !fechaNacimiento || !diagnostico) {
      return res.status(400).json({
        message: "Faltan campos obligatorios"
      });
    }

    const cleanRut = String(rut).trim();
    const cleanFicha = String(ficha).trim();

    const existe = await Paciente.findOne({
      $or: [{ rut: cleanRut }, { ficha: cleanFicha }]
    });

    if (existe) {
      return res.status(409).json({
        message: "Paciente ya existe"
      });
    }

    const nuevoPaciente = new Paciente({
      rut: cleanRut,
      ficha: cleanFicha,
      nombre: String(nombre).trim(),
      edad: Number(edad),
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

    res.status(201).json({
      message: "Paciente creado correctamente",
      data: saved
    });

  } catch (error) {
    res.status(500).json({
      message: "Error interno",
      error: error.message
    });
  }
});


// 🟢 SEARCH (ROBUSTO)
router.get('/buscar', async (req, res) => {
    try {
        const { buscar } = req.query;

        if (!buscar) {
            return res.status(400).json({ message: "Debe ingresar búsqueda" });
        }

        const pacientes = await Paciente.find({
            $or: [
                { rut: { $regex: buscar, $options: "i" } },
                { nombre: { $regex: buscar, $options: "i" } }
            ]
        });

        return res.json(Array.isArray(pacientes) ? pacientes : []);

    } catch (error) {
        return res.status(500).json({
            message: "Error al buscar paciente",
            error: error.message
        });
    }
});

// 🟢 UPDATE SEGURO
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 🔒 proteger campos críticos
        delete req.body.rut;
        delete req.body.nombre;

        const actualizado = await Paciente.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
                strict: false
            }
        );

        if (!actualizado) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        res.json({
            message: "Actualizado correctamente",
            data: actualizado
        });

    } catch (error) {
        console.error("PATCH ERROR:", error);
        res.status(500).json({
            message: "Error al actualizar",
            error: error.message
        });
    }
});

export default router;