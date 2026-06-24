import mongoose from 'mongoose';

const PacienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    rut: { type: String, required: true, unique: true, trim: true },
    edad: { type: Number, required: true },
    ficha: { type: String, required: true, unique: true, trim: true },
    fechaNacimiento: { type: Date, required: true },
    fechaIngreso: { type: Date, required: true, default: Date.now },
    diagnostico: { type: String, required: true, trim: true },
    cirugiasPrevias: { type: String, trim: true, default: "" },
    biopsiasPrevias: { type: String, trim: true, default: "" },
    qtRtPrevia: { type: String, trim: true, default: "" },
    presentadoComite: { type: String, enum: ['Sí', 'No'], required: true, default: 'No' },
    fechasEstudios: {
        tac: { type: Date, default: null },
        petCt: { type: Date, default: null },
        rnmCerebro: { type: Date, default: null }
    },
    evaluaciones: {
        dlco: { type: String, enum: ['Listo', 'Pendiente', 'No necesario'], required: true },
        espirometria: { type: String, enum: ['Listo', 'Pendiente', 'No necesario'], required: true },
        ecocardio: { type: String, enum: ['Listo', 'Pendiente', 'No necesario'], required: true }
    },
    especialidadPaseQx: { type: String, trim: true, default: null },
    otros: { type: String, trim: true, default: "" }
}, {
    timestamps: true // Genera automáticamente createdAt y updatedAt en Atlas
});

export default mongoose.model('Paciente', PacienteSchema);
