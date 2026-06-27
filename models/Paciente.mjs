import mongoose from 'mongoose';

const PacienteSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: [true, 'El nombre del paciente es obligatorio'],
        trim: true
    },
    rut: {
        type: String,
        required: [true, 'El RUT es obligatorio'],
        unique: true,
        trim: true
    },
    edad: {
        type: Number,
        required: [true, 'La edad es obligatoria'],
        min: [0, 'La edad no puede ser menor a 0'],
        max: [120, 'La edad no puede superar los 120 años']
    },
    ficha: {
        type: String,
        required: [true, 'El número de ficha clínica es obligatorio'],
        unique: true,
        trim: true
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    fechaIngreso: {
        type: Date,
        required: [true, 'La fecha de registro es obligatoria'],
        default: Date.now
    },
    diagnostico: {
        type: String,
        required: [true, 'El diagnóstico principal es obligatorio'],
        trim: true
    },
    cirugiasPrevias: { type: String, trim: true, default: "" },
    biopsiasPrevias: { type: String, trim: true, default: "" },
    qtRtPrevia:      { type: String, trim: true, default: "" },
    presentadoComite: {
        type: String,
        enum: ['Sí', 'No'],
        required: true,
        default: 'No'
    },
    fechasEstudios: {
        tac:       { type: Date, default: null },
        petCt:     { type: Date, default: null },
        rnmCerebro:{ type: Date, default: null }
    },
    evaluaciones: {
        dlco:        { type: String, enum: ['Listo', 'Pendiente', 'No necesario'], default: 'Pendiente' },
        espirometria:{ type: String, enum: ['Listo', 'Pendiente', 'No necesario'], default: 'Pendiente' },
        ecocardio:   { type: String, enum: ['Listo', 'Pendiente', 'No necesario'], default: 'Pendiente' },
        especialidadPaseQx: { type: String, enum: ['Listo', 'Pendiente', 'No necesario'], default: 'Pendiente' }
    },
    examenes: {
        dlco:        { fechaSolicitud: { type: Date, default: null }, fechaRealizado: { type: Date, default: null } },
        espirometria:{ fechaSolicitud: { type: Date, default: null }, fechaRealizado: { type: Date, default: null } },
        ecocardio:   { fechaSolicitud: { type: Date, default: null }, fechaRealizado: { type: Date, default: null } },
        especialidadPaseQx: { fechaSolicitud: { type: Date, default: null }, fechaRealizado: { type: Date, default: null } }
    },
   
    otros:              { type: String, trim: true, default: "" }
},
{ timestamps: true }
);

const Paciente = mongoose.models.Paciente || mongoose.model('Paciente', PacienteSchema);

export default Paciente;