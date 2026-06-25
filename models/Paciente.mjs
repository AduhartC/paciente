import mongoose from 'mongoose';

const PacienteSchema = new mongoose.Schema({
    // Identificación Básica del Paciente
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

    // Historial Médico y Tratamiento
    diagnostico: { 
        type: String, 
        required: [true, 'El diagnóstico principal es obligatorio'], 
        trim: true 
    },
    cirugiasPrevias: { 
        type: String, 
        trim: true, 
        default: "" 
    },
    biopsiasPrevias: { 
        type: String, 
        trim: true, 
        default: "" 
    },
    qtRtPrevia: { 
        type: String, 
        trim: true, 
        default: "" 
    },

    // Comité Oncológico
    presentadoComite: { 
        type: String, 
        enum: {
            values: ['Sí', 'No'],
            message: 'El campo Comité Oncológico solo acepta "Sí" o "No"'
        },
        required: true, 
        default: 'No' 
    },

    // Seguimiento de Exámenes Imagenológicos (Objetos Anidados)
    fechasEstudios: {
        tac: { type: Date, default: null },
        petCt: { type: Date, default: null },
        rnmCerebro: { type: Date, default: null }
    },

    // Pruebas Funcionales Fisiológicas con Opciones Estrictas
    evaluaciones: {
        dlco: { 
            type: String, 
            enum: ['Listo', 'Pendiente', 'No necesario'], 
            required: true,
            default: 'Pendiente'
        },
        espirometria: { 
            type: String, 
            enum: ['Listo', 'Pendiente', 'No necesario'], 
            required: true,
            default: 'Pendiente'
        },
        ecocardio: { 
            type: String, 
            enum: ['Listo', 'Pendiente', 'No necesario'], 
            required: true,
            default: 'Pendiente'
        }
    },

    // Requerimientos Adicionales
    especialidadPaseQx: { 
        type: String, 
        trim: true, 
        default: null 
    },
    otros: { 
        type: String, 
        trim: true, 
        default: "" 
    }
}, 

const pacienteData = {
    nombre: document.getElementById('ing-nombre').value.trim(),
    rut: document.getElementById('ing-rut').value.trim(),

    edad: document.getElementById('ing-edad').value
        ? Number(document.getElementById('ing-edad').value)
        : undefined,

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

{
    // Crea automáticamente los campos createdAt y updatedAt para cada registro en Atlas
    timestamps: true 
});

// Exportar el modelo utilizando la sintaxis de módulos ES
const Paciente = mongoose.models.Paciente || mongoose.model('Paciente', PacienteSchema);
export default Paciente;
