router.post('/', async (req, res) => {
    try {
        const { rut, ficha, nombre } = req.body;

        if (!rut || !ficha || !nombre) {
            return res.status(400).json({
                message: "Campos obligatorios faltantes"
            });
        }

        const cleanRut = String(rut).trim();
        const cleanFicha = String(ficha).trim();
        const cleanNombre = String(nombre).trim();

        const pacienteExistente = await Paciente.findOne({
            $or: [
                { rut: cleanRut },
                { ficha: cleanFicha }
            ]
        });

        if (pacienteExistente) {
            return res.status(409).json({
                message: "Ya existe un paciente con ese RUT o ficha"
            });
        }

        const nuevoPaciente = new Paciente({
            rut: cleanRut,
            ficha: cleanFicha,
            nombre: cleanNombre,
            ...req.body
        });

        const pacienteGuardado = await nuevoPaciente.save();

        return res.status(201).json({
            message: "Paciente guardado correctamente",
            data: pacienteGuardado
        });

    } catch (error) {
        console.error("Error POST paciente:", error);

        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
});
export default router;