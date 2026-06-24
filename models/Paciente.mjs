import mongoose from 'mongoose';

const pacienteSchema = new mongoose.Schema({
  rut: { type: String, required: true, unique: true, index: true },
  nombre: { type: String, required: true, index: true },
  telefono: { type: String, required: true },
  correo: { type: String, required: true },
  direccion: { type: String, required: true },
  ciudad: { type: String, required: true },
  diagnostico1: { type: String, default: "" },
  diagnostico2: { type: String, default: "" },
  diagnostico3: { type: String, default: "" },
  fechaExamen: { type: Date, required: true },
  observaciones: { type: String, default: "" },
  requiereExamen: { type: Boolean, default: false }
}, { timestamps: true });

// Middleware automático pre-guardado para calcular las alertas en tiempo real
pacienteSchema.pre('save', function(next) {
  const hoy = new Date();
  this.requiereExamen = this.fechaExamen <= hoy;
  next();
});

export default mongoose.model('Paciente', pacienteSchema);
